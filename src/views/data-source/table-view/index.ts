import "./index.scss";
import FilterComponent from "./filter";
import { Paging } from "@/models";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
    template: require("./index.html"),
    components: {
        "u-filter": FilterComponent
    }
})
export default class DataSourceTableView extends Vue {
    @Prop({ default: [] })
    public data!: any;
    @Prop({
        default: () => {
            return { total: 0 };
        }
    })
    public paging!: Paging;
    @Prop({ default: [] })
    public columns!: Array<any>;
    @Prop({ default: Boolean })
    public loading!: boolean;
    // public column: Array<any> = [];

    public split: number = 0.25; // 面板分割比例
    public get total() {
        return this.paging.totalCount || 0;
    }

    public get fieldNameList() {
        return this.columns.map((v: any) => v.title);
    }
    public onFilter(data: any) {
        this.$emit("on-filter", data);
    }

    public onExport() {
        if (this.data.length) {
            (this.$refs.table as any).exportCsv({
                filename: "查询结果"
            });
        } else {
            this.$Message.info("查询结果为空");
        }
    }

    public onExportAll() {
        this.$emit("on-export-all");
    }

    public onPageChange(index: number) {
        this.$emit("on-change", index);
    }

    public onPageSizeChange(pageSize: number) {
        this.$emit("on-page-size-change", pageSize);
    }
}
