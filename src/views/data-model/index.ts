import "./index.scss";
import { CategoryDataUtil } from "@/views/data-source/tree/common-tree";
import DataModelTree from "@/views/data-model/components/tree";
import DataModelList from "@/views/data-model/components/list";
import autowired from "@/decorators/autowired";
import DataModelService from "@/views/data-model/service";
import { QueryModel } from "@/models";
import { Component } from "vue-property-decorator";
import Vue from "vue";

@Component({
    name: "data-model-list",
    template: require("./index.html"),
    components: {
        "u-tree": DataModelTree,
        "u-model-list": DataModelList
    }
})
export default class DataModel extends Vue {
    @autowired(DataModelService)
    public service!: DataModelService;

    public split: number | string = "300px";
    public isLoading = false;
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
    // 点击查询 设置condition并调用查询方法
    public onSearch(searchCondition: any) {
        this.condition = searchCondition;
        this.getTableData();
    }
    public mounted() {
        this.onSearch({});
    }
    // 获取对应分组的表格数据
    public async getTableData() {
        let queryModel: QueryModel<any> = Object.create(null);
        queryModel.condition = this.condition;
        queryModel.paging = this.paging;
        let res = await this.service.dataModel(queryModel);
        if (res && res.success) {
            this.data = res.data?.data || [];
            this.paging.totalCount = res.data?.total || 0;
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
}
