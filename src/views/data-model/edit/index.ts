import { Component } from "vue-property-decorator";
import DataModelAdd from "../add";

@Component({
    name: "data-model-edit"
})
export default class DataModelEdit extends DataModelAdd {
    public initFunction() {
        let { id } = this.$route.params;
        if (this.data.id !== id) {
            this.initData(id);
        }
    }
    public async initData(id: string = this.data.id) {
        let result = await this.service.getModelById(id);
        this.data = result.data;
        this.initCode();
    }
}
