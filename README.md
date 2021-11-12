# webpack学习笔记

## 基本概念

## 基本配置

## 插件

## webpack4与5的差异

## webpack的性能优化

### 开发环境性能优化

`优化代码打包的速度，优化代码而定调试`

### 生产环境性能优化

`优化打包构建速度，优化代码运行的性能`

## 遇到的一些坑

### 1. url-loader和file-loader重复打包产生重复资源文件

```
解决办法：https://webpack.docschina.org/guides/asset-modules/
原因：webpack5之前的资源模块需要使用raw-loader,url-loader和file-loader进行资源处理， 
但是在webpack5中继续使用这些旧的资源loader时，就会导致资源模块重复
```

### 2. 用add-asset-html-webpack-plugin插件生成的引用路径多一层auto（auto/MyDll.react.js）

```
解决办法：添加publicPath配置，值为dll打包的资源路径
```

```
new AddAssetHtmlWebpackPlugin({
    filepath: join(__dirname, 'dist', 'dll/MyDll.*.js'),
    publicPath: './dll'
})
```
