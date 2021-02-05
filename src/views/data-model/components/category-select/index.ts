import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import "./index.scss";

@Component({
    template: require("./index.html"),
    components: {}
})
export default class SelectTree extends Vue {
    @Prop({ default: () => [] })
    public data!: Array<any>;
    @Prop({ default: () => new Object() })
    public current!: any;
    public visible: boolean = false;
    public onSelect(arr: Array<any>, node: any) {
        this.$emit("on-select", node);
        this.visible = false;
    }
    public onClear() {
        this.onSelect([], {});
    }
}
