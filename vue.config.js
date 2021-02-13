const webpack = require('webpack')
const moment = require('moment')

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
    return 'v' + moment().format('YYYY.MM.DD.HHmmss') + '-' + random
}


const env = process.env.NODE_ENV || 'production';
const isDev = env !== 'production';

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
                    @import "@/assets/scss/theme/_variables.scss";
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
        config.devServer = {
            port: 4000
        }

        const buildVersion = generateUniqueBuildInfo();

        const apiUrl = !isDev
            ? 'https://phala-miner-monitor2.100k.dev:8084/graphql'
            : 'http://localhost:8084/graphql';
        const appData = JSON.stringify({
            apiUrl,
            buildVersion,
        })

        config.plugins.push(
            new webpack.DefinePlugin({
                __APP_DATA__: JSON.stringify(appData)
            }),
        )

        if (env !== 'production') {
            // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
            // config.plugins.push(new BundleAnalyzerPlugin());
        }

        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        })
    },
}
