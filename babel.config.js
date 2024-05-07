module.exports = {
    presets: [
        '@babel/preset-env'
    ],
    // 引入当前目录下的plugins/change-name.js插件
    plugins: [['./src/babel-plugins/remove-debugger.js', {debugger: false}]]
}
