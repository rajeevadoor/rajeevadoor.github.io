const path = require('path'); //absolute path for output
//HTML plugin to export index.html and minify HTML
const HtmlWebpackPlugin = require('html-webpack-plugin');

//Copies the images from SRC into distribution on build
const CopyWebpackPlugin = require('copy-webpack-plugin');

//Extracts and minifies the CSS/SASS files
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//Minifies the images
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const imageminMozjpeg = require('imagemin-mozjpeg');

//Auto prefixes CSS files for compatability (i.e -webkit)
const autoprefixer = require('autoprefixer');

//Analyzer tool when needed
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
//ENTRY POINT, where webpack starts bundling i.e dependancies
//REMOVE POLLYFILL loader if app is not reliant on any javascript
 entry: ['@babel/polyfill', './src/js/index.js'],

 //OUTPUT, where webpack saves the bundle
 output: {
 	path: path.resolve(__dirname, 'dist'), 
 	filename: 'js/bundle.js'
 },
 
 //Dev server pulls from here
 devServer: {
 	contentBase: './dist'
 },

 plugins: [

	// new BundleAnalyzerPlugin({
	// 	analyzerMode: 'none'
	// }),

	
	new MiniCssExtractPlugin({
		filename: "css/styles.css",
		chunkFilename: "css/[id].css"
	  }),

	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: './src/index.html',
		minify: {
			collapseWhitespace: true,
			removeComments: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			useShortDoctype: true
		}
	}),


 	new CopyWebpackPlugin([
        {from:'src/img',to:'img'} 
	]),

	new ImageminPlugin({ 
		pngquant: ({quality: '80'}),
		plugins: [imageminMozjpeg({quality: '80'})]
	}),

	],
 	module: {

 		rules: [
 		{
 				//test all files ending with .js
 				test: /\.js$/,
 				exclude: /node_modules/,
 				use: {
 					loader: 'babel-loader'
 				}
 		},

 		{
                test:/\.(s*)css$/, 
                use: [
					MiniCssExtractPlugin.loader,
					//Loads any CSS file
					{
						loader: "css-loader"
					},
						//Post the CSS load, apply auto prefixing and minify CSS
						{
							loader: "postcss-loader",
							options: {
								autoprefixer: {
									browsers: ["last 10 versions"]
								},
								plugins: () => [
									//Auto prefixes with -webkit on CSS
									autoprefixer,
									//Minifies the CSS
									require('cssnano')()
								]
							},
						},
					//Loads any Sass/SCSS filess
					{
						loader: "sass-loader",
						options: {}
					}
					
				],		
		}

 	]
}

};
