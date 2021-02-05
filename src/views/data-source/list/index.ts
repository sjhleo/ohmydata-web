import "./index.scss";
import autowired from "@/decorators/autowired";
import DataSourceService from "../service";
import { DynamicScroller } from "vue-virtual-scroller";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
@Component({
    template: require("./index.html"),
    components: {
        "dynamic-scroller": DynamicScroller
    }
})
export default class DataSourceList extends Vue {
    @autowired(DataSourceService)
    public service!: DataSourceService;
    @Prop({ default: () => [] })
    public dataSourceList!: Array<any>;
    public showData: Array<any> = [];
    public keyword: string = "";
    public selectTable: any = {};
    public placeholder: string = "请输入关键字";
    public onFilter() {
        if (!this.keyword) {
            return (this.showData = this.dataSourceList.$clone());
        }
        this.showData = this.filterData(this.dataSourceList.$clone());
    }
    public match(node: any) {
        if (!node.children || node.children.length === 0) {
            return (
                (node.title || node.name)
                    .toLowerCase()
                    .indexOf(this.keyword.toLowerCase()) !== -1
            );
        } else {
            let flag = false;
            node.children.forEach((v: any) => {
                flag = this.match(v) ? this.match(v) : flag;
            });
            return flag;
        }
    }
    /**
     * 处理渲染数据，只保留与关键字匹配的叶子节点和其祖先节点
     * @param data
     */
    public filterData(data: Array<any>) {
        if (!data || !Array.isArray(data)) return data;
        let d = data.filter(v => this.match(v));
        d = d.map(v => {
            if (v.children) {
                v.children = this.filterData(v.children);
            }
            return v;
        });
        return d;
    }
    public async onClickDataSource(dataSource: any) {
        if (!dataSource.loaded && !dataSource.expand) {
            let result = await this.service.getTables(dataSource.id);
            // result.data = new Array(2000).fill({}).map(v => Math.random());
            dataSource.children = (result.data || []).map((v: string) => {
                return {
                    id: v,
                    title: v,
                    dataSourceId: dataSource.id
                };
            });
            let t = this.dataSourceList.find(d => d.id === dataSource.id);
            t.children = dataSource.children;
            t.loaded = true;
            dataSource.loaded = true;
        }
        dataSource.expand = !dataSource.expand;
    }
    public onHandleDatabase(name: string, database: any) {
        this.$emit("on-" + name + "-database", database);
    }
    public onHandleTable(name: string, table: any) {
        this.$emit("on-" + name + "-table", table);
    }
    public onSelect(table: any) {
        this.selectTable = table;
        this.$emit("on-select", table);
    }
    @Watch("dataSourceList", { deep: false, immediate: true })
    public init() {
        this.showData = this.dataSourceList.$clone();
    }
}
