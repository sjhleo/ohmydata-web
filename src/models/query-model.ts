import Paging from "./paging";
import { Sorts } from "./sorts";
export default interface QueryModel<T> {
    condition: T;
    paging: Paging;
    sorts?: Sorts;
    extras?: any;
}
