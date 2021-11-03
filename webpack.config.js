const {resolve, join} = require('path');

let basePath = resolve(__dirname, 'dist/js');
module.exports = {
    entry: './src/index.js',
    output: {
        path: basePath,
        filename: "build.js"
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'css-loader', 'style-loader'
                ]
            }
        ]
    },
    plugins: [],
    mode: 'development',
    devServer: {
        static: {
            directory: join(__dirname, 'dist')
        },
        compress: true,
        port: 8000,
        open: true
    }
}
