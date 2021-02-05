import serviceHandler from "@/decorators/service";
import CommonService from "@/services/common-service";

export default class DataSourceService extends CommonService {
    @serviceHandler({ title: "查询数据源表" })
    public getTables(dataSourceId: string) {
        return this._get<any>(
            `${this.server}/unity/source/${dataSourceId}/tables`
        );
    }
    @serviceHandler({ title: "查询数据表字段" })
    public getTableFields(dataSourceId: string, tableName: string) {
        return this._get<any>(
            `${this.server}/unity/source/${dataSourceId}/table/${tableName}`
        );
    }
    @serviceHandler({ title: "查询数据源", dataName: "result" })
    public getDataSourceList(condition = {}): Promise<any> {
        return this._post<any>(`${this.server}/unity/source/list`, condition);
    }

    @serviceHandler({ title: "验证连接" })
    public checkDataSource(data: any): Promise<any> {
        return this._post<any>(`${this.server}/unity/source/valid`, data);
    }

    @serviceHandler({ title: "添加/编辑数据源", dataName: "result" })
    public updateDataSource(data: any): Promise<any> {
        if (data.id) {
            return this._put<any>(`${this.server}/unity/source`, data);
        } else {
            return this._post<any>(`${this.server}/unity/source`, data);
        }
    }

    @serviceHandler({ title: "删除数据源", dataName: "result" })
    public deleteDataSource(id: any): Promise<any> {
        return this._delete<any>(`${this.server}/unity/source/${id}`);
    }

    @serviceHandler({ title: "删除表", dataName: "result" })
    public deleteTable(data: any): Promise<any> {
        return this._delete<any>(
            `${this.server}/unity/source/${data.id}/table/${data.table}`
        );
    }

    @serviceHandler({ title: "分页查询" })
    public getTableData(params: any, data: object = {}): Promise<any> {
        return this._post<any>(
            `${this.server}/unity/source/${params.id}/table/${params.name}`,
            data
        );
    }

    public export(params: any, data: object = {}): Promise<any> {
        return this._export(
            `${this.server}/unity/source/${params.id}/table/${params.name}/export`,
            "application/vnd.ms-excel",
            data
        );
    }
    @serviceHandler({ title: "数据源类型" })
    public getTypeList(): Promise<any> {
        return this._get<any>(`${this.server}/free/display/source-type`);
    }
}
