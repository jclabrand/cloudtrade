
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import fs from 'fs';
import path from 'path';

import Colors from 'colors/safe';

/****************************************************************************************/

module.exports = class Theme {
	constructor() {
	}

	static load(themeName) {
		var name = themeName ? themeName + '.theme.json' : 'default.theme.json';
		var filePath = path.join(__dirname, 'themes', name);

		try{
			var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			return obj;
		}catch(e){
			console.error(Colors.red('ERROR: No se pudo abrir el archivo "' + filePath + '"'));
			return {
				name: 'default',
				version: "0.01",
				htmlColor: '#01579b',
				colorName: 'light-blue darken-4',

				styleSheets: [ ],
				scripts: [ '/js/jquery.js' ],

				routes: [
					{
						name: 'home',
						scripts: ['/js/tabletec.default.home.js']
					}
				]
			};
		}
	}
}
