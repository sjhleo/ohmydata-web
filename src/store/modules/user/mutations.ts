import Cookies from "js-cookie";
import { MutationTree } from "vuex";
import UserState from "./state";

export function save(state: UserState, user: any): void {
    state.id = user.userId;
    state.name = user.userName;
    state.username = user.username;
    state.token = user.token;
    Cookies.set("access_token", state.token);
    sessionStorage.setItem("user", JSON.stringify(state));
}

export function clear(state: UserState): void {
    state.id = "";
    state.name = "";
    Cookies.remove("access_token");
    sessionStorage.removeItem("user");
}
export default {
    save,
    clear
} as MutationTree<UserState>;
