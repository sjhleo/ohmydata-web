const path = require("path");
const isProd = process.env.NODE_ENV === "production";
module.exports = {
    //基本路径
    publicPath: "./",
    //输出文件目录
    outputDir: "dist",
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: "static",
    //以多页模式构建应用程序。
    pages: undefined,
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: true,
    //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
    parallel: require("os").cpus().length > 1,
    //生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: false,
    // webpack配置
    //对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config.module
            .rule("html")
            .test(/\.html$/)
            .exclude.add(/public/)
            .end()
            .use("raw-loader")
            .loader("raw-loader");
        // 只输出src下ts文件错误
        config.plugin("fork-ts-checker").tap(args => {
            args[0].reportFiles = ["src/**/*.{ts,tsx}"];
            return args;
        });
        config.resolve.alias.set("@", path.join(__dirname, "src"));
    },
    //调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
    configureWebpack: {},
    css: {
        // 启用 CSS modules
        // requireModuleExtension: false,
        // 是否使用css分离插件, 使用该插件 css的热更新会失效
        extract: isProd,
        // 开启 CSS source maps，一般不建议开启
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            sass: {
                //设置css中引用文件的路径，引入通用使用的scss文件（如包含的@mixin）
                prependData: `
    				$baseUrl: "/";
                    @import '~@/assets/styles/_mixin.scss';
				`
            }
        }
    }
};
