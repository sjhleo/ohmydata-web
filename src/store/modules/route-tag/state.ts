import { Route } from "vue-router";

export default class RouteTagState {
    public tagList: Array<Tag> = [];
}
export class Tag {
    public id?: string;
    public route: Route;
    public constructor(route: Route) {
        this.id = Tag.getUuid();
        this.route = route;
    }
    public static getUuid() {
        // tslint:disable-next-line:no-bitwise
        return (~~(Math.random() * (1 << 30))).toString(36);
    }
}
