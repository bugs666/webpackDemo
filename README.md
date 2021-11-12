# webpack学习笔记

## 基本概念

## 基本配置

## 插件

## webpack4与5的差异

## webpack的性能优化

### 开发环境性能优化

```
1、优化代码打包的速度
HMR:热模块替换（生产模式必须不能开启该模式！！！）
```

```
2、优化代码的调试
sourceMap：开发环境下的代码调试
```

```
3、多进程打包
```

```
4、Externals
三方库不打包，但是需要使用cdn链接引入
```

```
5、dll
三方库单独打包，然后将打包好的三方库引入
需要打包两次，先打包三方库，然后打包自己的代码，使用插件可以将三方的库引入
```

### 生产环境性能优化

```
1、优化打包构建速度
oneOf:单独进行loader的匹配，但是oneOf中不能包含两个同类型文件的配置
babel缓存：初次打包无效，后续打包会优化
```

```
2、优化代码运行的性能
文件缓存：通过hash，contenthash和chunkhash进行文件的缓存（版本号，哈希值不变，就不会重新打包）
    hash：webpack每次打包生成的哈希值
    chunkhash：同一个chunk会共享同一个hash值
    contenthash：根据文件内容来生成的hash值
```

```
3、treeShaking
未使用的文件不会打包，开启treeShaking模式需要具备两个条件
编译模式为esModule；打包模式为生产模式（mode：production）
```

```
4、pwa
渐进式网络应用程序（离线可访问），通过serviceWork和cach实现，
兼容性较差，需要单独进行处理
```

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
