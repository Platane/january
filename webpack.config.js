const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const createEnvVarArray = () => {
    const o = {}
    ;['NODE_ENV', 'SOURCE_URL', 'BASE_PATH']
        .filter(name => name in process.env)
        .forEach(name => (o[`process.env.${name}`] = `"${process.env[name]}"`))

    return o
}

module.exports = {
    entry: {
        app: ['./src/index.js', './src/index.html'],

        // vendors in another chunk to minimize the files size ( too large and it's a pain to open in debugger s)
        vendor: ['react-dom', 'react', 'redux', 'react-redux'],
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
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
                                localIdentName: '[path][name]---[local]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('postcss-import')({}),
                                    require('postcss-simple-vars')({}),
                                    // require('autoprefixer')({}),
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
                            name: '[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
        }),

        new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),

        new webpack.DefinePlugin(createEnvVarArray()),
    ],

    devtool: 'source-map',

    devServer: {
        port: 8082,
        // contentBase: [distFolder, playerFolder],
        historyApiFallback: true,
        watchOptions: {
            ignored: /node_modules/,
        },
    },
}
