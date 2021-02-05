import { Component, Prop, PropSync } from "vue-property-decorator";
import autowired from "@/decorators/autowired";
import "./index.scss";
import DataModelService from "@/views/data-model/service";
import Vue from "vue";

@Component({
    name: "category-modal",
    template: require("./index.html")
})
export default class CategoryModal extends Vue {
    @autowired(DataModelService)
    public service!: DataModelService;

    // 控制category-modal显隐
    @PropSync("visible", { type: Boolean, default: false })
    public show!: boolean;

    // 类型数组
    @Prop({ type: Array, default: [] })
    public categories!: Array<any>;

    // 当前选中类型项
    @Prop({ type: Object, default: {} })
    public current!: any;

    // 点击保存请求接口时的加载样式显隐
    public isLoading: boolean = false;

    // 控制poptip显隐
    public popVisible: boolean = false;

    // 点击保存
    public async onSaveClick() {
        this.current.type = "ddcat";
        if (!this.current.parentId) {
            this.current.parentId = null;
        }

        if (!this.current.name) {
            this.$Message.warning("请填写分组名称");
            return;
        }

        this.isLoading = true;
        let res: any = {};
        if (this.current.id) {
            res = await this.service.editCategory(this.current);
        } else {
            res = await this.service.saveCategory(this.current);
        }

        if (res && res.success) {
            this.show = false;
            this.$emit("refresh");
        }
        this.isLoading = false;
    }

    // 在所属分组中选中分组后
    public onParentSelect(arr: Array<any>, parent: any) {
        this.current.parentId = parent.id;
        this.current.parentName = parent.name;
        this.popVisible = false;
    }

    // 开启 clearable 时可用，点击清空按钮时触发
    public onClear() {
        this.onParentSelect([], {});
    }
}
