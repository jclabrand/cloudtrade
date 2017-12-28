
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import express from 'express';
import passport from 'passport';
import co from 'co';

import ApiArticles from'./articles';
import ApiWarehouses from'./warehouses';
import ApiProviders from'./providers';
import ApiPurchases from './purchases';
import ApiTransfers from './transfers';
import ApiWarehousesEntries from './warehouses-entries';
import ApiWarehousesOutlets from './warehouses-outlets';
import ApiReports from './reports';

/****************************************************************************************/

class Company {
	constructor() {
		this.router = express.Router();

		this.router.use(passport.authenticate('jwt', {session: false}));
		this.router.use(this.authorizeUserOnCompany);

		this.router.get('/autenticar', this.authorizeUserOnCompanyGET);

		var apiArticles = new ApiArticles();
		this.router.use('/adm/inventarios/articulos', apiArticles.router);
		var apiWarehouses = new ApiWarehouses();
		this.router.use('/adm/inventarios/almacenes', apiWarehouses.router);
		var apiProviders = new ApiProviders();
		this.router.use('/adm/inventarios/proveedores', apiProviders.router);
		var apiPurchases = new ApiPurchases();
		this.router.use('/adm/inventarios/compras', apiPurchases.router);
		var apiTransfers = new ApiTransfers();
		this.router.use('/adm/inventarios/transferencias', apiTransfers.router);

		var apiWarehousesEntries = new ApiWarehousesEntries();
		this.router.use('/adm/inventarios/almacenes-entradas', apiWarehousesEntries.router);
		var apiWarehousesOutlets = new ApiWarehousesOutlets();
		this.router.use('/adm/inventarios/almacenes-salidas', apiWarehousesOutlets.router);
		var apiReports = new ApiReports();
		this.router.use('/adm/inventarios/reportes', apiReports.router);

		this.router.use(this.notFound.bind(this));
	}

	authorizeUserOnCompanyGET(req, res) {
		res.json({
			user: {
				code: req.user.code,
				name: req.user.name,
				email: req.user.email,
				role: req.user.role
			}
		});
	}

	notFound(req, res) {
		res.sendError({responseStatus: 404, message: 'No se encontró el recurso.'});
	}

	/************************************************************************************/
	/************************************************************************************/

	authorizeUserOnCompany(req, res, next) {
		co(function*(){
			/*let emailRefFound = req.user.emails.find(email=>{
				return email.current;
			});
			let emailFound = yield req.app.systemdb.emails.findOne({code: emailRefFound.code});
			req.user.email = emailFound.email;*/

			let compFound = req.user.companies.find(company=>{ return req.company.code === company.code; });
			let employee = yield req.app.db.staff.findOne({code: req.user.code});
			if(compFound && employee){
				req.user.role = employee.role;
				return req.user;
			}else{
				throw 'Acceso no autorizado';
			}
		}).then(result=>{
			next();
		}).catch(err=>{
			res.sendError(err);
		});
	}


	validate(req, res, next) {
		if(req.company){
			if(req.company.status === 'active'){
				next();
			}else{
				res.sendError({responseStatus: 406, message: 'La empresa <'+ req.company.name +'> tiene estado <' + req.company.status + '>'});
			}
		}else{
			res.sendError({responseStatus: 404, message: 'Se requiere el nombre de una empresa'});
		}
	}
}

module.exports = Company;
