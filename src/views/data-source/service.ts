import serviceHandler from "@/decorators/service";
import CommonService from "@/services/common-service";

export default class DataSourceService extends CommonService {
    @serviceHandler({ title: "查询数据源表" })
    public getTables(dataSourceId: string) {
        return this._get<any>(`/v1/data-source/${dataSourceId}/tables`);
    }
    @serviceHandler({ title: "查询数据表字段" })
    public getTableFields(dataSourceId: string, tableName: string) {
        return this._get<any>(
            `/v1/data-source/${dataSourceId}/table?name=${tableName}`
        );
    }
    @serviceHandler({ title: "查询数据源", dataName: "data" })
    public getDataSourceList(): Promise<any> {
        return this._get<any>("/v1/data-source/list");
    }

    @serviceHandler({ title: "验证连接" })
    public checkDataSource(data: any): Promise<any> {
        return this._post<any>("/v1/data-source/test", data);
    }

    @serviceHandler({ title: "添加/编辑数据源", dataName: "data" })
    public updateDataSource(data: any): Promise<any> {
        if (data.id) {
            return this._put<any>("/v1/data-source", data);
        } else {
            return this._post<any>("/v1/data-source", data);
        }
    }

    @serviceHandler({ title: "删除数据源", dataName: "data" })
    public deleteDataSource(id: any): Promise<any> {
        return this._delete<any>(`/v1/data-source/${id}`);
    }

    @serviceHandler({ title: "删除表", dataName: "data" })
    public deleteTable(data: any): Promise<any> {
        return this._delete<any>(
            `/v1/data-source/${data.id}/table/${data.table}`
        );
    }

    @serviceHandler({ title: "分页查询", dataName: "data" })
    public getTableData(params: any, data: object = {}): Promise<any> {
        return this._post<any>(
            `/v1/data-source/${params.id}/data?name=${params.name}`,
            data
        );
    }

    public export(params: any, data: object = {}): Promise<any> {
        return this._export(
            `/v1/data-source/${params.id}/table/${params.name}/export`,
            "application/vnd.ms-excel",
            data
        );
    }
}
