var path = require("path");
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var PROD = process.env.NODE_ENV === 'production';

module.exports = {
    context: __dirname,

    entry: {
        chess: [
            './chess.jsx'
        ]
    },

    output: {
        path: path.resolve('./bundle'),
        filename: "[name].wp.js"
    },

    plugins: [
        new ExtractTextPlugin("[name].wp.css", {
            allChunks: true
        })
    ].concat(PROD ? [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false
            }
        })
    ] : []),

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.rt$/,
                loader: "react-templates-loader"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=(\d+\.?){1,4})?$/,
                loader: 'file-loader'
            }
        ]
    },

    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx', '.rt']
    },

    devtool: !PROD ? "source-map" : ""
};
