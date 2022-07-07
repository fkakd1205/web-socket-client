import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const userApiConnect = () => {
    return {
        searchList: async function (id) {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/user`, {
                // withCredentials: true
            });
        },
        
    }
}

export {
    userApiConnect   
}