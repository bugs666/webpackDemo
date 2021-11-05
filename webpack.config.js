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
                    plugins: ['postcss-preset-env']
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
                test: /\.(jpg|png|gif|jpeg)$/,
                loader: "url-loader",
                options: {
                    outputPath: 'asset',
                    name: '[hash:8].[ext]',
                    esModule: false,
                    limit: 8 * 1024
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    esModule: false
                }
            },
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
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [[
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: {
                                    version: 3
                                },
                                targets: {
                                    chrome: 60,
                                    ie: 10
                                }
                            }
                        ]],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            }
            // js代码检查
            // {
            //     test: /\.js&/,
            //     exclude: /node_modules/,
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
            template: "./src/index.html",
            minify: {
                // 折叠html代码中的空白
                collapseWhitespace: true,
                //删除html代码注释
                removeComments: true
            }
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
    // mode: 'development',
    // 开启生产模式时，会自动压缩js代码
    mode: 'production',
    devServer: {
        static: {
            directory: join(__dirname, 'dist')
        },
        compress: true,
        port: 3001,
        open: true
    }
}
