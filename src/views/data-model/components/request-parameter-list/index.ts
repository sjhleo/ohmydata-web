import "./index.scss";
import DataModelService from "../../service";
import autowired from "@/decorators/autowired";
import { RequestParam } from "../../entity";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
    template: require("./index.html")
})
export default class RequestParameterList extends Vue {
    // 请求参数表格头部
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
            title: "位置",
            align: "center",
            slot: "location"
        },
        {
            title: "是否必须",
            align: "center",
            slot: "required"
        },
        {
            title: "默认值",
            align: "center",
            slot: "defaultValue"
        },
        {
            title: "描述",
            align: "center",
            slot: "description"
        },
        {
            title: "操作",
            align: "center",
            slot: "actions"
        }
    ];
    @Prop({ default: () => [] })
    public data!: Array<RequestParam>;
    @autowired(DataModelService)
    public service!: DataModelService;

    public typeList: Array<any> = [];

    public locationList: Array<any> = [];

    public booleanObj = {
        false: 0,
        true: 1
    };

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
        if (row.name !== "" && row.type !== "") {
            row.isEdit = false;
            this.data.splice(index, 1, row);
        }
    }

    public onRemove() {
        //
    }
    public mounted() {
        this.getLocationList();
        this.getTypeList();
    }
    public async getTypeList() {
        let result = await this.service.getEnumByType("param-types");
        this.typeList = result.data || [];
    }
    public async getLocationList() {
        let result = await this.service.getEnumByType("param-locations");
        this.locationList = result.data || [];
    }
    public onChangeRequired(value: string, row: RequestParam) {
        row.required = !!value;
    }
    public getTypeText(type: string) {
        return (
            this.typeList.find((t: any) => t.value === type) || { text: "" }
        ).text;
    }
    public getLocationText(location: string) {
        return (
            this.locationList.find((l: any) => l.value === location) || {
                text: ""
            }
        ).text;
    }
}
