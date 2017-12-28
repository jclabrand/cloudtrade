
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import express from 'express';
import co from 'co';

import colors from 'colors';

import AppAuth from '../../common/auth';
import AppFile from '../../persistence/file';
import AppError from '../../common/error';
import Render from '../../views/render';

/****************************************************************************************/

class SignupPipe {
	static process(req, res, next) {
		co(function*(){
			yield SignupPipe.hashed(req, res);
			yield SignupPipe.sigupPosted(req, res);
			yield SignupPipe.sigupVerified(req, res);
			yield SignupPipe.sigupFinished(req, res);
			yield SignupPipe.loged(req, res);

			return {};
		}).then((data)=>{
			next();
		}).catch((err)=>{
			next();
		});
	}

	static hashed(req, res) {
		return new Promise(function(resolve, reject){
			if(req.params.accountHash){
				let hvar = req.params.accountHash.split('-');
				if((hvar.length === 4) &&
					(hvar[0].length === 8) && (hvar[1].length === 4) && (hvar[2].length === 4) && (hvar[3].length === 8)){
					
					req.account = {
						status: 'hashed',
						hash: req.params.accountHash,
						statusMessages: ['El codigo hash del usuario a sido validado']
					}
					resolve();
				}else{
					let err = 'El codigo hash del usuario no pudo ser validado';
					req.account = {
						status: 'error',
						hash: req.params.accountHash,
						statusMessages: [err]
					}
					reject(err);
				}
			}else{
				let err = 'No se ha proporcionado un codigo hash para el usuario';
				req.account = {
					status: 'error',
					hash: '',
					statusMessages: [err]
				}
				reject(err);
			}
		});
	}

	static sigupPosted(req, res) {
		return new Promise(function(resolve, reject){
			if(req.account.status === 'hashed'){
				req.app.db.users.findOne({
					hashCode: req.params.accountHash
				}).then((user)=>{
					if(user){
						req.account.user = user;
						req.account.user.currentEmail = req.account.user.emails.find((email)=>{return email.current});
						req.account.status = 'sigup-posted';
						req.account.statusMessages.push(' EL usuario '+req.params.accountHash+' ya está registrado');
					}
					resolve();
				}).catch((err)=>{
					reject(err);
				});
			}else{
				reject();
			}
		});
	}

	static sigupVerified(req, res) {
		return new Promise(function(resolve, reject){
			if(req.account.status === 'sigup-posted'){
				if(req.account.user.currentEmail.verified){
					req.account.status = 'sigup-verified';
					req.account.statusMessages.push(' EL usuario '+req.params.accountHash+' ya ha sido verificado');
				}
				resolve();
			}else{
				reject();
			}
		});
	}

	static sigupFinished(req, res) {
		return new Promise(function(resolve, reject){
			if(req.account.status === 'sigup-verified'){
				if(req.account.user.role !== 'undefined'){
					req.account.status = 'sigup-finished';
					req.account.statusMessages.push(' EL usuario '+req.params.accountHash+' ya está registrado');
				}
				resolve();
			}else{
				reject();
			}
		});
	}

	static loged(req, res) {
		return new Promise(function(resolve, reject){
			req.app.auth.authorize(req, (err, user)=>{
				if(err){
					reject();
				}else if(user){
					req.account.status = 'loged-in';
					req.account.statusMessages.push(' EL usuario '+req.params.accountHash+' ha iniciado sesión');
					resolve();
				}else{
					req.account.status = 'loged-out';
					req.account.statusMessages.push(' EL usuario '+req.params.accountHash+' no ha iniciado sesión');
				}
			});
		});
	}
}

class ApiSignup {
	constructor() {
		this.router = express.Router();

		//return views
		this.router.get('/', this.welcome.bind(this));
		this.router.get('/crear-cuenta/:accountHash?', SignupPipe.process, this.createAccount.bind(this));
		this.router.get('/verificar/:accountHash?', SignupPipe.process, this.verifyAccount.bind(this));
		this.router.get('/verificar-email/:accountHash/:emailHash', SignupPipe.process, this.verifyAccountEmail.bind(this));
		this.router.get('/finalizar/:accountHash', SignupPipe.process, this.finish.bind(this));

		//return json, actually this is the API
		this.router.get('/api/estado-cuenta/:accountHash?', SignupPipe.process, this.statusAccountGET.bind(this));
		this.router.get('/api/email/:accountHash?', SignupPipe.process, this.signupEmailGET.bind(this));
		this.router.post('/api/crear-cuenta/:accountHash?', AppAuth.verifyCaptchaMW, SignupPipe.process, this.createAccountPOST.bind(this));
		this.router.post('/api/crear-clave/:accountHash?', SignupPipe.process, this.createAccountPasswordPOST.bind(this));
		//this.router.post('/:step/upload-file', this.registerUploadFilePOST.bind(this));
	}

	/************************************************************************************/
	//return views
	/************************************************************************************/

	welcome(req, res) {
		res.send(Render.view('signup'));
	}

	createAccount(req, res) {
		switch(req.account.status){
			case 'hashed':
				res.send(Render.view('signup'));
				break;
			case 'sigup-posted':
				res.redirect('/registro/verificar/' + req.account.hash);
				break;
			case 'sigup-verified':
				res.redirect('/registro/finalizar/' + req.account.hash);
				break;
			case 'sigup-finished':
			case 'loged-out':
				res.redirect('/login');
				break;
			case 'loged-in':
				res.redirect('/cuenta');
				break;
			case 'error':
			default:
				res.status(404).send('ERROR');
				break
		}
	}

