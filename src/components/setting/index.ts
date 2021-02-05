import "./index.scss";
import { Getter } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";

@Component({
    template: require("./index.html")
})
export default class Setting extends Vue {
    @Getter("info", { namespace: "user" })
    public user!: string;
    public onHandleError(e: any) {
        // e.target.src = require("@/assets/images/logo.png");
        e.target.src = "https://i.loli.net/2017/08/21/599a521472424.jpg";
    }
    public onLogout() {
        this.$store.commit("user/logout");
        window.location.href = "index.html#/login";
    }
}
