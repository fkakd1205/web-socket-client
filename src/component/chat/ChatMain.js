import { useEffect, useReducer, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { chatApiConnect } from "../../api/chatApiConnect";
import { userApiConnect } from "../../api/userApiConnect";
import { useSelector } from "react-redux";

const ChatMain = () => {
    const [userList, dispatchUserList] = useReducer(userListReducer, initialUserList);
    const userRdx = useSelector(state => state.userReducer);

    const callback = async (e) => {
        let body = JSON.parse(e.body);
        if (body?.statusCode === 200) {
            if (body?.socketMemo) {
                alert(body?.socketMemo);
            }
        }
    }

    const client = new StompJs.Client({
        // brokerURL: 'ws://localhost:8081/ws',
        webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: (e) => {
            console.log("connection success.");
            client.subscribe('/topic/message', callback);
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
        await chatApiConnect().sendMessage()
            .catch(err => {
                let res = err.response;
                if (res?.status === 500) {
                    alert('undefined error.');
                    return;
                }
                alert(res?.data?.memo);
            });
    }

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
                    console.log(res.data.data);
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

    return (
        <>
            <div>
                <button onClick={__reqCreateMessage}>전송</button>
            </div>

            <div>
                <div>*User List*</div>
                {userList?.map((r, idx) => {
                    return (
                        <div key={'user-list-idx' + idx}>
                            <button type='button' value={r.id} onClick={onActionCreateMessageToUser}>{r.name}</button>
                        </div>
                    )
                })
                }
            </div>
        </>
    )
}

export default ChatMain;

const initialUserList = null;

const userListReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialUserList;
        default: return {...state};
    }
}
