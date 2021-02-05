import "./index.scss";
import { PropSync, Component, Vue, Prop } from "vue-property-decorator";
@Component({
    template: require("./index.html")
})
export default class TableFieldsComponent extends Vue {
    @PropSync("visible", { type: Boolean, default: false })
    public show!: boolean;

    @Prop({ type: Array, default: [] })
    public data!: any;

    public columns: any = [
        {
            title: "名",
            key: "name"
        },
        {
            title: "类型",
            key: "type"
        },
        {
            title: "长度",
            key: "size"
        },
        {
            title: "小数点",
            key: "decimalDigits"
        },
        {
            title: "是否为空",
            key: "nullable"
        },
        {
            title: "备注",
            key: "remark",
            width: 200,
            tooltip: true
        }
        // {
        //     title: "键",
        //     key: "name",
        //     width: 200
        // },
        // {
        //     title: "注释",
        //     key: "name",
        //     width: 200
        // }
    ];
}
