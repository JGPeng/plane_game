const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const webpack = require('webpack')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, './main.js'),
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, './dist')
    },
    devtool: 'source-map',
    devServer: {
        port: 8001,
        hot: true,
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '飞机大战'
        }),
        // new CleanWebpackPlugin(),
        // new webpack.HotModuleReplacementPlugin()
    ],
    // optimization: {
    //     minimizer: [
    //         new UglifyJSPlugin({ sourceMap: true })
    //     ]
    // },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/',
                            publicPath: ''
                        }
                    }
                ]
            }
        ]
    },
    // 解决文件资源过大的报错警告
    performance: {
        hints: false
    }
}