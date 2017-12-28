
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';
import passport from 'passport';

/****************************************************************************************/

class Purchases {
	constructor() {
		this.router = express.Router();

		this.router.get('/listar', this.findAll.bind(this));
		this.router.get('/ver/:purchase', this.findOne.bind(this));
		this.router.post('/insertar', this.insertOnePOST.bind(this));
		this.router.put('/cambiar-estado', this.updateOneStatusPUT.bind(this));
	
		this.router.get('/listar-entregados', this.findAllDeliveredGET.bind(this));
		this.router.get('/ver-articulos/:purchase', this.findOneArticlesGET.bind(this));
	}

	findAll(req, res) {
		req.app.db.purchases.findAll().then(rows=>{
			let prows = rows.map(purchase=>{
				return {
					code: purchase.code,
					business: purchase.business,
					order: purchase.order,
					guideNumber: purchase.guideNumber,
					status: purchase.status,
					providerName: purchase.providerName,
					contactName: purchase.contactName,
					payDate: purchase.payDate,
					billingDir: purchase.billingDir,
					shippingDir: purchase.shippingDir,
					description: purchase.description,
					creationDate: purchase.creationDate,
					modifiedDate: purchase.modifiedDate
				}
			});

			res.status(200).json({
				purchases: {
					columns: req.app.db.purchases.getSchemaColumns(),
					rows: prows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findOne(req, res) {
		req.app.db.purchases.findOne({code: req.params.purchase}).then(data=>{
			let purchase = {
				code: data.code,
				business: data.business,
				order: data.order,
				guideNumber: data.guideNumber,
				status: data.status,
				provider: data.modProvider,
				contactName: data.contactName,
				payDate: data.payDate,
				billingDir: data.billingDir,
				shippingDir: data.shippingDir,
				terms: data.terms,
				description: data.description,
				articles: data.modArticles,
				creationDate: data.creationDate,
				modifiedDate: data.modifiedDate
			};
			
			res.status(200).json({purchase});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findAllDeliveredGET(req, res) {
		req.app.db.purchases.find({status: 'delivered'}).then(rows=>{
			let prows = rows.map(purchase=>{
				return {
					code: purchase.code,
					business: purchase.business,
					order: purchase.order,
					guideNumber: purchase.guideNumber,
					status: purchase.status,
					providerName: purchase.providerName,
					contactName: purchase.contactName,
					payDate: purchase.payDate,
					billingDir: purchase.billingDir,
					shippingDir: purchase.shippDir,
					description: purchase.description,
					creationDate: purchase.creationDate,
					modifiedDate: purchase.modifiedDate
				}
			});

			res.status(200).json({
				purchases: {
					columns: req.app.db.purchases.getSchemaColumns(),
					rows: prows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findOneArticlesGET(req, res) {
		req.app.db.purchases.findOne({code: req.params.purchase}).then(data=>{
			res.status(200).json({purchaseArticles: data.modArticles});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	insertOnePOST(req, res) {
		co(function*(){
			return yield req.app.db.purchases.insertOne(req.body);
		}).then(purchase=>{
			res.json({purchase});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	updateOneStatusPUT(req, res) {
		co(function*(){
			return yield req.app.db.purchases.updateOneStatus(req.body);
		}).then(purchase=>{
			res.json({purchase});
		}).catch(err=>{
			res.sendError(err);
		});
	}
}

module.exports = Purchases;
