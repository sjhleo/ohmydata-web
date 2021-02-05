import "./index.scss";
import DataSourceTree from "./tree";
import DataSourceTableView from "./table-view";
import { CategoryDataUtil } from "./tree/common-tree";
import AddlDataBaseComponent from "./add-database-modal";
import DetailDataBaseComponent from "./detail-database-modal";
import TableFieldsComponent from "./table-fields-modal";
import DataSourceService from "./service";
import autowired from "@/decorators/autowired";
import { Paging } from "@/models";
import DataSourceList from "./list";
import { Component, Vue } from "vue-property-decorator";
@Component({
    name: "data-source-list",
    template: require("./index.html"),
    components: {
        "u-tree": DataSourceTree,
        "u-list": DataSourceList,
        "u-table-view": DataSourceTableView,
        "u-add-modal": AddlDataBaseComponent,
        "u-detail-modal": DetailDataBaseComponent,
        "u-table-fields-modal": TableFieldsComponent
    }
})
export default class DataSource extends Vue {
    public split: number | string = "300px";
    public showAddDatabase: boolean = false; // 添加数据源modal
    public showDetailDatabase: boolean = false; // 数据源详情modal
    public showTableFilds: boolean = false; // 表格字段modal
    public dataSourceList: Array<any> = []; // 数据源列表
    public data: Array<any> = []; // u-table-view数据
    public currentTabel: any = {}; // 当前选中的table
    public tableColumns: Array<any> = []; // 当前table的字段名 数组
    public loadingTableData: boolean = false; // 加载u-table-view数据的状态
    public dataSourceDetail: any = {}; // 数据源详情
    public tableFields: Array<any> = []; // 表格的字段
    public filterData: any = [];
    public typeList: Array<any> = []; // 数据源类型
    public updataDataSource: any = {
        name: "",
        description: "",
        url: "",
        user: "",
        password: "",
        minIdle: "1",
        maxPoolSize: "8",
        edit: false
    }; // 新增，编辑数据源

    public paging: Paging = {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    };

    @autowired(DataSourceService)
    public service!: DataSourceService;

    // 右侧提示信息
    public get message() {
        let message = null;
        if (!this.currentTabel.id) {
            message = "请在左侧数据源中选择一个数据源";
        }
        if (this.dataSourceList && !this.dataSourceList.length) {
            message = "暂无数据源，请在左侧列表中创建一个数据源";
        }
        return message;
    }

    public get prefixName(): string {
        let id = this.currentTabel?.id || "";
        if (id.indexOf(".") > 0) return id + ".";
        return "";
    }

    public onAddDataSource() {
        this.updataDataSource = {
            name: "",
            description: "",
            url: "",
            user: "",
            password: "",
            minIdle: "1",
            maxPoolSize: "8",
            edit: false
        };
        this.showAddDatabase = true;
    }

    public onDetailDatabase(data: any) {
        this.dataSourceDetail = data._data;
        this.showDetailDatabase = true;
    }

    public onEditDatabase(data: any) {
        this.updataDataSource = data._data.$clone();
        this.showAddDatabase = true;
    }

    public onDeleteDatabase(data: any) {
        this.$Modal.confirm({
            title: "删除数据源",
            content: `确定要删除数据源：${data.name}吗？`,
            onOk: () => {
                this.doDeleteDataSource(data._data.id);
            }
        });
    }

    public async doDeleteDataSource(id: any) {
        try {
            await this.service.deleteDataSource(id);
            this.initTree();
        } catch (error) {
            this.$Message.error("删除失败，请稍后再试");
        }
    }
    public onSqlDatabase(data: any) {
        this.$router.push({
            name: "sql-controler",
            params: { id: data.id }
        });
    }

    // 显示表格字段modal
    public async onViewTableField(data: any) {
        const table = data.item || {};
        this.showTableFilds = true;
        let res = await this.service.getTableFields(
            table.dataSourceId,
            table.id
        );
        if (!res.success) {
            this.tableFields = [];
            this.$Message.error(res.message || "获取字段错误，请稍后再试");
            return;
        }
        this.tableFields = res.data.columns;
    }

    public onDeleteTable(table: any) {
        this.$Modal.confirm({
            title: "警告",
            content: `您确定要删除表 <span style="color:red;font-weight:600">${table.item.title}</span> 吗？<br/><span>此操作无法撤销，且可能影响业务系统</span>`,
            onOk: async () => {
                let params = {
                    id: table.item.dataSourceId,
                    table: table.item.title
                };
                await this.service.deleteTable(params);
                this.initTree();
            }
        });
    }

    public async onTableNodeSelect(data: any) {
        this.currentTabel = data;
        // 清空相关数据
        this.filterData = [];
        this.data = [];
        this.tableColumns = [];
        let params = {
            id: data.dataSourceId,
            name: data.id
        };
        this.getTableData(); // 获取表格数据

        // 获取表格的列
        let res = await this.service.getTableFields(params.id, params.name);
        if (res && res.success) {
            this.tableColumns = (res.data.columns || []).map((v: any) => {
                return {
                    title: v.name,
                    // slot: v.name,
                    key: v.name,
                    sortable: false,
                    ellipsis: true,
                    minWidth: 150,
                    tooltip: true,
                    align: "center",
                    resizable: false
                };
            });
        }
    }

    // 筛选查询
    public onFilter(data: any) {
        this.paging = {
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0
        };
        this.filterData = data;
        this.getTableData();
    }

    public async onExportAll() {
        const params = {
            id: this.currentTabel.dataSourceId,
            name: this.currentTabel.id
        };
        const queries = {
            queries: this.filterData.map((v: any) => {
                return {
                    name: v.name,
                    operate: v.operate,
                    value: v.value
                };
            })
        };
        const queryData = { ...queries, paging: {} };
        this.service.export(params, queryData);
    }

    // public async getFieldName(params: object) {
    //     let fields = await this.getTableStructure(params);
    //     return fields.map((v: any) => v.name);
    // }

    // public async getTableStructure(params: any): Promise<any> {
    //     let res = await this.service.getTableFields(params.id, params.name);
    //     debugger;
    //     return res.data.columns || [];
    // }

    public async getTableData() {
        let params = {
            id: this.currentTabel.dataSourceId,
            name: this.currentTabel.id
        };
        let queries = {
            queries: this.filterData.map((v: any) => {
                return {
                    name: v.name,
                    operate: v.operate,
                    value: v.value
                };
            })
        };

        this.loadingTableData = true;
        let queryData = {
            ...queries,
            page: this.paging.pageIndex,
            size: this.paging.pageSize
        };
        let res = await this.service.getTableData(params, queryData);
        this.loadingTableData = false;
        this.paging.totalCount = res.total;
        this.data = res.data || [];
    }

    public onPageChange(index: number) {
        this.paging.pageIndex = index;
        this.getTableData();
    }

    public onPageSizeChange(pageSize: number) {
        this.paging.pageSize = pageSize;
        this.getTableData();
    }

    public mounted() {
        this.initTree();
        this.getTypeList();
    }

    public activated() {
        //
    }

    public deactivated() {
        //
    }

    public async initTree() {
        let result = await this.service.getDataSourceList();
        this.dataSourceList = (result || []).map((v: any) => {
            v.title = v.name;
            v.loading = false;
            v.expand = false;
            v.loaded = false;
            v.children = [];
            v._data = v.$clone();
            return v;
        });
    }
    public async getTypeList() {
        let res = await this.service.getEnumByType("adapter-types");
        if (res && res.success) {
            this.typeList = res.data;
        }
    }
}
