import CommonTree from "./common-tree";
import "./index.scss";
import autowired from "@/decorators/autowired";
import DataSourceService from "../service";
import { Component } from "vue-property-decorator";
@Component({
    template: require("./index.html")
})
export default class DataSourceTree extends CommonTree {
    @autowired(DataSourceService)
    public service!: DataSourceService;
    public className: Array<string> = ["data-source-tree"];
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
        let icon = isLeaf ? "table" : "data-source";
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
                        },
                        class: {
                            "diy-i-tooltip": true
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
                                          { props: { name: "detail" } },
                                          [
                                              h("i-icon", {
                                                  props: { type: "view" }
                                              }),
                                              h("span", {}, "查看详情")
                                          ]
                                      ),
                                      h(
                                          "i-dropdown-item",
                                          { props: { name: "edit" } },
                                          [
                                              h("i-icon", {
                                                  props: { type: "edit" }
                                              }),
                                              h("span", {}, "编辑数据源")
                                          ]
                                      ),
                                      h(
                                          "i-dropdown-item",
                                          { props: { name: "delete" } },
                                          [
                                              h("i-icon", {
                                                  props: { type: "delete" }
                                              }),
                                              h("span", {}, "删除数据源")
                                          ]
                                      ),
                                      h(
                                          "i-dropdown-item",
                                          { props: { name: "sql" } },
                                          [
                                              h("i-icon", {
                                                  props: { type: "sql" }
                                              }),
                                              h("span", {}, "SQL控制台")
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
        this.$emit("on-" + name + "-database", data);
    }
    public async loadData(node: any, callback: Function) {
        let result = await this.service.getTables(node.id);
        callback(
            (result.result || []).map((v: string) => {
                return {
                    id: v,
                    title: v,
                    dataSourceId: node.id
                };
            })
        );
    }
}
