module.exports = {
    plugins: [
        [
            '@babel/plugin-proposal-decorators',
            { 'legacy': true }
        ],
        [
            '@babel/plugin-proposal-class-properties'
        ],
        "@babel/plugin-syntax-dynamic-import",
        '@babel/plugin-syntax-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
    ],
    presets: [
        '@vue/cli-plugin-babel/preset',
    ]
};
