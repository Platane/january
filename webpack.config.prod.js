const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const createEnvVarArray = () => {
    const o = {}
    ;['NODE_ENV', 'BASE_PATH']
        .filter(name => name in process.env)
        .forEach(name => (o[`process.env.${name}`] = `"${process.env[name]}"`))

    return o
}

module.exports = {
    entry: ['./src/index.js', './src/index.html'],

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[hash:8].js',
    },

    // resolve: {
    //     alias: {
    //         react: path.join(
    //             __dirname,
    //             'node_modules',
    //             'react',
    //             'dist',
    //             'react.min.js'
    //         ),
    //     },
    // },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'es2015', 'es2017', 'flow'],
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
                                    require('autoprefixer')({}),
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

        new webpack.DefinePlugin(createEnvVarArray()),

        new UglifyJSPlugin(),

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
