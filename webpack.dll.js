const {resolve} = require('path');
const {DllPlugin} = require('webpack');


module.exports = {
    entry: {
        react: ["react"],
        jquery: ['jquery']
    },
    output: {
        path: resolve(__dirname, "dist/dll"),
        filename: "MyDll.[name].js",
        library: "[name]_[hash:8]"
    },
    plugins: [
        new DllPlugin({
            path: resolve(__dirname, "dist/dll/manifest.json"),
            name: "[name]_[hash:8]"
        })
    ],
    mode: 'development'
}
