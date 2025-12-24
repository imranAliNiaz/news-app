import axios from "axios";

const axiosNytInstance = axios.create({
    baseURL: "https://api.nytimes.com/svc",
    timeout: 10000,
});

export default axiosNytInstance;
