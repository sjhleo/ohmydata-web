import "./index.scss";

import CodeMirror, { EditorConfiguration } from "codemirror";
// tslint:disable-next-line:no-submodule-imports
import "codemirror/addon/edit/matchbrackets";
// tslint:disable-next-line:no-submodule-imports
import "codemirror/addon/selection/active-line";
// tslint:disable-next-line:no-submodule-imports
import "codemirror/mode/sql/sql";
// tslint:disable-next-line:no-submodule-imports
import "codemirror/addon/hint/show-hint";
// tslint:disable-next-line:no-submodule-imports
import "codemirror/addon/hint/sql-hint";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import DataSourceService from "@/views/data-source/service";
import autowired from "@/decorators/autowired";
import Vue from "vue";
@Component({
    template: require("./index.html")
})
export default class CodeEditor extends Vue {
    @PropSync("content", { default: "" })
    public code!: string;
    @Prop({ default: () => new Object() })
    public option!: EditorConfiguration;
    @Prop({ default: "" })
    public dataSourceId!: string;
    @autowired(DataSourceService)
    public dataSourceService!: DataSourceService;
    public editor!: CodeMirror.EditorFromTextArea;
    public mounted() {
        this.init();
    }

    public init() {
        this.editor = CodeMirror.fromTextArea(
            this.$refs.code as HTMLTextAreaElement,
            {
                ...{
                    mode: "text/x-sql", // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
                    indentWithTabs: true,
                    smartIndent: true,
                    lineNumbers: true,
                    matchBrackets: false,
                    lineWrapping: true,
                    // theme: theme,
                    autofocus: true,
                    extraKeys: {
                        Enter: "autocomplete",
                        "Ctrl+Z": "redo",
                        "Alt-Enter": "newlineAndIndent"
                    },
                    hintOptions: {
                        completeSingle: false
                        // 自定义提示选项
                        // tables: {
                        //     users: ["name", "score", "birthDate"],
                        //     countries: ["name", "population", "size"]
                        // }
                    } as any
                },
                ...this.option
            }
        );
        this.editor.setCursor(this.code.length);
        // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
        this.editor.on("cursorActivity", async (editor: CodeMirror.Editor) => {
            let hintOptions = editor.getOption("hintOptions") as any;
            if (this.dataSourceId) {
                let cur = editor.getCursor();
                let line: string = editor.getLine(cur.line);
                let end = cur.ch;
                let keyword = line.substring(0, end - 1);
                let start = keyword.lastIndexOf(" ");
                keyword = keyword.substring(start + 1);
                // 匹配到表 请求后端获取表字段
                if (
                    hintOptions.tables[keyword] &&
                    line.charAt(end - 1) === "."
                ) {
                    let result = await this.dataSourceService.getTableFields(
                        this.dataSourceId,
                        keyword
                    );
                    hintOptions.tables[keyword] = result.data.columns.map(
                        (v: any) => v.name
                    );
                }
            }
            this.code = editor.getValue();
            // let isSpace = !this.code.charAt(editor.getCursor().ch - 1);
            if (this.code && !this.option.readOnly) {
                editor.showHint(hintOptions);
            }
        });
    }
    @Watch("option")
    public optionChange() {
        Object.keys(this.option).forEach((key: string) => {
            this.editor.setOption(key as any, (this.option as any)[key]);
        });
    }
    public setCode(code: string) {
        this.editor.setValue(code);
        this.editor.setCursor(code.length);
    }
}
