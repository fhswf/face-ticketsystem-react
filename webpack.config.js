const HtmlWebPackPlugin = require("html-webpack-plugin");
const Webpack = require('webpack');
const dotenv = require('dotenv').config({path: '.webpack.env'});

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
    entry: {
        main: './src/index.js',
        vendor: [
            'events',
            'react',
            'react-dom',
            'react-redux'
        ]
    },
    devtool: 'source-map',
    output: {
        publicPath: ASSET_PATH
    },
    devServer: {
        // historyApiFallback: {
        //     index: ASSET_PATH
        // }
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(sass|scss|css)$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            }
        ]
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
            BASENAME: JSON.stringify(ASSET_PATH)
        }),
        new Webpack.DefinePlugin({
            "process.env": dotenv.parsed
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]
};