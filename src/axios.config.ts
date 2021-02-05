import axios from "axios";
export default function axiosConfig() {
    console.log("axios");
    // Axios请求拦截器，随着业务的复杂，Axios层的使用将会越来越复杂，写个精简版的就行了。
    axios.interceptors.request.use(
        config => {
            // Do something with config
            return config;
        },
        error => {
            console.error(error);
            return Promise.reject(error);
        }
    );
    axios.interceptors.response.use(
        res => {
            // Do something with response data
            return res;
        },
        e => {
            // Do something with response error
            return Promise.reject(e);
        }
    );
}
