const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash'); // добавили плагин

module.exports = {
	
	devServer: { contentBase: path.join(__dirname, 'dist')},
	
	entry: { main: './scripts/main.js' },
	
	output:
	{
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[chunkhash].js'
	},

	module:
	{
		rules: 
		[
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {loader: "babel-loader"}
			},
			{
				test: /\.css$/,
				use:  [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
			}
		]
	},
	
	plugins:
	[ 
		new MiniCssExtractPlugin({filename: 'style.[contenthash].css'}),
		new HtmlWebpackPlugin(
		{
			inject: false,
			template: './index.html',
			filename: 'index.html'
		}),
		new WebpackMd5Hash()
	]
};



