const webpack = require('webpack');

const path = require('path');

const config = {
    mode: 'development',
    entry: {
        'pcui': './src/index.js',
        'pcui-react': './src/components/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: process.env.LIBRARY_NAME ? `${process.env.LIBRARY_NAME}_[name]` : '[name]',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', {
                    loader: 'sass-loader'
                }]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ],
        extensions: ['.jsx', '.js']
    },
    plugins: []
};

if (process.env.ENGINE_PATH) {
    config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
            /^playcanvas$/,
            path.resolve(__dirname, process.env.ENGINE_PATH)
        )
    );
}

module.exports = config;