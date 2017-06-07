const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const createEnvVarArray = () => {
    const o = {
        [`process.env.VERSION`]: `"${process.env.TRAVIS_BUILD_NUMBER || 'x'}-${new Date().toISOString()}"`,
    }
    ;['NODE_ENV', 'BASE_PATH', 'ROOT_URL', 'TRAVIS_BUILD_NUMBER']
        .filter(name => name in process.env)
        .forEach(
            name => (o[`process.env.${name}`] = `"${process.env[name] || ''}"`)
        )

    return o
}

module.exports = {
    entry: [
        'core-js/es6/array',
        'core-js/es6/promise',
        'core-js/es7/array',
        'whatwg-fetch',
        './src/index.js',
    ],

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[hash:8].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                'react',
                                'flow',
                                [
                                    'env',
                                    {
                                        targets: {
                                            browsers: [
                                                'last 2 versions',
                                                'safari >= 7',
                                            ],
                                        },
                                        loose: true,
                                        module: false,
                                    },
                                ],
                            ],
                            plugins: ['transform-class-properties'],
                        },
                    },
                ],
            },

            {
                test: /\.html?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].html',
                        },
                    },
                    {
                        loader: 'html-minify-loader',
                    },
                ],
            },

            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: true,
                                localIdentName: '[hash:8]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('postcss-import')({}),
                                    require('postcss-simple-vars')({}),
                                    require('autoprefixer')({
                                        browsers: ['last 2 versions', '> 5%'],
                                        flexbox: 'no-2009',
                                    }),
                                ],
                            },
                        },
                    ],
                }),
            },

            {
                test: /\.(svg|gif|jpg|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'asset/[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new ExtractTextPlugin({
            filename: '[contenthash:8].css',
            allChunks: true,
        }),

        new OptimizeCssAssetsPlugin(),

        new webpack.DefinePlugin(createEnvVarArray()),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),

        new UglifyJSPlugin({ comments: false }),

        // write stats
        function() {
            this.plugin('done', stats =>
                fs.writeFileSync(
                    path.join(__dirname, 'webpack-stats.json'),
                    JSON.stringify(stats.toJson())
                )
            )
        },

        // force fail on error
        function() {
            this.plugin('done', stats => {
                if (
                    stats.compilation.errors &&
                    stats.compilation.errors.length
                ) {
                    console.log(stats.compilation.errors)
                    process.exit(1)
                }
            })
        },
    ],
}
