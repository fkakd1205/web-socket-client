import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const userApiConnect = () => {
    return {
        searchList: async function () {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/user`, {
                withCredentials: true
            });
        },
        postLogin: async function (data) {
            return await axios.post(`${API_SERVER_ADDRESS}/api/v1/user/login`, data, {
                withCredentials: true
            });
        }
        
    }
}

export {
    userApiConnect   
}