	verifyAccount(req, res) {
		switch(req.account.status){
			case 'hashed':
				res.redirect('/registro/crear-cuenta/' + req.account.hash);
				break;
			case 'sigup-posted': //registered but not verified
				res.send(Render.view('signup'));
				break;
			case 'sigup-verified':
				res.redirect('/registro/finalizar/' + req.account.hash);
				break;
			case 'sigup-finished': //verified but not loged
			case 'loged-out':
				res.redirect('/login');
				break;
			case 'loged-in':
				res.redirect('/cuenta');
				break;
			case 'error':
			default:
				res.status(404).send('ERROR');
				break
		}
	}

	finish(req, res) {
		switch(req.account.status){
			case 'hashed':
				res.redirect('/registro/crear-cuenta/' + req.account.hash);
				break;
			case 'sigup-posted':
				res.redirect('/registro/verificar/' + req.account.hash);
				break;
			case 'sigup-verified':
				res.send(Render.view('signup'));
				break;
			case 'sigup-finished':
			case 'loged-out':
				res.redirect('/login');
				break;
			case 'loged-in':
				res.redirect('/cuenta');
				break;
			case 'error':
			default:
				res.status(404).send('ERROR');
				break
		}
	}

	/************************************************************************************/
	// do actions % redirects only
	/************************************************************************************/

	verifyAccountEmail(req, res) {
		co(function*(){
			switch(req.account.status){
			case 'hashed':
				res.redirect('/registro/crear-cuenta/' + req.account.hash);
				break;
			case 'sigup-posted':
				if(req.account.user.currentEmail.verificationHash === req.params.emailHash){
					yield req.account.user.updateVerifyEmail(req.account.user.currentEmail);
					res.redirect('/registro/finalizar/' + req.account.hash);
				}else{
					throw 'Error Invalid emailHash';
				}
				break;
			case 'sigup-verified':
				res.redirect('/registro/finalizar/' + req.account.hash);
				break;
			case 'sigup-finished': //verified but not loged
			case 'loged-out':
				res.redirect('/login');
				break;
			case 'loged-in':
				res.redirect('/cuenta');
				break;
			case 'error':
			default:
				throw 'ERROR';
			}
			return req.account.user;
		}).then((user)=>{
			// nothing todo
		}).catch((err)=>{
			res.status(404).send(err);
			//ApiSignup.responseStdError(res, AppError.std(err));
		});
	}

	/************************************************************************************/
	// API (return json & do actions)
	/************************************************************************************/

	statusAccountGET(req, res) {
		co(function*(){
			switch(req.account.status){
			case 'hashed':
			case 'sigup-posted':
			case 'sigup-verified':
			case 'sigup-finished':
			case 'loged-out':
			case 'loged-in':
				return {status: req.account.status};
			default:
				throw {message: 'Error del servidor. <' + req.account.statusMessages + '>'};
			}
		}).then((accountStatus)=>{
			res.json(accountStatus);
		}).catch((err)=>{
			ApiSignup.responseStdError(res, AppError.std(err));
		});
	}

	signupEmailGET(req, res) {
		co(function*(){
			switch(req.account.status){
			case 'sigup-posted':
			case 'sigup-verified':
			case 'sigup-finished':
			case 'loged-out':
			case 'loged-in':
				return yield req.app.db.emails.findOne({_id: req.account.user.currentEmail.emailRef});
			default:
				throw {message: 'Error del servidor. <' + req.account.statusMessages + '>'};
			}
		}).then((email)=>{
			res.json(email);
		}).catch((err)=>{
			ApiSignup.responseStdError(res, AppError.std(err));
		});
	}

	createAccountPOST(req, res) {
		co(function*(){
			switch(req.account.status){
			case 'hashed':
				let user = yield req.app.db.users.insertOne(req.body);
				let info = yield req.app.mailer.send(req.app.mailer.verifyEmailMessageFor(user), req.body.email);
				return user;
			default:
				throw {message: 'Error del servidor. <' + req.account.statusMessages + '>'};
			}
		}).then((user)=>{
			res.json(user);
		}).catch((err)=>{
			ApiSignup.responseStdError(res, AppError.std(err));
		});
	}

	createAccountPasswordPOST(req, res) {
		co(function*(){
			switch(req.account.status){
			case 'sigup-verified':
				let token = yield req.app.auth.sign({hashCode: req.account.user.hashCode, name: req.account.user.name});
				yield req.account.user.insertPassword(req.body);
				yield req.account.user.updateRole({role: 'client'});

				console.log(token);

				return {token};
			default:
				throw {message: 'Error del servidor. <' + req.account.statusMessages + '>'};
			}
		}).then((result)=>{
			res.json(result);
		}).catch((err)=>{
			ApiSignup.responseStdError(res, AppError.std(err));
		});
	}

	/************************************************************************************/
	// Helper functions
	/************************************************************************************/

	static responseStdError(res, e) {
		console.error(colors.red('ERROR: ' + e.message));
		res.status(e.responseStatus).json(e);
	}

	/*registerUploadFilePOST(req, res) {
		req.files.file.save('temp').then((msg)=>{
			res.status(200).json({status: 200, message: msg, name: req.files.file.uname});
		}).catch((err)=>{
			var e = new AppError(1500, 500, err);
			res.status(e.status).json({status: e.status, message: e.message});
		});
	}*/
}

module.exports = ApiSignup;
