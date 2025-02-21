import axios from "axios";

const instance = axios.create({
    baseURL: "https://prog4fun.ru/backend/api",
    timeout: 5000
});

export default instance