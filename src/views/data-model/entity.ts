export class DataModel {
    public id: string = "";
    public code: string = "";
    public name: string = "";
    public description: string = "";
    // 分组ID
    public categoryId: string = "";
    public categoryName: string = "";
    // 服务源
    public sourceId: string = "";
    // 表达式（SQL模板）
    public expression: string = "select * from com_login_log where ip='{{.IP}}'";
    // 是否开启缓存
    public enableCache: boolean = false;
    // 过期时间
    public expireSeconds: boolean | null = null;
    public requestParams: Array<RequestParam> = [];
    // 响应参数
    public responseParams: Array<ReponseParam> = [];
}
export class RequestParam {
    public id: string = "";
    public defaultValue: any = null;
    public description: string = "";
    public location: string = "";
    public _location: any = {};
    public modelId: string = "";
    public name: string = "";
    public required: boolean = true;
    public type: string = "";
    public _type: any = {};
}
export class ReponseParam {
    public id: string = "";
    public description: string = "";
    public name: string = "";
    public convertType: string = "";
    public convertValue: string = "";
    public type: string = "";
    public _type: any = {};
}
