import BaseService from "./base-service";
import serviceHandler from "@/decorators/service";

export default class CommonService extends BaseService {
    @serviceHandler({ title: "查询枚举" })
    public async getEnumByType(type: string) {
        return this._get<any>(`/v1/dict/${type}`);
    }
}
