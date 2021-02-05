import "./index.scss";
import { PropSync, Prop, Component, Vue } from "vue-property-decorator";
import { RequestParam } from "../../entity";

@Component({
    template: require("./index.html")
})
export default class RunningResult extends Vue {
    // 参数
    @Prop({ default: () => [] })
    public params!: Array<RequestParam>;
    @Prop({ default: () => [] })
    public data!: Array<any>;
    public get columns() {
        let arr: Array<any> = [];
        this.data.length > 0
            ? Object.keys(this.data[0]).forEach(key => {
                  arr.push({
                      title: key,
                      key: key,
                      align: "center",
                      width: 200,
                      tooltip: true,
                      ellipsis: true
                  });
              })
            : (arr = []);
        return arr;
    }
    public context: any = {};

    @PropSync("visible", { default:  false })
    public showResult!: boolean;

    public onProcess() {
        this.$emit("on-runing", this.context);
    }

    public onConfirm() {
        this.$emit("on-save");
        this.showResult = false;
    }

    public onCancel() {
        this.showResult = false;
    }
}
