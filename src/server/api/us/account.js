
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import express from 'express';
import passport from 'passport';
import co from 'co';

/****************************************************************************************/

class ApiAccount {
	constructor() {
		this.router = express.Router();

		this.router.post('/iniciar', this.loginPOST.bind(this));
		this.router.get('/autenticar', passport.authenticate('jwt', {session: false}), this.authenticateGET.bind(this));
		this.router.post('/iniciar-con-empresa', this.loginWithCompanyPOST.bind(this));

		this.router.get('/empresas', passport.authenticate('jwt', {session: false}), this.companiesGET.bind(this));
	}

	/************************************************************************************/
	// Middle Wares
	/************************************************************************************/


	/************************************************************************************/
	// API (return json & do actions)
	/************************************************************************************/

	authenticateGET(req, res) {
		co(function*(){
			/*let emailRefFound = req.user.emails.find((email)=>{
				return email.current;
			});
			let fEmail = yield req.app.systemdb.emails.findOne({code: emailRefFound.code});*/

			return {user: {code: req.user.code, name: req.user.name, email: req.user.email}};
		}).then(result=>{
			res.json(result);
		}).catch(err=>{
			res.sendError(err);
		});
	}

	loginPOST(req, res) {
		co(function*(){
			let user = yield req.app.systemdb.users.findOneByEmail(req.body);
			yield user.auth({password: req.body.password});
			let token = yield req.app.auth.sign({code: user.code, name: user.name});
			return {token};
		}).then(result=>{
			res.json(result);
		}).catch(err=>{
			res.sendError(err);
		});
	}

	loginWithCompanyPOST(req, res) {
		co(function*(){
			if(!req.body.company){
				throw ('No existe nombre de empresa.');
			}
			console.log('BODY', req.body.company);
			let company = yield req.app.systemdb.companies.findOne({uniqueName: req.body.company});
			console.log('DB COMPANY', company);
			let db = yield req.app.dbConnection(company.sysname);//if company is null or not defined then this fail
			if(company.status !== 'active'){
				throw (company.name + ' esta ' + company.status);
			}

			let user = yield req.app.systemdb.users.findOneByEmail(req.body);
			yield user.auth({password: req.body.password});
			console.log('DB USER', user);

			let compFound = user.companies.find(icompany=>{ return company.code === icompany.code; });
			let employee = yield db.staff.findOne({code: user.code});
			if(!compFound || !employee){
				throw 'Acceso no autorizado';
			}
			console.log('DB EMPLOYE', employee);
			
			let token = yield req.app.auth.sign({code: user.code, name: user.name});
			console.log('TOKEN', token);
			return {token};
		}).then(result=>{
			res.json(result);
		}).catch(err=>{
			res.sendError(err);
		});
	}

	companiesGET(req, res) {
		co(function*(){
			let rcompanies = [];
			for(let company of req.user.companies) {
				let dbcompany = yield req.app.systemdb.companies.findOne({'code': company.code});
				rcompanies.push({name: dbcompany.name, uniqueName: dbcompany.uniqueName});
			}
			return {companies: rcompanies};
		}).then(result=>{
			console.log(result);
			res.json(result);
		}).catch(err=>{
			res.sendError(err);
		});
	}
}

module.exports = ApiAccount;
