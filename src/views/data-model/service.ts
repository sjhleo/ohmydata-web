import serviceHandler from "@/decorators/service";
import { QueryModel } from "@/models";
import CommonService from "@/services/common-service";
import { DataModel } from "./entity";

export default class DataModelService extends CommonService {
    // 数据模型
    @serviceHandler({ title: "分页查询数据模型" })
    public dataModel(queryModel: QueryModel<any>) {
        return this._post<any>("/v1/data-model/page", queryModel);
    }

    @serviceHandler({ title: "查询特定数据模型" })
    public getModelById(id: any) {
        return this._get<any>(`/v1/data-model/${id}`);
    }
    @serviceHandler({ title: "查询特定数据模型" })
    public deleteModelById(id: any) {
        return this._delete<any>(`/v1/data-model/${id}`);
    }
    @serviceHandler({
        title: "保存数据模型"
    })
    public saveDataModel(model: DataModel) {
        if (model.id) {
            return this._put<any>("/v1/data-model", model);
        } else {
            return this._post<any>("/v1/data-model", model);
        }
    }
    @serviceHandler({ title: "删除数据模型" })
    public deleteDataModel(idArray: any) {
        return this._post<any>("/v1/data-model", idArray);
    }

    @serviceHandler({ title: "解析请求参数" })
    public resolveParams(condition: any) {
        return this._post<any>("/v1/data-model/request-param", condition);
    }
    @serviceHandler({
        title: "预览表达式数据"
    })
    public previewData(condition: any) {
        return this._post<any>("/v1/data-model/preview-expression", condition);
    }
    @serviceHandler({
        title: "预览数据模型最终接口数据"
    })
    public previewFinalData(condition: any) {
        return this._post<any>("/v1/data-model/preview", condition);
    }

    @serviceHandler({ title: "获取mavonDoc文档" })
    public getMavonDoc(id: any) {
        return this._get<any>(`/v1/data-model/${id}/render`);
    }
}
