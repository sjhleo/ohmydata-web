import serviceHandler from "@/decorators/service";
import BaseService from "@/services/base-service";
import axios from "axios";
import Cookies from "js-cookie";

export default class LoginService extends BaseService {
    /**
     * 登录
     * @param username
     * @param password
     */
    public async login(username: string, password: string): Promise<any> {
        return this._post("/v1/user/login", {
            username,
            password
        });
    }
}
