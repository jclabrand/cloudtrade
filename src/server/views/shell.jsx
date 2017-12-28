
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

import Theme from './theme';

import Head from './components/head.jsx';
import Scripts from './components/scripts.jsx';

import DEFS from '../app/defines';

/****************************************************************************************/

module.exports = class Shell extends React.Component{
	constructor(props, subName) {
		super(props);

		this._subName = subName;
	}

	assetsFromTheme(theme) {
		var assets = {
			styleSheets: theme.styleSheets,
			scripts: theme.scripts
		}

		this.onLoadAssets(theme, assets);

		return assets;
	}

	onLoadAssets(theme, assets) {
		var self = this;
		if(this._subName){
			var subValues = theme.routes.find(function(route){
				return route.name === self._subName
			});

			if(subValues){
				if(subValues.styleSheets){
					assets.styleSheets = assets.styleSheets.concat(subValues.styleSheets);
				}
				if(subValues.scripts){
					assets.scripts = assets.scripts.concat(subValues.scripts);
				}
			}
		}
	}

	render() {
		var theme = Theme.load(this.props.themeName);
		var assets = this.assetsFromTheme(theme);

		return(
		<html>
			<Head	iconName={DEFS.RC_ICON_APP} title={DEFS.STR_COMPANY_NAME}
					styleSheets={assets.styleSheets}>

				<meta name="theme-color" content={theme.htmlColor} />
				<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
				{this.props.headScripts}
			</Head>

			<body>
				<div id="app-main"></div>
			</body>

			<Scripts scripts={assets.scripts}/>
			
		</html>)
	}
}
