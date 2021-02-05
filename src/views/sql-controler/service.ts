import serviceHandler from "@/decorators/service";
import CommonService from "@/services/common-service";

export default class SQLControlerService extends CommonService {
    @serviceHandler({ title: "查询sql", dataName: "data" })
    public select(dataSourceId: string, qm: any) {
        return this._post<any>(`/v1/data-source/${dataSourceId}/query`, qm);
    }
}
