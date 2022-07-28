import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const channelApiConnect = () => {
    return {
        searchList: async function () {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/channel`, {
                withCredentials: true
            });
        }
    }
}

export {
    channelApiConnect   
}