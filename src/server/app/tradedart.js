
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import http from 'http';
import path from 'path';
import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import passport from 'passport';
import jsonfile from 'jsonfile';
import cors from 'cors';

import colors from 'colors';

import DEFS from './defines';

import AppAuth from '../common/auth';
import AppMailer from '../common/mailer';
import AppError from '../common/error';
import AppFile from '../persistence/file';
import AppDB from '../persistence/mongo/db';

import AppRoot from './root';

/****************************************************************************************/

module.exports = class Tabletec {
	constructor() {
		let config = jsonfile.readFileSync(path.join(__dirname, 'config.json'));

		this._control = express();

		this._db = new AppDB(config.db);
		this._mailer = new AppMailer();
		this._auth = new AppAuth(passport);

		this._control.use(express.static(path.join(__dirname, 'assets')/*, {maxAge: '2h'}*/));
		this._control.use(cors());
		this._control.use(this.appMW.bind(this));
		this._control.use(fileUpload());
		//this._control.use(AppFile.uploadMW);

		this._control.use(bodyParser.urlencoded({ extended: false }));
		this._control.use(bodyParser.json());

		let appRoot = new AppRoot();
		this._control.use('/', this.logMW, appRoot.router);//fsd


		this._control.use(this.notFound.bind(this));

		this.onLoad();
	}

	onLoad() {
		this._server = http.createServer(this._control);
		this._server.listen(DEFS.PORT, this.onStart.bind(this));
	}

	onStart() {
		console.log(colors.blue('INFORMACIÓN: El servidor está listo y escuchando por el puerto:', DEFS.PORT));

		//this._db.getConnection(cnnstr);
	}

	// middle wares

	appMW(req, res, next) {
		let self = this;
		req.app = {
			defs: DEFS,
			auth: this._auth,
			systemdb: this._db.systemdb,
			mailer: this._mailer,

			dbConnection: function(dbname) {
				return new Promise(function(resolve, reject){
					self._db.connection(dbname, (err, cnn)=>{
						if(err){ reject(err); }
						else{ resolve(cnn); }
					});
				});
			}
		}

		res.sendError = function(err) {
			let e = AppError.std(err);
			console.error(colors.red(e.message));
			res.status(e.responseStatus).json(e);
		}

		next();
	}

	logMW(req, res, next) {
		console.log(req.method, req.url);
		next();
	}

	// routes

	notFound(req, res) {
		res.status(404).send('NO ENCONTRADO');
	}
}
