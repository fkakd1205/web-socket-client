import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { chatApiConnect } from "../../api/chatApiConnect";
import ChatRoomBody from "./ChatRoomBody";

const Container = styled.div`
    width: 60%;
    text-align: center;
`;

const ChatRoomMain = (props) => {
    const [chatRoom, dispatchChatRoom] = useReducer(chatRoomReducer, initialChatRoom);
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
            client.subscribe(`/topic/message/channel/${chatRoom?.id}`, callback);
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
        if(!chatRoom){
            return;
        }

        client.activate();

        return () => {
            client.deactivate();
        }
    }, [chatRoom])

    useEffect(() => {
        if(!props.channelData) {
            return;
        }

        dispatchChatRoom({
            type: 'INIT_DATA',
            payload: props.channelData
        })

        dispatchChattingLog({type: 'CLEAR'});
        dispatchSendMessage({type: 'CLEAR'});
    }, [props.channelData])

    // 현재 접속한 채팅룸에 메시지를 전송한다
    // STEP 4.
    const __reqCreateMessageToRoom = async () => {
        await chatApiConnect().sendMessageToRoom(chatRoom?.id, sendMessage)
            .catch(err => {
                let res = err.response;
                if (res?.status === 500) {
                    alert('undefined error.');
                    return;
                }
                alert(res?.data?.memo);
            });
    }

    // STEP 4.
    const onChangeSendMessageValue = (e) => {
        dispatchSendMessage({
            type: 'CHANGE_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        })
    }

    const onSubmitSendMessageToRoom = async (e) => {
        e.preventDefault();

        await __reqCreateMessageToRoom();
        dispatchSendMessage({
            type: 'CLEAR'
        })
    }

    return (
        chatRoom &&
        <Container>
            <ChatRoomBody
                chattingLog={chattingLog}
                sendMessage={sendMessage}
                chatRoom={chatRoom}

                onChangeSendMessageValue={onChangeSendMessageValue}
                onSubmitSendMessageToRoom={onSubmitSendMessageToRoom}
            ></ChatRoomBody>
        </Container>
    )
}

export default ChatRoomMain;

const initialChatRoom = null;
const initalSendMessage = null;
const initalChattingLog = [];

const chatRoomReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialChatRoom;
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
