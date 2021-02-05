import { Route } from "vue-router";
import { MutationTree } from "vuex";
import RouteTagState, { Tag } from "./state";

export function add(state: RouteTagState, tag: Tag): void {
    state.tagList.push(tag);
}
export function close(state: RouteTagState, tag: Tag): void {
    state.tagList = state.tagList.filter(t => t.id !== tag.id);
}
export function closeCurrent(state: RouteTagState, route: Route): void {
    state.tagList = state.tagList.filter(t => t.route.name !== route.name);
}
export function clear(state: RouteTagState): void {
    state.tagList = [];
}

export default {
    add,
    close,
    closeCurrent,
    clear
} as MutationTree<RouteTagState>;
