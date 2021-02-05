import { Component, Prop, Watch } from "vue-property-decorator";
import Vue from "vue";
import "./index.scss";
@Component({
    template: require("./index.html")
})
export default class FilterComponent extends Vue {
    @Prop({default: []})
    public fieldNameList!: Array<any>;

    public data: Array<any> = [];

    public operateList: Array<any> = [
        {
            label: "等于",
            value: "EQ"
        },
        {
            label: "大于",
            value: "GT"
        },
        {
            label: "大于等于",
            value: "GTE"
        },
        {
            label: "小于",
            value: "LT"
        },
        {
            label: "小于等于",
            value: "LTE"
        },
        {
            label: "包含",
            value: "LIKE"
        },
        {
            label: "不为空",
            value: "IS_NOT_NULL"
        },
        {
            label: "为空",
            value: "IS_NULL"
        }
    ];

    public onAddCondition(index: number) {
        // debugger;
        index = index < this.fieldNameList.length - 1 ? index + 1 : this.fieldNameList.length - 1;
        this.data.push({
            select: true,
            value: "",
            name: this.fieldNameList[index],
            operate: this.operateList[5].value
        });
    }

    public onApply() {
        let params = this.data.filter((v: any) => {
            return v.select;
        });
        this.$emit("on-filter", params);
    }

    @Watch("fieldNameList")
    public onClear() {
        this.data = [];
    }

    public mounted() {
        // this.onAddCondition(-1);
    }
}
