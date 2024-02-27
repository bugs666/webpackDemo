const {resolve, join} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

//将项目中的样式文件抽离为单独的css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//将css文件进行压缩，减小代码体积
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

// 渐进式网络应用程序
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const EslintPlugin = require('eslint-webpack-plugin');

const {DllReferencePlugin} = require('webpack');

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

let basePath = resolve(__dirname, 'dist');

function getLoaderByType(type = 'css') {
    let res = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
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
    if (type === 'less') {
        return [...res, 'less-loader'];
    }
    return res;
}

module.exports = {
    entry: resolve(__dirname, 'src/index.js'),
    output: {
        path: basePath,
        filename: "js/build.[contenthash:8].js"
    },
    resolve: {
        alias: {
            "@src": resolve(__dirname, 'src'),
            "@assets": resolve(__dirname, 'src/assets')
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(jpg|png|gif|jpeg)$/,
                        loader: "url-loader",
                        options: {
                            outputPath: 'asset',
                            name: '[name].[hash:8].[ext]',
                            esModule: false,
                            limit: 8 * 1024
                        },
                        type: 'javascript/auto'
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
                        test: /\.html$/,
                        loader: "html-loader",
                        options: {
                            esModule: false
                        }
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    '@babel/preset-env',
                                    '@babel/preset-react'
                                    // {
                                    //     useBuiltIns: 'usage',
                                    //     corejs: {
                                    //         version: 3
                                    //     },
                                    //     targets: {
                                    //         chrome: 60,
                                    //         ie: 10
                                    //     }
                                    // }
                                ],
                                plugins: [
                                    '@babel/plugin-transform-runtime'
                                ],
                                cacheDirectory: true
                            }
                        }
                    },
                    {
                        test: /\.(ts|tsx)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'ts-loader', options: {
                                transpileOnly: true
                            }
                        }

                    },
                    {
                        test: /\.ttf$/,
                        use: {
                            loader: "file-loader",
                            options: {
                                name: 'media/[name].[hash:8].[ext]',
                                esModule: false
                            }
                        },
                        type: 'javascript/auto',
                    }
                ]
            }
            // js代码检查 webpack5之前的配置方法
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
            filename: 'css/main.[contenthash:8].css'
        }),
        new CssMinimizerWebpackPlugin(),
        //js代码检查，webpack5配置方法
        // new EslintPlugin({
        //     context: './src/js',
        //     extensions: ['js', 'ts'],
        //     exclude: ['node_modules', 'dist'],
        //     fix: true
        // }),
        // new WorkboxWebpackPlugin.GenerateSW({
        //     // 这些选项帮助快速启用 ServiceWorkers
        //     // 不允许遗留任何“旧的” ServiceWorkers
        //     clientsClaim: true,
        //     skipWaiting: true
        // }),
        new DllReferencePlugin({
            manifest: require('./dll/manifest.json')
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath: join(__dirname, 'dll/vendor.dll.js'),
            publicPath: 'dll',
            outputPath: 'dll'
        })
    ],
    mode: 'development',
    // 开启生产模式时，会自动压缩js代码
    // mode: 'production',
    devServer: {
        static: {
            directory: resolve(__dirname, 'dist')
        },
        compress: true,
        port: 3001,
        open: true,
        //开启热模块替换 HMR
        hot: true
    },
    devtool: 'eval-source-map',
    //代码分割
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
}
