import { Module } from "vuex";
import State from "./state";
import Mutations from "./mutations";
import Getters from "./getters";
// import Actions from "./actions";

export default class RouteTag implements Module<State, any> {
    public namespaced: boolean;
    public state: State;
    public mutations = Mutations;
    public getters = Getters;
    public actions = undefined;

    public constructor() {
        this.namespaced = true;
        this.state = new State();
    }
}
