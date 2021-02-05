import "./index.scss";
import autowired from "@/decorators/autowired";
import DataSourceService from "../data-source/service";
import SQLControlerService from "./service";
import { Paging } from "@/models";
import CodeEditor from "@/components/code-editor";
import sqlFormatter from "sql-formatter";
import CommonView from "../common-view";
import { Component } from "vue-property-decorator";
@Component({
    name: "sql-controler",
    template: require("./index.html"),
    components: {}
})
export default class SQLControler extends CommonView {
    @autowired(DataSourceService)
    public dataSourceService!: DataSourceService;
    @autowired(SQLControlerService)
    public sqlControlerService!: SQLControlerService;
    public dataSourceId: string = "";
    public paging: Paging = {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    };
    public sql: string = "";
    public sqlOption: any = {
        hintOptions: {
            completeSingle: false,
            // 自定义提示选项
            tables: {}
        }
    };
    public jsonOption: any = {
        readOnly: true
    };
    public type: string = "list";
    public column: Array<any> = [];
    public data: Array<any> = [];
    public split: number = 0.3;
    public initFunction() {
        let { id } = this.$route.params;
        if (this.dataSourceId && this.dataSourceId !== id) {
            this.resetPage();
        }
        this.dataSourceId = id;
        this.getTables();
    }
    public resetPage() {
        this.sql = "";
        this.data = [];
    }
    public async getTables() {
        let result = await this.dataSourceService.getTables(this.dataSourceId);
        let obj: any = {};
        (result.data || []).forEach((tableName: string) => {
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
    public onSelect() {
        this.paging.pageIndex = 1;
        this.select();
    }
    public onSelectCode() {
        let code = (this.$refs.sql as CodeEditor).editor.getSelection();
        this.paging.pageIndex = 1;
        this.select(code);
    }
    public onFormatterSql() {
        this.sql = sqlFormatter.format(this.sql);
        (this.$refs.sql as CodeEditor).setCode(this.sql);
    }
    public async select(sql?: string) {
        this.data = [];
        this.column = [];
        let result = await this.sqlControlerService.select(this.dataSourceId, {
            sql: sql || this.sql,
            paging: this.paging
        });
        if (!result || !result.success) {
            return this.$Message.error("查询SQL异常");
        }
        if (!result.data || result.data.length === 0) {
            return this.$Message.warning("查询数据为空");
        }
        this.data = result.data;
        this.paging.totalCount = result.totalCount;
        Object.keys(this.data[0]).forEach(key => {
            this.column.push({
                title: key,
                key: key,
                align: "center",
                width: 200,
                tooltip: true,
                ellipsis: true
            });
        });
    }
    public onChangePageIndex(pageIndex: number) {
        this.paging.pageIndex = pageIndex;
        this.select();
    }
    public onChangePageSize(pageSize: number) {
        this.paging.pageSize = pageSize;
        this.select();
    }
    public get json() {
        return JSON.stringify(this.data, null, 4);
    }
}
