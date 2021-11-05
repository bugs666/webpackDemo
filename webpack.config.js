const {resolve, join} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

//将项目中的样式文件抽离为单独的css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//将css文件进行压缩，减小代码体积
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const EslintPlugin = require('eslint-webpack-plugin');

let basePath = resolve(__dirname, 'dist');

function getLoaderByType(type = 'css') {
    let res = [
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
    ];
    if (['scss', 'sass'].includes(type)) {
        return [...res, {
            loader: "sass-loader", // 将 Sass 编译成 CSS
            options: {sourceMap: true}  //必须要写
        }];
    }
    if (type == 'less') {
        return [...res, 'less-loader'];
    }
    return res;
}

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
                use: getLoaderByType()
            },
            {
                test: /.less$/,
                use: getLoaderByType('less')
            },
            {
                test: /.(sass|scss)$/,
                use: getLoaderByType('sass')
            }
            // webpack4的写法，在webpack5已被摒弃
            // {
            //     test: /\.js&/,
            //     exclude: '/node_modules/',
            //     use: {
            //         loader: "eslint-loader",
            //         options: {
            //             fixed: true
            //         }
            //     }
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        new CssMinimizerWebpackPlugin(),
        new EslintPlugin({
            context: './src/js',
            extensions: ['js', 'ts'],
            exclude: ['node_modules', 'dist'],
            fix: true
        })
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
