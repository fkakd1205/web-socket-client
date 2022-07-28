import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const chatApiConnect = () => {
    return {
        sendMessage: async function (data) {
            return await axios.post(`${API_SERVER_ADDRESS}/ws/v1/chat/message`, data, {
                withCredentials: true
            });
        },
        sendMessageToUser: async function (userId) {
            return await axios.post(`${API_SERVER_ADDRESS}/ws/v1/chat/message/${userId}`, '', {
                withCredentials: true
            });
        },
        sendMessageToRoom: async function (channelId, data) {
            return await axios.post(`${API_SERVER_ADDRESS}/ws/v1/chat/message/channel/${channelId}`, data, {
                withCredentials: true
            });
        } 
    }
}

export {
    chatApiConnect   
}