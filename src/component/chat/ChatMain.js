import { useEffect } from "react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { chatApiConnect } from "../../api/chatApiConnect";

const ChatMain = () => {
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
    }, [])

    const onSubmitCreateMessage = async () => {
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

    return (
        <>
            <button onClick={onSubmitCreateMessage}>전송</button>
        </>
    )
}

export default ChatMain;