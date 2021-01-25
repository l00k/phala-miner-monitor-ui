const webpack = require('webpack');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

class IntiPathResolverPlugin
{
    static MODULES_PATH = __dirname + '/src/modules/'

    constructor (source, target) {
        this.source = source || 'resolve'
        this.target = target || 'resolve'
    }

    apply (resolver) {
        var target = resolver.ensureHook(this.target)
        resolver
            .getHook(this.source)
            .tapAsync('IntiPathResolverPlugin', (request, resolveContext, callback) => {
                if (request.request[0] === '#') {
                    request.request = request.request.replace('#/', IntiPathResolverPlugin.MODULES_PATH)
                    return resolver.doResolve(target, request, null, resolveContext, callback)
                }
                callback()
            })
    }

}

function generateUniqueBuildInfo () {
    const date = new Date()
    const random = 10000 + Math.round(Math.random() * 89999)
    return `v${date.getFullYear()}.${date.getMonth()}.${date.getDay()}.${date.getHours()}.${date.getMinutes()}-${random}`
}

module.exports = {
    runtimeCompiler: true,
    css: {
        sourceMap: true,
        extract: false,

        loaderOptions: {
            css: {
                sourceMap: true,
            },
            sass: {
                prependData: `
                    @import "~bulma/sass/utilities/initial-variables";
                    @import "~bulma/sass/utilities/functions";
                    @import "@/assets/scss/_variables.scss";
                    @import "@/assets/scss/_mixins.scss";
                `,
                sourceMap: true,
            }
        },
    },
    transpileDependencies: [
        'vuex-module-decorators'
    ],
    configureWebpack (config) {
        config.optimization.minimize = false
        config.devtool = 'source-map'
        config.resolve.plugins = [new IntiPathResolverPlugin()]

        config.plugins.push(
            new webpack.DefinePlugin({
                __BUILD_INFO__: JSON.stringify(generateUniqueBuildInfo()),
            }),
            //new BundleAnalyzerPlugin()
        )

        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        })
    },
}