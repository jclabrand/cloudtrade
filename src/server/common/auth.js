
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import request from 'request';
import jwt from 'jsonwebtoken';
import co from 'co';
import CustomStrategy from 'passport-custom';

import colors from 'colors';

//import { Strategy, ExtractJwt } from 'passport-jwt';

import AppError from './error';

/****************************************************************************************/

var RSA = {
	private: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAz7pZEypvrFJCDshsbOamj9bmy/dXnUOyCo5b3xSvvTNIoFAC\n5ePXozCD/5Byih1JB6ZYE6OceEW6oArkPzZOl8bFBlqV9k30oerMtVei18+CfF/u\nFLWlJXs9FvXrRTKtsL43OmpLCH3LdzK9/+ZqhEx/TShp3JudUWuRW8ALqrBd8QW5\nCWJHYozYVaIpFzwJ9KW6fJ9GpZfcToCOquLWo8iINnAovXmvcAtdmzgIqoucD988\nf9oerll/CubJLy2rOiyeRvsAYouoefoyQZWN8IYPlnb5IB6Z7qnVL6rZz44dAjVw\nS3uARW3lxpfeZn3TN7wpPkBssGBF0OSEHNrXVwIDAQABAoIBAC8HHCVnpRKZKNVZ\n8JoS+cB0wZmJrK8w5TzYj9oIP+UQmC+bDZzoISiT0j5ogFXeXWs68JO5pbHg72hO\nLvBUpiRcXryag3rYmTqTArdHWNmM5BiuSyMrIHFE3ka1dAcdew8ZcT1rVQNeH1Mk\nDLnDe3fqLaPVM2o7XLlTJfxklP+WN6xWhBgDVgEawneo5svdgblYhg3u7cb4fsHg\ncAf0sCYraVuqcUHa/AUVOx7n5U39x3ShOvOQvFlWEDD6uN4Yg/twW2UyfFDWD57p\n2oPIEf06wOOu2XylPQwEU9w92Fr4yNqk0xksn8sOjbRyEPZncpDICsPTo1nsrz+R\n0AcwWUkCgYEA7DfUujbbg6WrfSOyS718kTeej0Il5z19JYu11g+Sis4r8RWbT92q\nweCp4dCGCpJrsPbs4+s4hT42sKfjUcUy5ZCGTDturQNbhH0RGxPp1KUTrytzdph8\n4mqpCVYcN1AmLCCA0WtFqJ53taWuipcLtU48ZRC4jHI+stUSNCtaE8UCgYEA4R+6\nx5mUjOWAK8GSTgHMWa72KqaxR/osYwmMPtHtjIFm1aOElQaXbGlZKd3dR5Tnw/4R\n8hO/gJc+eQeaPGhri0IVmG66JNTw8q0M0Qd+l0OrarYS5c09XzjAUdGOatstsaNE\nrhgRG90HvVYt0cHyKRa/C4+CnEBod/EoS/UnhGsCgYB5wT1Qzj3PWXFPCzs3du/i\nGf0Mclf/HN6In76WG2i5SxOzLCPlwqflTtvBnS25/Uas7FmmEPQNGcguvhqZZz+Y\nvCm82VVusDBX1e8fOeBozr2aqJbXJjoYqkl+mnfoutMyI37Ccrxw8V1ar4+Lt9c9\nGJpgrYGyQqC2pMTBRyci0QKBgHxc9uXE5ddgAQorCROm0qjIipzNMSo9/b9ISv15\nIu13nsNubZOV7JirKeKC+fbNP6t585fzaNs0sgJSPNYaKS7o9t0abiJisCifiHEA\n3uHZNBzjMFVaqAiuZS/NwAsvwXJca1hxWyI1XE0wCmfR6GDie+96/AAtZIi95DDx\n4T65AoGBAIE5LSP+glxJEd8jU/qc80D/dXf6icURyYDGARw8mziAgw6fL9cwbmqb\nIGDxP1ke2FA8OZ0W4VybRi9UcprenvADYpPb+CPZv4gxGoDFg0Bb/JcFUKL29hC1\nsteX0GR4TKYNeXLC+zz7Qr0DzhpqRswSyHG5GckkIRdgHx4l/Uza\n-----END RSA PRIVATE KEY-----",
	public: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz7pZEypvrFJCDshsbOam\nj9bmy/dXnUOyCo5b3xSvvTNIoFAC5ePXozCD/5Byih1JB6ZYE6OceEW6oArkPzZO\nl8bFBlqV9k30oerMtVei18+CfF/uFLWlJXs9FvXrRTKtsL43OmpLCH3LdzK9/+Zq\nhEx/TShp3JudUWuRW8ALqrBd8QW5CWJHYozYVaIpFzwJ9KW6fJ9GpZfcToCOquLW\no8iINnAovXmvcAtdmzgIqoucD988f9oerll/CubJLy2rOiyeRvsAYouoefoyQZWN\n8IYPlnb5IB6Z7qnVL6rZz44dAjVwS3uARW3lxpfeZn3TN7wpPkBssGBF0OSEHNrX\nVwIDAQAB\n-----END PUBLIC KEY-----"
}

