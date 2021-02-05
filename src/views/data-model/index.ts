import "./index.scss";
import { CategoryDataUtil } from "@/views/data-source/tree/common-tree";
import DataModelTree from "@/views/data-model/components/tree";
import DataModelList from "@/views/data-model/components/list";
import autowired from "@/decorators/autowired";
import DataModelService from "@/views/data-model/service";
import CategoryModal from "@/views/data-model/components/category-modal";
import { QueryModel } from "@/models";
import { Component } from "vue-property-decorator";
import Vue from "vue";

@Component({
    name: "data-model-list",
    template: require("./index.html"),
    components: {
        "u-tree": DataModelTree,
        "u-model-list": DataModelList,
        "u-category-modal": CategoryModal
    }
})
export default class DataModel extends Vue {
    @autowired(DataModelService)
    public service!: DataModelService;

    public split: number | string = "300px";
    public isLoading = false;

    // 新增编辑节点分类 显隐 类型树 当前编辑项
    public categoryModalShow: boolean = false;
    public categories: Array<any> = [];

    // 原始的树形结构
    public dataModelList: Array<any> = [];

    // 当前选中的数据模型
    public currentDataModel: any = {};

    // 当前操作（修改/删除）的数据模型
    public current: any = {};

    // 当前的查询条件
    public condition: any = {
        categoryId: "",
        code: "",
        name: ""
    };

    // 分页
    public paging = {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
    };

    // 传给表格的数据
    public data: Array<any> = [];

    public mounted() {
        this.init();
    }

    public init() {
        this.getTypeList();
    }

    // 获取数据模型树形结构
    public async getTypeList() {
        this.isLoading = true;
        let res = await this.service.getCategoryTree();
        this.isLoading = false;
        if (res && res.success) {
            this.dataModelList = CategoryDataUtil.handlerTreeData(
                res.data,
                "name"
            );
            this.setCategoryTree(res.data);
        }
    }

    // 设置新增编辑分组中选择所属分组的树形结构
    public setCategoryTree(result: Array<any>) {
        this.categories = [];
        result.forEach((item: any) => {
            let node = this.setCategoryNode(item);
            this.categories.push(node);
        });
    }

    public setCategoryNode(item: any) {
        let temp: any = {};
        temp = item.$clone();
        return temp;
    }

    // 选中某一数据模型分组
    public onDataModelSelect(data: any) {
        this.currentDataModel = data;
        this.condition.categoryId = this.currentDataModel.id;
        this.getTableData();
    }

    // 未选中分组时的右侧提示信息
    public get message() {
        let message = null;
        if (!this.currentDataModel.id) {
            message = "请在左侧数据模型列表中选择一个数据模型";
        }
        if (this.dataModelList && !this.dataModelList.length) {
            message = "暂无数据模型，请在左侧列表中创建一个数据模型";
        }
        return message;
    }

    // 点击查询 设置condition并调用查询方法
    public onSearch(searchCondition: any) {
        this.condition = searchCondition;
        this.condition.categoryId = this.currentDataModel.id;
        this.getTableData();
    }

    // 获取对应分组的表格数据
    public async getTableData() {
        let queryModel: QueryModel<any> = Object.create(null);
        queryModel.condition = this.condition;
        queryModel.paging = this.paging;
        let res = await this.service.dataModel(queryModel);
        if (res && res.success) {
            this.data = res.data;
            this.paging.totalCount = res.totalCount;
        }
    }

    // 切换页
    public onPageIndexChange(index: number) {
        this.paging.pageIndex = index;
        this.getTableData();
    }

    // 切换每页显示条目
    public onPageSizeChange(pageSize: number) {
        this.paging.pageSize = pageSize;
        this.getTableData();
    }

    // 新增数据模型
    public onAddFolder() {
        this.current = {};
        this.categoryModalShow = true;
    }

    // 点击编辑分组
    public onEditHandle(current: any) {
        this.current = current.$clone();
        this.current.parentName = this.findNodeName(
            this.dataModelList,
            this.current.parentId
        );
        console.log(this.current);
        this.categoryModalShow = true;
    }

    // 根据id获取对应的name名
    public findNodeName(arr: Array<any>, nodeId: string) {
        let nodeName: string = "";
        arr.forEach((item: any) => {
            if (item.id === nodeId) {
                nodeName = item.name;
            } else {
                if (item.children && item.children.length !== 0) {
                    this.findNodeName(item.children, nodeId);
                }
            }
        });
        return nodeName;
    }

    // 点击移除分组
    public onDeleteHandle(current: any) {
        this.$Modal.confirm({
            title: "警告",
            content: "确认删除该数据模型分组吗？",
            onOk: async () => {
                let res: any = this.service.deleteCategory(current.id);
                if (res && res.success) {
                    this.$Message.success("删除数据模型分组成功");
                    this.getTypeList();
                }
            }
        });
    }
}
