import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import "./common-tree.scss";

@Component({
    template: require("./common-tree.html"),
    components: {}
})
export default class CommonTree extends Vue {
    @Prop({ default: () => [] })
    public data!: Array<any>;
    public className: Array<string> = [];
    public placeholder: string = "请输入关键字";
    public treeData: Array<any> = [];
    public renderData: Array<any> = [];
    public keyword: string = "";
    public selectItem: any = {};
    public expandNodeSet: Set<string> = new Set();
    /**
     * 输入关键字对数据进行过滤
     */
    public onFilter() {
        if (!this.keyword) {
            this.renderData = this.treeData.map(v => {
                v.render = this.renderFirstNodes;
                return v;
            });
            return;
        }
        this.renderData = this.filterData(this.treeData.$clone());
        this.renderData = this.renderData.map(v => {
            v.render = this.renderFirstNodes;
            return v;
        });
    }
    /**
     * 判断一个节点是否是与关键字匹配的叶子节点，或者是包含符合条件的叶子节点的祖先节点
     * @param node
     */
    public match(node: any) {
        if (!node.children || node.children.length === 0) {
            return (node.title || node.name).indexOf(this.keyword) !== -1;
        } else {
            let flag = false;
            node.children.forEach((v: any) => {
                flag = this.match(v) ? this.match(v) : flag;
            });
            return flag;
        }
    }
    /**
     * 处理渲染数据，只保留与关键字匹配的叶子节点和其祖先节点
     * @param data
     */
    public filterData(data: Array<any>) {
        if (!data || !Array.isArray(data)) {
            return data;
        }
        let d = data.filter(v => this.match(v));
        d = d.map(v => {
            if (v.children) {
                v.children = this.filterData(v.children);
            }
            return v;
        });
        return d;
    }
    /**
     * 点击叶子节点
     * @param node
     * @param data
     */
    public clickLeafNode(e: Event, node: any) {
        this.selectItem = node;
        this.$emit("on-select", this.selectItem);
    }
    public clickParentNode(e: Event, node: any) {
        // node.expand = !node.expand;
        this.$set(node, "expand", !node.expand);
        this.onToggleExpand(node);
    }
    @Watch("data", { immediate: true, deep: false })
    public initTreeData() {
        this.treeData = this.data;
        this.renderData = this.treeData.map(v => {
            v.render = this.renderFirstNodes;
            return v;
        });
    }
    /**
     * 渲染子节点
     * @param h
     * @param param
     */
    public renderContent(
        h: any,
        { root, node, data }: { root: any; node: any; data: any }
    ) {
        return h("span", {}, data.title);
    }
    /**
     * 渲染第一层级节点
     * @param h
     * @param param
     */
    public renderFirstNodes(
        h: any,
        { root, node, data }: { root: any; node: any; data: any }
    ) {
        return this.renderContent(h, { root, node, data });
    }
    public onToggleExpand(node: any) {
        node.expand
            ? this.expandNodeSet.add(node.id)
            : this.expandNodeSet.delete(node.id);
    }
}
export class CategoryDataUtil {
    // 处理公共树结构
    public static handlerTreeData(
        list: Array<any> = [],
        titleName: string,
        detailName: string = "",
        detailTitleName: string = titleName
    ) {
        let arr: Array<any> = [];
        // tslint:disable-next-line:no-unused-expression
        list &&
            list.forEach(v => {
                v.title = v[titleName];
                v.checked = false;
                v.selected = false;
                v.expand = false;
                v.indeterminate = false;
                if (v.children) {
                    v.children = CategoryDataUtil.handlerTreeData(
                        v.children,
                        titleName,
                        detailName,
                        detailTitleName
                    ).filter(c => !c.isDetail);
                }
                if (detailName) {
                    let tmp = v[detailName];
                    if (tmp) {
                        tmp = tmp.map((item: any) => {
                            item.title = item[detailTitleName];
                            item.isDetail = true;
                            item.checked = false;
                            item.selected = false;
                            item.indeterminate = false;
                            return item;
                        });
                        v.children = (v.children || []).concat(tmp);
                    }
                }
                arr.push(v);
            });
        return arr;
    }
}
