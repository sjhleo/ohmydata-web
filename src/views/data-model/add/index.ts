import "./index.scss";
import RequestParameterList from "@/views/data-model/components/request-parameter-list";
import CodeEditor from "@/components/code-editor";
import RunningResult from "@/views/data-model/components/result-modal";
import autowired from "@/decorators/autowired";
import DataSourceService from "@/views/data-source/service";
import DataModelService from "../service";
import SelectTree from "../components/category-select";
import { CategoryDataUtil } from "@/views/data-source/tree/common-tree";
import { DataModel, ReponseParam, RequestParam } from "../entity";
import ResponseParameterList from "../components/response-parameter-list";
import CommonView from "@/views/common-view";
import { Component, Watch } from "vue-property-decorator";
@Component({
    name: "data-model-add",
    template: require("./index.html"),
    components: {
        "u-request-parameter-list": RequestParameterList,
        "u-response-parameter-list": ResponseParameterList,
        "u-process-result": RunningResult,
        "u-select-tree": SelectTree
    }
})
export default class DataModelAdd extends CommonView {
    // 新增模型数据集
    public data: DataModel = new DataModel();
    public addUUid: string = "";
    @autowired(DataSourceService)
    public dataSourceService!: DataSourceService;
    @autowired(DataModelService)
    public service!: DataModelService;
    // 表单验证规则
    public validateDataForm = {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        sourceId: [
            { required: true, message: "请选择数据源", trigger: "blur,change" }
        ],
        categoryId: [
            { required: true, message: "请选择分组", trigger: "blur,change" }
        ]
    };
    // 分组列表
    public catagoryList: Array<any> = [];

    // 数据源列表
    public dataSourceList: Array<any> = [];
    public sqlOption: any = {};

    public previewJson: string = "";
    public panelShow: boolean = false;
    // public requestParams: Array<RequestParam> = [];
    // public responseParams: Array<ReponseParam> = [];
    public resultData: Array<any> = [];
    public resultShow: boolean = false;
    public context: any = {};

    public controlDisabled = true;

    public initFunction() {
        let { uuid } = this.$route.query;
        if (uuid && this.addUUid !== uuid) {
            this.data = new DataModel();
            this.initCode();
        }
        this.addUUid = uuid as string;
        this.init();
    }
    public initCode() {
        (this.$refs.sql as CodeEditor).setCode(this.data.expression);
        (this.$refs.resultJson as CodeEditor).setCode("");
    }
    public init() {
        this.getDataSourceList();
        this.getCategoryTree();
    }
    public onSelectCategory(category: any) {
        this.data.categoryId = category.id;
        this.data.categoryName = category.name;
    }
    public async getDataSourceList() {
        let result = await this.dataSourceService.getDataSourceList();
        this.dataSourceList = result || [];
    }
    public async getCategoryTree() {
        let result = await this.service.getCategoryTree();
        this.catagoryList = CategoryDataUtil.handlerTreeData(
            result.result || [],
            "name"
        );
    }
    // 运行
    public async onProcess() {
        if (!this.data.sourceId) {
            return this.$Message.warning("请选择数据源");
        }
        this.resolveParams()
            .then(() => {
                this.resultShow = true;
            })
            .catch(() => this.$Message.error("解析请求参数失败,请检查sql语法"));
    }
    public async resolveParams() {
        let result = await this.service.resolveParams({
            expression: this.data.expression
        });
        if (result && !result.hasError) {
            this.data.requestParams = result.result || [];
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    }

    public onPreview() {
        this.panelShow = true;
    }
    public async onProcessPreview() {
        this.previewJson = "";
        let result = await this.service.previewFinalData({
            ...this.data,
            ...{ context: this.context }
        });
        this.previewJson = JSON.stringify(result.result || [], null, 4);
        (this.$refs.resultJson as CodeEditor).setCode(this.previewJson);
    }

    public async onDetermine() {
        if (!this.validateForm("dataModelForm")) {
            return;
        }
        let result = await this.service.saveDataModel(this.data);
        if (result && !result.hasError && !this.data.id) {
            let detail = await this.service.getModelById(result.result);
            this.data = detail.result;
        }
    }

    public onCancel() {
        this.$store.commit("tag/closeCurrent", this.$route);
        this.$router.go(-1);
    }
    @Watch("data.sourceId")
    public async getTables() {
        if (!this.data.sourceId) {
            return;
        }
        let result = await this.dataSourceService.getTables(this.data.sourceId);
        let obj: any = {};
        (result.result || []).forEach((tableName: string) => {
            obj[tableName] = [];
        });
        this.sqlOption = {
            hintOptions: {
                completeSingle: false,
                // 自定义提示选项
                tables: obj
            }
        };
    }
    public async onRunning(context: any) {
        let result = await this.service.previewData({
            sourceId: this.data.sourceId,
            expression: this.data.expression,
            context: context
        });
        this.resultData = result.result || [];
        // this.data.responseParams = [];
        // if (this.resultData.length > 0) {
        //     Object.keys(this.resultData[0]).forEach(key => {
        //         let param = new ReponseParam();
        //         param.name = key;
        //         this.data.responseParams.push(param);
        //     });
        // }
    }

    public onSaveRunning() {
        this.data.responseParams = [];
        if (this.resultData.length > 0) {
            Object.keys(this.resultData[0]).forEach(key => {
                let param = new ReponseParam();
                param.name = key;
                this.data.responseParams.push(param);
            });
        }
    }

    // 是否开启缓存切换
    public onSwitchChange(value: boolean) {
        console.log(value);
        if (value) {
            this.controlDisabled = false;
        } else {
            this.controlDisabled = true;
        }
    }

    public validateForm(name: string) {
        let res = false;
        (this.$refs[name] as any).validate((valid: any) => {
            if (valid) {
                res = true;
            } else {
                this.$Message.info("请输入正确信息");
            }
        });
        return res;
    }
}
