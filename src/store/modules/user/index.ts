import { Module } from "vuex";
import UserState from "./state";
import Mutations from "./mutations";
import Getters from "./getters";
// import Actions from "./actions";

export default class UserStore implements Module<UserState, any> {
    public namespaced: boolean;
    public state: UserState;
    public mutations = Mutations;
    public getters = Getters;
    public actions = undefined;

    public constructor() {
        this.namespaced = true;
        this.state = new UserState();
    }
}
