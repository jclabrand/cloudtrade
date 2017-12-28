
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';
import passport from 'passport';

/****************************************************************************************/

class Providers {
	constructor() {
		this.router = express.Router();

		this.router.get('/listar', this.findAll.bind(this));

		this.router.get('/listar-ciudades', this.findAllCities.bind(this));

		this.router.get('/ver/:provider', this.findOne.bind(this));
		this.router.post('/insertar', this.insertOnePOST.bind(this));
		this.router.put('/editar', this.updateOnePUT.bind(this));
	}

	findAll(req, res) {
		req.app.db.providers.findAll().then(rows=>{
			res.status(200).json({
				providers: {
					columns: req.app.db.providers.getSchemaColumns(),
					rows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findOne(req, res) {
		req.app.db.providers.findOne({code: req.params.provider}).then(provider=>{
			res.status(200).json({provider});
		}).catch(err=>{
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

	insertOnePOST(req, res) {
		co(function*(){
			return yield req.app.db.providers.insertOne(req.body);
		}).then(provider=>{
			res.json({provider});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	updateOnePUT(req, res) {
		co(function*(){
			return yield req.app.db.providers.updateOne({code: req.body.code}, {
				nit: req.body.name,
				name: req.body.nit,
				phone: req.body.phone,
				country: req.body.country,
				city: req.body.city,
				description: req.body.description,
				email: req.body.email,
				address: req.body.address,
			});
		}).then((provider)=>{
			res.json({provider});
		}).catch((err)=>{
			res.sendError(err);
		});
	}
}

module.exports = Providers;
