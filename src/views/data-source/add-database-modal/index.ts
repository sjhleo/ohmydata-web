import "./index.scss";
import { Component, PropSync, Vue, Model, Prop, Watch } from "vue-property-decorator";
import DataSourceService from "../service";
import autowired from "@/decorators/autowired";
@Component({
    template: require("./index.html")
})
export default class AddlDataBaseComponent extends Vue {
    @PropSync("visible", { type: Boolean, default: false })
    public show!: boolean;

    @Model("dataChange", {
        type: Object,
        default: () => {
            return {
                name: "",
                description: "",
                url: "",
                username: "",
                password: "",
                minIdle: "1",
                maxPoolSize: "8",
                edit: false
            };
        }
    })
    public data!: any;
    @Prop({ default: [] })
    public typeList!: Array<any>;

    @autowired(DataSourceService)
    public service!: DataSourceService;

    public checking: boolean = false; // 正在检查

    public saving: boolean = false; // 正在保存

    public showHelp: boolean = false; // 显示数据源链接帮助信息

    public rules: any = {
        name: [
            { required: true, message: "数据源名称不能为空", trigger: "blur,change" }
        ],
        url: [
            { required: true, message: "数据源链接不能为空", trigger: "blur,change" }
        ],
        type: [{ required: true, message: "数据源类型不能为空", trigger: "blur,change" }]
        // username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        // password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
    };

    public advance: boolean = false; // 显示高级设置

    public checkingResult: Boolean | null = null; // 连接测试

    public get isEdit() {
        return this.data && this.data.id ? true : false;
    }

    @Watch("show", { immediate: false })
    public visibleChange(visible: boolean) {
        if (!this.saving) {
            // 未在保存状态时，清空数据
            this.initModal();
        }
    }

    public initModal() {
        this.resetForm("addSourceform");
        this.checking = false;
        this.saving = false;
        this.advance = false;
        this.checkingResult = null;
        // this.data = {
        //     name: "",
        //     description: "",
        //     url: "",
        //     user: "",
        //     password: "",
        //     minIdle: "1",
        //     maxPoolSize: "8",
        //     edit: false
        // };
    }

    public async onCheck() {
        if (!this.validateForm("addSourceform")) {
            return;
        }
        this.doChecking();
    }

    public async doChecking() {
        this.checking = true;
        try {
            let res = await this.service.checkDataSource(this.data);
            if (!res.success || !res.data) {
                this.$Message.error(res.message || "连接数据源失败");
                this.checkingResult = false;
            } else {
                this.$Message.success("连接成功");
                this.checkingResult = true;
            }
        } catch (error) {
            //
            this.$Message.error("测试失败，请稍后再试");
        } finally {
            this.checking = false;
        }
    }

    public onChangeSetting() {
        this.advance = !this.advance;
    }

    public async onConfirm() {
        if (!this.validateForm("addSourceform")) {
            return;
        }
        // await this.doChecking();
        // if (!this.checkingResult) {
        //     return;
        // }
        this.saving = true;
        let message = this.isEdit ? "编辑" : "新增";
        try {
            let res = await this.service.updateDataSource(this.data);
            this.$Message.success(`${message}数据源成功`);
            this.$emit("refresh");
            this.onCancel();
        } catch (error) {
            this.$Message.error(`${message}数据源失败,请稍后再试`);
        } finally {
            this.saving = false;
        }
    }

    public onCancel() {
        this.show = false;
    }

    public resetForm(name: string) {
        (this.$refs[name] as any).resetFields();
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
