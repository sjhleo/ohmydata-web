import throttle from "lodash.throttle";
import Component from "vue-class-component";
import Vue from "vue";
@Component({})
export default class CommonView extends Vue {
    public throttleInit: Function = new Function()
    public created() {
        this.throttleInit = throttle(this.initFunction, 5000, {
            leading: true,
            trailing: false
        });
    }
    public initFunction() {
        console.info()
    }
    public mounted() {
        this.throttleInit();
    }
    public activated() {
        this.throttleInit();
    }
}
