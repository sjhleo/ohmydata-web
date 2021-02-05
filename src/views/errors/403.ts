import { Component } from "vue-property-decorator";
import Vue from "vue";
import "./403.scss";

@Component({
    template: require("./403.html")
})
export default class Error403View extends Vue {
    /**
     * 当返回首页按钮点击时调用。
     * @protected
     * @param  {MouseEvent} e 鼠标事件参数。
     * @returns void
     */
    protected onBackHomeClick(e: MouseEvent): void {
        this.$router.push("/");
    }

    /**
     * 当返回上一页按钮点击时调用。
     * @protected
     * @param  {MouseEvent} e 鼠标事件参数。
     * @returns void
     */
    protected onBackPrevClick(e: MouseEvent): void {
        this.$router.go(-1);
    }
}
