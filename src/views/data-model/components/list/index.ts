import autowired from "@/decorators/autowired";
import { Tag } from "@/store/modules/route-tag/state";
import { PropSync, Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { DataModel } from "../../entity";
import DataModelService from "../../service";
import "./index.scss";

@Component({
    template: require("./index.html")
})
export default class DataModelList extends Vue {
    @autowired(DataModelService)
    public service!: DataModelService;

    // 查询条件
    public condition: any = {
        code: "",
        name: ""
    };

    // 列表中选中的数据
    public selections: Array<any> = [];

    // 表头信息
    public columns = [
        {
            type: "selection",
            title: "全选",
            align: "center"
        },
        {
            title: "编码",
            align: "center",
            key: "code"
        },
        {
            title: "名称",
            align: "center",
            key: "name"
        },
        {
            title: "数据源",
            align: "center",
            key: "sourceName"
        },
        {
            title: "描述",
            align: "center",
            key: "description"
        },
        {
            title: "是否开启缓存",
            align: "center",
            key: "enableCache"
        },
        {
            title: "过期时间(s)",
            align: "center",
            key: "expireSeconds"
        },
        {
            title: "接口文档",
            align: "center",
            slot: "doc"
        },
        {
            title: "操作",
            align: "center",
            slot: "actions"
        }
    ];

    // 表内数据
    @Prop({ default: () => [] })
    public data!: Array<any>;

    // 分页数据
    @PropSync("paging", { default: () => null })
    public page!: any;

    public mounted() {
        //
    }

    // 初始化数据
    public init() {
        //
    }

    // 点击查询
    public onSearch() {
        this.$emit("on-search", this.condition);
    }

    public onEmpty() {
        this.condition.code = "";
        this.condition.name = "";
    }

    // 新增
    public onAddDataModel() {
        this.$router.push({
            name: "data-model-add",
            query: {
                uuid: Tag.getUuid()
            }
        });
    }

    // 选中项发生改变
    public onSelected(rows: any) {
        this.selections = rows;
    }

    // 删除
    public onDelete(rowData: any) {
        this.$Modal.confirm({
            title: "警告",
            content: "确认删除该数据模型分组吗？",
            onOk: async () => {
                let res: any = await this.service.deleteModelById(rowData.id);
                if (res && res.success) {
                    this.$Message.success("删除数据成功");
                    this.$emit("on-delete-refresh");
                }
            }
        });
    }

    // 编辑
    public onEdit(row: DataModel) {
        this.$router.push({
            name: "data-model-edit",
            params: {
                id: row.id
            }
        });
    }
    // 批量删除
    public onBatchDelete() {
        if (this.selections && this.selections.length === 0) {
            this.$Message.warning("请先勾选要删除的数据");
            return;
        }
        this.$Modal.confirm({
            title: "警告",
            content: "批量删除选中数据,请谨慎操作",
            onOk: async () => {
                const idArray = this.selections.map(item => item.id);
                let or: any = await this.service.deleteDataModel(idArray);
                if (or && or.success) {
                    this.page.pageIndex = 1;
                    this.$emit("on-delete-refresh");
                    this.selections = [];
                }
            }
        });
    }

    // 跳转到mavon路由以新页面形式打开
    public toMavonDoc(rowData: any) {
        this.$router.push({
            name: "data-model-doc",
            params: { id: rowData.id }
        });
    }
    // 改变当前所在页面
    public onPageIndexChange(index: number) {
        this.$emit("on-page-index-change", index);
    }

    // 改变每页显示条目数
    public onPageSizeChange(size: number) {
        this.$emit("on-page-size-change", size);
    }
}
