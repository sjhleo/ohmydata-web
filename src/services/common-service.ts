import BaseService from "./base-service";
import serviceHandler from "@/decorators/service";

export default class CommonService extends BaseService {
    @serviceHandler({ title: "查询枚举" })
    public async getEnumByType(type: string) {
        return this._get<any>(`/v1/dict/${type}`);
    }
    @serviceHandler({ title: "查询字典" })
    public async getItemList(
        type: string,
        groupId: string = "base"
    ): Promise<any> {
        return this._get<any>(`/v1/dictionary/item/${groupId}:${type}/list`);
    }
    @serviceHandler({ title: "新增分类" })
    public saveCategory(category: any) {
        return this._post<any>("/v1/category", category);
    }
    @serviceHandler({ title: "编辑分类" })
    public editCategory(category: any) {
        return this._put<any>("/v1/unity/category", category);
    }
    @serviceHandler({ title: "删除分类" })
    public deleteCategory(id: string) {
        return this._delete(`/v1/category/${id}?@state=ddcat`);
    }
    @serviceHandler({ title: "获取分类树" })
    public getCategoryTree(type: string = "ddcat") {
        return this._get<any>(`/v1/category/tree?type=${type}`);
    }
}
