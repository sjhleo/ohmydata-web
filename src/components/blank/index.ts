import "./index.scss";
import { Getter } from "vuex-class";
import { Tag } from "@/store/modules/route-tag/state";
import { Component, Vue } from "vue-property-decorator";

@Component({
    template: require("./index.html")
})
export default class Blank extends Vue {
    @Getter("tag/list")
    public tagList!: Array<Tag>;
    public get cacheList() {
        let list = this.tagList
            .filter(tag => !(tag.route!.meta && tag.route!.meta.notCache))
            .map((tag: Tag) => tag.route!.name);
        return list;
    }
}
