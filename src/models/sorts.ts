export interface Sort {
    fields: Array<string>;
    mode: "Ascending" | "Descending";
}
export type Sorts = Array<Sort>;
