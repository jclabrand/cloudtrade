
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import express from 'express';

/****************************************************************************************/

class ApiSecurity {
	constructor() {
		this.router = express.Router();

		this.router.get('/recaptcha-clave-publica', this.recaptchaPublicKeyGET.bind(this));
	}

	recaptchaPublicKeyGET(req, res) {
		res.json({rpk: req.app.defs.STR_RECAPTCHA_PUBLIC_KEY});
	}
}

module.exports = ApiSecurity;
