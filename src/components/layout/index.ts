import "./index.scss";
import "./menu.scss";
import Setting from "@/components/setting";
import autowired from "@/decorators/autowired";
import { Getter } from "vuex-class";
import { Tag } from "@/store/modules/route-tag/state";
import CommonService from "@/services/common-service";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { appRouter } from "@/router";

@Component({
    template: require("./index.html"),
    components: {
        "u-setting": Setting,
    }
})
export default class MainView extends Vue {
    @autowired(CommonService)
    public service!: CommonService;

    public active: string = "";
    @Getter("tag/list")
    public tagList!: Array<Tag>;
    public activeTagId: string = "";
    public routes: Array<any> = appRouter.children;
    public get menuList() {
        return this.routes || [];
    }
    public collapsed: boolean = false;
    public onGoToHome() {
        window.location.href = "index.html";
    }
    public async created() {
        let result = await this.service.getCurrentUser();
        if (result && !result.hasError) {
            this.$store.commit("user/save", result.result);
        }
    }
    public get breadcrumbItems() {
        let list = this.$route.matched;
        return list.filter(v => !(v.meta && v.meta.hideInPath));
    }
    @Watch("$route", { immediate: true })
    public routeChange() {
        let tag = this.tagList.find(
            tag => tag.route?.name === this.$route.name
        );
        if (!tag) {
            tag = new Tag(this.$route);
            this.$store.commit("tag/add", tag);
        }
        this.activeTagId = tag.id as string;
        this.active = this.menuList.find(v => this.$route.path.startsWith("/" + v.path))?.name;
    }
    public get cacheList() {
        let list = this.tagList
            .filter(tag => !(tag.route!.meta && tag.route!.meta.notCache))
            .map((tag: Tag) => tag.route!.name);
        return list;
    }
    public onClickTag(tag: Tag) {
        let { name, query, params } = tag.route!;
        this.$router.push({
            name: name as string,
            params,
            query
        });
    }
    public onCloseTag(tag: Tag, index: number) {
        this.$store.commit("tag/close", tag);
        if (tag.id === this.activeTagId) {
            if (this.tagList.length === 0) {
                this.$router.push({
                    name: "data-source-list"
                });
            } else {
                this.onClickTag(this.tagList[index % this.tagList.length]);
            }
        }
    }
}
