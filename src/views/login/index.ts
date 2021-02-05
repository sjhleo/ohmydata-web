import Cookies from "js-cookie";
import "./index.scss";
import autowired from "@/decorators/autowired";
import { commonSetting } from "@/settings";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import LoginService from "./service";

@Component({ name: "login", template: require("./index.html"), components: {} })
export default class Login extends Vue {
    @autowired(LoginService)
    public loginService!: LoginService;

    public remember: boolean = false;

    public count: number = 0;

    public interval: any = Object.create(null);

    public countArry: Array<any> = [];

    public isLoading: boolean = false;

    public countMap: Map<string, number> = new Map();

    // 用户名和密码的form对象
    public form: any = {
        username: "",
        password: ""
    };

    public rules: any = {
        username: [
            { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
    };

    public title: string = commonSetting.title || "数据服务";

    public onLogin(): void {
        this.isLoading = true;
        this.loginService
            .login(this.form.username, this.form.password)
            .then(res => {
                this.$store.commit("user/save", res.data);
                this.$router.push({ path: "/" });
            })
            .catch(error => {
                // 账号不正确
                if (error && error.response && error.response.status === 401) {
                    this.doLoginError(error);
                } else {
                    this.$Message.error("调用服务异常");
                }
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    public doLoginError(error: any) {
        let count = this.countMap.get(this.form.username) || 0;
        this.countMap.set(this.form.username, ++count);
        if (
            count >= 5 ||
            error.response.data.error_description.indexOf("账号已经被锁定") !==
                -1
        ) {
            this.$Message.error("错误次数到达5次,账号已被锁定,请十分钟后再试");
        } else {
            this.$Message.error(
                "账户或密码不正确,错误次数达到5次,账号将被锁定,剩余次数:" +
                    (5 - count)
            ); // 密码不正确
        }
        return;
    }

    public onReset() {
        (this.$refs["loginForm"] as any).resetFields();
    }

    public progress() {
        if (this.count < 14) {
            this.count++;
            this.countArry.push(this.count);
        } else {
            this.count = 0;
            this.countArry = [];
        }
    }

    @Watch("remember", { immediate: false })
    public onRememberChanged(nv: boolean, ov: boolean) {
        if (nv) {
            Cookies.set("remember_login_name", this.form.username);
        }
    }

    protected mounted() {
        let username = Cookies.get("remember_login_name");
        if (username) {
            this.form.username = username;
        }
        this.interval = self.setInterval(() => {
            this.progress();
        }, 1000);
    }

    protected beforeDestroy() {
        window.clearInterval(this.interval);
    }
}
