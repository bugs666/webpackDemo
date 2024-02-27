const {resolve} = require('path');
const {DllPlugin} = require('webpack');


module.exports = {
    entry: {
        vendor: ['react', 'jquery', "react-dom"]
    },
    output: {
        path: resolve(__dirname, "dll"),
        filename: "[name].dll.js",
        library: "[name]_[hash:8]"
    },
    plugins: [
        new DllPlugin({
            path: resolve(__dirname, "dll/manifest.json"),
            name: "[name]_[hash:8]"
        })
    ],
    mode: 'development'
}
