import { GetterTree } from "vuex";
import State from "./state";

export function id(state: State): string {
    return state.id;
}
export function name(state: State): string {
    return state.name;
}
export function info(state: State): any {
    return {
        id: state.id,
        name: state.name,
        username: state.username
    };
}

export default {
    id,
    name,
    info
} as GetterTree<State, any>;
