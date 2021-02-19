import "../request-parameter-list/index.scss";
import DataModelService from "../../service";
import autowired from "@/decorators/autowired";
import { ReponseParam } from "../../entity";
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";

@Component({
    template: require("./index.html")
})
export default class ResponseParameterList extends Vue {
    // 响应参数表格头部
    public columns = [
        {
            title: "参数名",
            align: "center",
            slot: "name"
        },
        {
            title: "类型",
            align: "center",
            slot: "type"
        },
        {
            title: "转化方式",
            align: "center",
            slot: "convertType"
        },
        {
            title: "转化内容",
            align: "center",
            slot: "convertValue"
        },
        {
            title: "操作",
            align: "center",
            slot: "actions"
        }
    ];
    @Prop({ default: () => [] })
    public data!: Array<ReponseParam>;
    @autowired(DataModelService)
    public service!: DataModelService;
    public typeList: Array<any> = [];
    public convertList: Array<any> = [];

    public onEdit(row: any) {
        this.$set(row, "isEdit", true);
    }
    public onCancel(index: number) {
        this.data.splice(index, 1, this.data[index]);
    }
    public onDelete() {
        //
    }

    public onConfirm(row: any, index: number) {
        if (row.name === "") {
            this.$Message.warning("请输入参数名");
        }
        if (row.type === "") {
            this.$Message.warning("请选择类型");
        }
        if (row.convertType === "") {
            this.$Message.warning("请选择转化方式");
        }
        if (row.name !== "" && row.type !== "" && row.convertType !== "") {
            row.isEdit = false;
            this.data.splice(index, 1, row);
        }
    }

    public onRemove() {
        //
    }
    public mounted() {
        this.getConvertList();
        this.getTypeList();
    }
    public async getTypeList() {
        let result = await this.service.getEnumByType("param-types");
        this.typeList = result.data || [];
    }
    public async getConvertList() {
        let result = await this.service.getEnumByType("convert-types");
        this.convertList = result.data || [];
    }
    public getTypeText(type: string) {
        return (this.typeList.find((t: any) => t.name === type) || { text: "" })
            .text;
    }
    public getConverTypeText(convertType: string) {
        return (
            this.convertList.find((c: any) => c.name === convertType) || {
                text: ""
            }
        ).text;
    }
}
