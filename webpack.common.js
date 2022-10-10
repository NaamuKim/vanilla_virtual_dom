const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyCssExtractPlugIn = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new MinifyCssExtractPlugIn({ filename: 'styles/style.css' }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist'],
        }),
    ],
    module: {
        rules: [
            {
                test : /\.js$/,
                exclude: /node_modules/,
                use : "babel-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.scss$/,
                use: [MinifyCssExtractPlugIn.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        historyApiFallback: true,
    },
};
