import { MutationTree } from "vuex";
import UserState from "./state";

export function save(state: UserState, user: any): void {
    state.id = user.id;
    state.name = user.name;
}

export function clear(state: UserState): void {
    state.id = "";
    state.name = "";
}
export default {
    save,
    clear,
} as MutationTree<UserState>;
