
var path = require('path');
var nodeExternals = require('webpack-node-externals');


var serverConfig = {
	node: {
		__filename: true,
		__dirname: false
	},
	target: 'node',
	externals: [nodeExternals()],

	entry: {
		"index": "./src/server/index.js",
	},

	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js"
	},
	
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	}
};

var clientConfig = {
	target: 'web',
	entry: {
		"default.home": "./src/client/default/views/home.jsx",
		"default.tabletec": "./src/client/default/views/tabletec.jsx",
		"default.signup": "./src/client/default/views/signup.jsx",
		"default.account": "./src/client/default/views/account.jsx",
		"default.about": "./src/client/default/views/about.jsx",

		"default.adm-home": "./src/client/default/views/adm-home.jsx",
		"default.inventory": "./src/client/default/views/inventory.jsx",

		"default.error": "./src/client/default/views/error.jsx"
	},

	output: {
		path: path.join(__dirname, "dist", "assets", "js"),
		filename: "td.[name].js"
	},
	
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	}
};

module.exports = [ serverConfig, clientConfig ];
