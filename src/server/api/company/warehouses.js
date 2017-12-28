
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';
import passport from 'passport';

/****************************************************************************************/

class Warehouses {
	constructor() {
		this.router = express.Router();

		this.router.get('/listar', this.findAll.bind(this));

		this.router.get('/listar-ciudades', this.findAllCities.bind(this));
		
		this.router.get('/ver/:warehouse', this.findOne.bind(this));
		this.router.post('/insertar', this.insertOne_POST.bind(this));
		this.router.put('/editar', this.updateOne_PUT.bind(this));

		this.router.get('/ver-articulos/:warehouse', this.findAllArticlesFor_GET.bind(this));
	}

	findAll(req, res) {
		req.app.db.warehouses.findAll().then(rows=>{
			res.status(200).json({
				warehouses: {
					columns: req.app.db.warehouses.getSchemaColumns(),
					rows
				}
			});
		}).catch((err)=>{
			res.sendError(err);
		});
	}

	findOne(req, res) {
		req.app.db.warehouses.findOne({code: req.params.warehouse}).then(warehouse=>{
			res.status(200).json({warehouse});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findAllArticlesFor_GET(req, res) {
		co(function*(){
			let warehouse = yield req.app.db.warehouses.findOne({code: req.params.warehouse}, 'code name articles');
			return yield warehouse.findAllStockOn(req.app.db.articles);
		}).then((stock)=>{
			res.json({articles:{rows: stock}});
		}).catch((err)=>{
			res.sendError(err);
		});
	}

	findAllCities(req, res) {
		req.app.db.cities.findAll().then(cities=>{
			res.status(200).json({cities});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	insertOne_POST(req, res) {
		co(function*(){
			return yield req.app.db.warehouses.insertOne(req.body);
		}).then(warehouse=>{
			res.json({warehouse});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	updateOne_PUT(req, res) {
		co(function*(){
			return yield req.app.db.warehouses.updateOne({code: req.body.code}, {
				clientCode: req.body.clientCode,
				name: req.body.name,
				type: req.body.type,
				country: req.body.country,
				city: req.body.city,
				address: req.body.address,
				phone: req.body.phone,
				postcode: req.body.postcode,
			});
		}).then((warehouse)=>{
			res.json(warehouse);
		}).catch((err)=>{
			res.sendError(err);
		});
	}
}

module.exports = Warehouses;
