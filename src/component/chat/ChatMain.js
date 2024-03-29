import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { chatApiConnect } from "../../api/chatApiConnect";
import { userApiConnect } from "../../api/userApiConnect";
import { useSelector } from "react-redux";
import ChatBody from "./ChatBody";

const Container = styled.div`
`;

const ChatMain = (props) => {
    const [userList, dispatchUserList] = useReducer(userListReducer, initialUserList);
    const userRdx = useSelector(state => state.userReducer);
    const [sendMessage, dispatchSendMessage] = useReducer(sendMessageReducer, initalSendMessage);
    const [chattingLog, dispatchChattingLog] = useReducer(chattingLogReducer, initalChattingLog);

    const callback = async (e) => {
        let body = JSON.parse(e.body);
        if (body?.statusCode === 200) {
            if (body?.socketMemo) {
                dispatchChattingLog({
                    type: 'ADD_DATA',
                    payload: body?.data
                });
            }
        }
    }

    const client = new StompJs.Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: (e) => {
            console.log("connection success.");
            // 모든 유저가 전달하는 message를 받는다
            client.subscribe('/topic/message', callback);

            // 내 아이디에 깨우기 알림을 받는다.
            // TODO :: 확인하기
            client.subscribe(`/topic/message/${userRdx?.userInfo?.id}`, callback);
        },
        onStompError: (e) => {
            console.log("connection error.");
            console.log("error : " + e);
        },
        onDisconnect: (e) => {
            console.log("disconnected.");
        }
    });

    useEffect(() => {
        client.activate();

        return () => {
            client.deactivate();
        }
    }, [])

    useEffect(() => {
        async function fetchInit() {
            await onActionSearchUser();
        }

        fetchInit();
    }, [])

    const __reqCreateMessage = async () => {
        await chatApiConnect().sendMessage(sendMessage)
            .catch(err => {
                let res = err.response;
                if (res?.status === 500) {
                    alert('undefined error.');
                    return;
                }
                alert(res?.data?.memo);
            });
    }

    // STEP 2.
    const __reqCreateMessageToUser = async (userId) => {
        await chatApiConnect().sendMessageToUser(userId)
            .then(res => {
                if(res.status === 200) {
                    alert('전송 완료.');
                }
            })
            .catch(err => {
                let res = err.response;
                if (res?.status === 500) {
                    alert('undefined error.');
                    return;
                }
                alert(res?.data?.memo);
            });
    }

    const onActionSearchUser = async () => {
        await userApiConnect().searchList()
            .then(res => {
                if (res.status === 200) {
                    dispatchUserList({
                        type: 'INIT_DATA',
                        payload: res.data.data
                    })
                }
            })
            .catch(err => {
                let res = err.response;
                if (res?.status === 500) {
                    alert('undefined error.');
                    return;
                }
                alert(res?.data?.memo);
            });
    }

    const onActionCreateMessageToUser = async (e) => {
        let receiverId = e.target.value;
        await __reqCreateMessageToUser(receiverId)
    }

    // STEP 3.
    const onChangeSendMessageValue = (e) => {
        dispatchSendMessage({
            type: 'CHANGE_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        })
    }

    const onSubmitSendMessageToUser = async (e) => {
        e.preventDefault();

        await __reqCreateMessage();
        dispatchSendMessage({
            type: 'CLEAR'
        })
    }

    return (
        <Container>
            <ChatBody
                chattingLog={chattingLog}
                sendMessage={sendMessage}

                onChangeSendMessageValue={onChangeSendMessageValue}
                onSubmitSendMessageToUser={onSubmitSendMessageToUser}
            ></ChatBody>
        </Container>
    )
}

export default ChatMain;

const initialUserList = null;
const initalSendMessage = null;
const initalChattingLog = [];

const userListReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialUserList;
        default: return {...state};
    }
}

const sendMessageReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CHANGE_DATA':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case 'CLEAR':
            return initalSendMessage;
        default: return {...state};
    }
}

const chattingLogReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'ADD_DATA':
            return state.concat(action.payload);
        case 'CLEAR':
            return initalChattingLog;
        default: return {...state};
    }
}
