import axios from "axios";
import Cookies from "js-cookie";
export default function axiosConfig() {
    console.log("axios");
    // Axios请求拦截器，随着业务的复杂，Axios层的使用将会越来越复杂，写个精简版的就行了。
    axios.interceptors.request.use(
        config => {
            config.headers.Authorization = "Bearer " + Cookies.get("token");
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
            if (e.toString().indexOf("401") !== -1) window.location.href = "/#/login";
            // Do something with response error
            return Promise.reject(e);
        }
    );
}
