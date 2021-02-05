import Vue from "vue";
import router from "./router";
import store from "./store";
import axiosConfig from "@/axios.config";
import iView from "view-design";
import components from "./utils/rename-iview-components";
import "@/assets/styles/index.scss";
import CodeEditor from "./components/code-editor";
import Math from "halo-math";
Vue.config.productionTip = false;
Vue.component("g-code-editor", CodeEditor);
Vue.use(Math);
Vue.use(iView);
Vue.use(components);
axiosConfig();
new Vue({
    router,
    store,
    template: "<div id='app'><router-view /></div>"
}).$mount("#app");
