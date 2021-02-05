import serviceHandler from "@/decorators/service";
import CommonService from "@/services/common-service";

export default class SQLControlerService extends CommonService {
    @serviceHandler({ title: "查询sql" })
    public select(dataSourceId: string, qm: any) {
        return this._post<any>(
            `${this.server}/unity/source/${dataSourceId}/sql?@state=select`, qm
        );
    }
}
