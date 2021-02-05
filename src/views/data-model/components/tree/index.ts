import "./index.scss";
import CommonTree from "@/views/data-source/tree/common-tree";
import Component from "vue-class-component";

@Component({})
export default class DataModelTree extends CommonTree {
    public className: Array<string> = ["data-model-tree"];
    /**
     * 渲染子节点
     * @param h
     * @param param
     */
    public renderContent(
        h: any,
        { root, node, data }: { root: any; node: any; data: any }
    ) {
        let isLeaf = !data.children;
        let icon = isLeaf ? "table" : "data-soource";
        let selected = isLeaf && this.selectItem.id === data.id;
        data.expand = this.expandNodeSet.has(data.id);
        return h(
            "span",
            {
                class: [
                    isLeaf ? "tree-item leaf" : "tree-item",
                    selected ? "selected" : ""
                ]
            },
            [
                h("i-icon", { props: { type: icon } }),
                h(
                    "i-tooltip",
                    {
                        props: {
                            content: data.title,
                            transfer: true,
                            placement: "top-start",
                            offset: 150
                        }
                    },
                    [
                        h(
                            "p",
                            {
                                on: {
                                    click: isLeaf
                                        ? (e: Event) => {
                                            this.clickLeafNode(e, data);
                                        }
                                        : (e: Event) => {
                                            this.clickParentNode(e, data);
                                        }
                                }
                            },
                            data.title
                        )
                    ]
                ),
                isLeaf
                    ? [
                        h("i-icon", {
                            attrs: {
                                title: "查看"
                            },
                            class: "oprate-icon",
                            props: { type: "view" },
                            on: {
                                click: (e: Event) => {
                                    this.onHandleTable(e, "view", data);
                                }
                            }
                        })
                    ]
                    : h(
                    "i-dropdown",
                    {
                        on: {
                            "on-click": (name: string) => {
                                this.onHandleDatabase(name, data);
                            }
                        },
                        props: {
                            "transfer": true,
                            "transfer-class-name": "oprate-menu"
                        }
                    },
                    [
                        h("i-icon", {
                            class: "oprate-icon",
                            props: { type: "ios-more" }
                        }),
                        h(
                            "i-dropdown-menu",
                            {
                                slot: "list"
                            },
                            [
                                h(
                                    "i-dropdown-item",
                                    { props: { name: "edit" } },
                                    [
                                        h("i-icon", {
                                            props: { type: "edit" }
                                        }),
                                        h("span", {}, "编辑分类")
                                    ]
                                ),
                                h(
                                    "i-dropdown-item",
                                    { props: { name: "delete" } },
                                    [
                                        h("i-icon", {
                                            props: { type: "delete" }
                                        }),
                                        h("span", {}, "删除分类")
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ]
        );
    }
    public onHandleTable(e: Event, name: string, data: any) {
        e.stopPropagation();
        this.$emit("on-" + name + "-table", data);
    }
    public onHandleDatabase(name: string, data: any) {
        this.$emit("on-" + name + "-datamodel", data);
    }
    public clickParentNode(e: Event, node: any) {
        this.clickLeafNode(e, node);
    }
}
