const {resolve, join} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

//将项目中的样式文件抽离为单独的css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//将css文件进行压缩，减小代码体积
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

let basePath = resolve(__dirname, 'dist');
module.exports = {
    entry: './src/js/index.js',
    output: {
        path: basePath,
        filename: "js/build.js"
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-preset-env'
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        new CssMinimizerWebpackPlugin()
    ],
    mode: 'development',
    devServer: {
        static: {
            directory: join(__dirname, 'dist')
        },
        compress: true,
        port: 3001,
        open: true
    }
}
