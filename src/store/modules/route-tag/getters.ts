import * as models from "@/models";
import { GetterTree } from "vuex";
import RouteTagState, { Tag } from "./state";

export function list(state: RouteTagState): Array<Tag> {
    return state.tagList;
}
export default {
    list
} as GetterTree<RouteTagState, any>;
