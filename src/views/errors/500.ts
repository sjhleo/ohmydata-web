import { Component } from "vue-property-decorator";
import Vue from "vue";
import "./500.scss";

/**
 * 错误 500 视图。
 * @class
 * @version 1.0.0
 */
@Component({
    template: require("./500.html")
})
export default class Error500View extends Vue {
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
