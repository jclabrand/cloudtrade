
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';

import Render from '../views/render';

import ApiSecurity from '../api/us/security';
import ApiAccount from '../api/us/account';
import ApiSignup from'../api/us/signup';
import ApiCompany from '../api/company/company';


import AppCompany from './company';

/****************************************************************************************/

class Root {
	constructor() {
		let apiSecurity = new ApiSecurity(),
			apiSignup = new ApiSignup(),
			apiAccount = new ApiAccount(),
			apiCompany = new ApiCompany();

		let appCompany = new AppCompany();

		this.router = express.Router();

		this.router.use('/api/seguridad', apiSecurity.router);
		this.router.use('/api/cuenta', apiAccount.router);
		this.router.use('/api/empresa/:company', appCompany.find, apiCompany.validate, apiCompany.router);


		this.router.use('/build/test', this.buildtest);

		//this.router.use('/registro', apiSignup.router);
		
		this.router.use('/empresa/:company', appCompany.find, appCompany.validate, appCompany.router);
		this.router.use('/empresas', appCompany.companies);

		this.router.get('/', this.home.bind(this));
		this.router.get('/login', this.login.bind(this));

		this.router.get('/acerca-de', this.about.bind(this));
		this.router.get('/acerca-de/', this.about.bind(this));
		this.router.get('/acerca-de/condiciones', this.about.bind(this));
		this.router.get('/acerca-de/politica-de-datos', this.about.bind(this));

		this.router.get('/cuenta', this.account.bind(this));
		this.router.get('/cuenta/perfil', this.account.bind(this));
		this.router.get('/cuenta/empresas', this.account.bind(this));
	}



	buildtest(req, res) {
		co(function*(){
			/*yield req.app.systemdb.emails.insertOne({
				email: 'jcharlylc@gmail.com'
			});*/

			//SIGNUP STEP1
			/*let user = yield req.app.systemdb.users.insertOne({
				clientHash: 'TT______-TT______-TT______',
				name: 'Tabletec Admin',
				email: 'tabletec@hotmail.com'
			});*/

			//SIGNUP STEP2
			/*let user = yield req.app.systemdb.users.findOne({code: 'ku1ONe4N-pkqSPgMsbreUgevK-p7Fy18q9'});
			yield user.updateVerifyEmail({verificationHash: 'DqSKgmpQ13LmmpH84O58q5teR11zartZ-v3OiK7RP8SjqDMHeY537XZT8miM4mTLv-int8hx2SZVkxIH74vOcl6M0zNdETaVBX'});
			yield user.updateRole({role: 'client'});*/

			//SIGNUP STEP3
			/*let user = yield req.app.systemdb.users.findOne({code: 'ku1ONe4N-pkqSPgMsbreUgevK-p7Fy18q9'});
			yield user.insertPassword({password: 't4b13t3c/ADMIN'});*/


			//LOGIN
			/*let user = yield req.app.systemdb.users.findOne({code: 'PVmnp0lV-q73XhbgiMhZIR6us-oudWz1xi'});
			yield user.auth({password: '123456'});*/


			//REGISTER COMPANY
			/*let user = yield req.app.systemdb.users.findOne({code: 'ku1ONe4N-pkqSPgMsbreUgevK-p7Fy18q9'});
			let company = yield req.app.systemdb.companies.insertOne({
				uniqueName: 'tabletec',
				name: 'Tabletec'
			});
			yield user.addCompany({code: company.code});
			let cnn = yield req.app.dbConnection(company.sysname);
			cnn.staff.insertOne({code: user.code, role: 'owner'});*/

			//ALLOW EMPLOYE ON COMPANY
			/*let cnn = yield req.app.dbConnection('co_91a270a1_tektable');
			yield cnn.staff.insertOne({code: 'ku1ONe4N-pkqSPgMsbreUgevK-p7Fy18q9', role: 'owner'});*/

			/*let user = yield req.app.systemdb.users.findOne({code: 'ku1ONe4N-pkqSPgMsbreUgevK-p7Fy18q9'});
			user.companies.push({code: 'bzbg-uSoqAhjC-I2NC-hAAy4Nsu'});
			//yield user.save();


			yield req.app.systemdb.users.model.update({code: 'ku1ONe4N-pkqSPgMsbreUgevK-p7Fy18q9'}, {
				companies: user.companies
			})*/

			return {}
		}).then(data=>{
			res.send('BUILD SUCCESS');
		}).catch(err=>{
			console.log(err);
			res.status(500).send('ERROR ON BUILD' + err);
		});
	}



	home(req, res) {
		res.send(Render.view('home'));
	}

	login(req, res) {
		res.send(Render.view('signup')); //signup contain login form
	}

	about(req, res) {
		res.send(Render.view('about'));
	}

	account(req, res) {
		res.send(Render.view('account'));
	}
}

module.exports = Root;
