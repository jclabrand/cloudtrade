
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import moment from 'moment';
moment.locale('es');

/****************************************************************************************/

module.exports = class AppDate {
	constructor(connection) {
	}

	static now() {
		return moment().format('L LTS');
	}

	static parse(str) {
		var astr = str.split('/');
		return new Date(astr[2]+' '+astr[1]+' '+astr[0]);
	}
}