class AppAuth {
	constructor(passport) {
		//this.db = db;
		this.passport = passport;
		//this.cnnstr = /*'mongodb://localhost:/tabletec'*/
		//	'mongodb://ttadmin:TT2377mon@ds135800.mlab.com:35800/tabletec';

		/*var opts = {}
		opts.secretOrKey = this.privateRSA;
		opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
		opts.algorithms = ["HS256", "HS384"];

		passport.use(new Strategy(opts, this.onFromAuthHeader.bind(this)));*/

		passport.use('jwt', new CustomStrategy(this.authorize.bind(this)));
	}

	sign(payload) {
		let cert = RSA.private;
		return new Promise(function(resolve, reject){
			jwt.sign(payload, cert, { algorithm: 'RS256' }, function(err, token) {
				if(err){ reject(err); }else{ resolve(token); }
			});
		});
	}

	verify(token) {
		let cert = RSA.public;
		return new Promise(function(resolve, reject){
			jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
				if(err){ reject(err); }else{ resolve(payload); }
			});
		});
	}

	authorize(req, callback) {
		if(req.headers && req.headers.authorization){
			let token = req.headers.authorization;
			this.verify(token).then(payload=>{
				this.onAuthenticate(req, payload, callback);
			}).catch(err=>{
				this.onUnauthorized('Credenciales de usuario inválidos', callback);
			});
		}else{
			this.onUnauthorized('El usuario no tiene credenciales', callback);
		}
	}

	onAuthenticate(req, jwt_payload, callback) {
		let self = this;
		let cnn = req.app.systemdb;
		/*cnn.users.findOne({code: jwt_payload.code}).then(user=>{
			if(user){
				callback(null, user);
			}else{
				this.onUnauthorized(callback);
			}
		}).catch(err=>{
			callback(err);
		});*/

		co(function*(){
			let user = yield cnn.users.findOne({code: jwt_payload.code});
			if(user){
				let emailRefFound = user.emails.find(email=>{ return email.current; });
				let fEmail = yield cnn.emails.findOne({code: emailRefFound.code});
				user.email = fEmail.email;

				callback(null, user);
			}else{
				self.onUnauthorized('El usuario tiene credenciales válidos pero no se encontró registro de sus datos', callback);
			}
			return {}
		}).then(result=>{
			// need't to resoleve anything
		}).catch(err=>{
			callback(err);
		});
	}

	onUnauthorized(msg, callback) {
		console.log(colors.yellow('ADVERTENCIA:', msg));
		callback(null, false, msg);
	}


	static verifyCaptchaMW(req, res, next) {
		let recaptcha = req.body.recaptcha,
			remoteip = req.connection.remoteAddress;
		if((recaptcha === undefined) || (recaptcha === '') || (recaptcha === null)){
			let e = AppError.std('No has enviado un codigo recaptcha');
			res.status(e.responseStatus).json(e);
		}else{
			var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' +
				req.app.defs.STR_RECAPTCHA_PRIVATE_KEY + '&response=' + recaptcha + '&remoteip=' + remoteip;

			request(verificationUrl, function(error, response, body) {
				body = JSON.parse(body);
				if(body.success !== undefined && !body.success) {
					let e = AppError.std('No se pudo verificar el recaptcha');
					res.status(e.responseStatus).json(e);
				}else{
					next();
				}
			});
		}
	}
}

module.exports = AppAuth;
