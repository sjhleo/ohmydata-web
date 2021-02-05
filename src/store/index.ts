import Vue from "vue";
import Vuex from "vuex";
import RouteTag from "./modules/route-tag";
import User from "./modules/user";
const modules = {
    user: new User(),
    tag: new RouteTag()
};
Vue.use(Vuex);
export default new Vuex.Store({ modules });
