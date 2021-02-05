import "./index.scss";
import { PropSync, Component, Vue, Prop } from "vue-property-decorator";
@Component({
    template: require("./index.html")
})
export default class DetailDataBaseComponent extends Vue {
    @PropSync("visible", { type: Boolean, default: false })
    public show!: boolean;

    // public rules: any = {};

    // public formData: any = {};
    @Prop({ type: Object, default: () => Object.create(null) })
    public data!: any;
}
