
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import express from 'express';
import co from 'co';

import Render from '../views/render';

/****************************************************************************************/

class AppCompany {
	constructor() {
		this.router = express.Router();

		this.router.get('/', this.home.bind(this));
		this.router.get('/adm', this.admHome.bind(this));
		this.router.get('/adm/inventarios', this.inventory.bind(this));

		this.router.get('/adm/inventarios/articulos', this.inventory.bind(this));
		this.router.get('/adm/inventarios/articulos/ver/:article', this.inventory.bind(this));
		this.router.get('/adm/inventarios/articulos/insertar/:article?', this.inventory.bind(this));
		this.router.get('/adm/inventarios/articulos/editar/:article', this.inventory.bind(this));

		this.router.get('/adm/inventarios/almacenes', this.inventory.bind(this));
		this.router.get('/adm/inventarios/almacenes/ver/:warehouse', this.inventory.bind(this));
		this.router.get('/adm/inventarios/almacenes/insertar/:warehouse?', this.inventory.bind(this));
		this.router.get('/adm/inventarios/almacenes/editar/:warehouse?', this.inventory.bind(this));

		this.router.get('/adm/inventarios/almacenes-entradas', this.inventory.bind(this));
		this.router.get('/adm/inventarios/almacenes-entradas/ver/:entry', this.inventory.bind(this));
		this.router.get('/adm/inventarios/almacenes-entradas/insertar/:entry?', this.inventory.bind(this));

		this.router.get('/adm/inventarios/almacenes-salidas', this.inventory.bind(this));
		this.router.get('/adm/inventarios/almacenes-salidas/ver/:entry', this.inventory.bind(this));
		this.router.get('/adm/inventarios/almacenes-salidas/insertar/:entry?', this.inventory.bind(this));

		this.router.get('/adm/inventarios/proveedores', this.inventory.bind(this));
		this.router.get('/adm/inventarios/proveedores/ver/:provider', this.inventory.bind(this));
		this.router.get('/adm/inventarios/proveedores/insertar/:provider?', this.inventory.bind(this));
		this.router.get('/adm/inventarios/proveedores/editar/:provider', this.inventory.bind(this));

		this.router.get('/adm/inventarios/compras', this.inventory.bind(this));
		this.router.get('/adm/inventarios/compras/ver/:purchase', this.inventory.bind(this));
		this.router.get('/adm/inventarios/compras/insertar/:purchase?', this.inventory.bind(this));
		this.router.get('/adm/inventarios/compras/cambiar-estado/:purchase', this.inventory.bind(this));
		this.router.get('/adm/inventarios/compras/reporte-fechas/:report', this.inventory.bind(this));

		this.router.get('/adm/inventarios/transferencias', this.inventory.bind(this));
		this.router.get('/adm/inventarios/transferencias/ver/:transfer', this.inventory.bind(this));
		this.router.get('/adm/inventarios/transferencias/insertar/:transfer?', this.inventory.bind(this));
		this.router.get('/adm/inventarios/transferencias/cambiar-estado/:transfer', this.inventory.bind(this));
		this.router.get('/adm/inventarios/transferencias/reporte-fechas/:report', this.inventory.bind(this));

		this.router.use(this.notFound.bind(this));
	}

	/************************************************************************************/
	/************************************************************************************/

	companies(req, res) {
		res.send('LISTA DE EMPRESAS');
	}

	home(req, res) {
		res.send(Render.view('tabletec'));
	}

	admHome(req, res) {
		res.send(Render.view('adm-home'));
	}

	inventory(req, res) {
		res.send(Render.view('inventory'));
	}

	notFound(req, res) {
		//res.send('notFound for ' + req.companyParams.identifier + ' company');
		res.status(404).send(Render.view('error'));
	}

	/************************************************************************************/
	/************************************************************************************/

	find(req, res, next) {
		if(req.params.company){
			co(function*(){
				let company = yield req.app.systemdb.companies.findOne({uniqueName: req.params.company});
				let db = yield req.app.dbConnection(company.sysname);//if company is null or not defined then this fail
				return {company, db};
			}).then(result=>{
				req.company = result.company;
				req.app.db = result.db;
				next();
			}).catch(err=>{
				next();
			});
		}else{
			next();
		}
	}

	validate(req, res, next) {
		if(req.company){
			if(req.company.status === 'active'){
				next();
			}else{
				res.status(406).send(req.company.name + ' are ' + req.company.status);
			}
		}else{
			res.status(404).send('NO COMPANY FOUND');
		}
	}

}

module.exports = AppCompany;
