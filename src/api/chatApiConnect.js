import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const chatApiConnect = () => {
    return {
        sendMessage: async function () {
            let data = {
                username: '챈',
                content: 'hihi',
                dateTime: new Date()
            }
            return await axios.post(`${API_SERVER_ADDRESS}/ws/v1/chat/message`, data, {
                // withCredentials: true
            });
        }
    }
}

export {
    chatApiConnect   
}