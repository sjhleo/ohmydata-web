import autowired from "@/decorators/autowired";
import VueMavonEditor, { mavonEditor } from "mavon-editor";
import DataModelService from "../service";
// tslint:disable-next-line:no-submodule-imports
import "mavon-editor/dist/css/index.css";
import "./index.scss";
import CommonView from "@/views/common-view";
import { Component } from "vue-property-decorator";
@Component({
    name: "data-model-doc",
    template: require("./index.html"),
    components: {
        "mavon-editor": mavonEditor
    }
})
export default class DataModelDoc extends CommonView {
    @autowired(DataModelService)
    public service!: DataModelService;
    public dataModelId: string = "";
    // public fs = require("fs");

    // markdownOption配置
    public markdownOption: any = {};

    public toolbars: any = {
        save: true // 保存（触发events中的save事件）
    };

    public markDoc: string = "";

    public onSave(value: string, render: string) {
        let iframe: any = document.getElementById("printf"); // 获取id为svgframe的iframe对象
        iframe.contentDocument.write(render);
        iframe.contentDocument.close();
        iframe.contentWindow.print();
    }

    public initFunction() {
        let { id } = this.$route.params;
        if (this.dataModelId || this.dataModelId !== id) {
            this.init(id);
        }
        this.dataModelId = id;
    }
    public async init(id: string) {
        let res = await this.service.getMavonDoc(id);
        if (res && res.success) {
            this.markDoc = res.data;
        }
    }
}
