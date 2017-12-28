
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';
import passport from 'passport';

/****************************************************************************************/

class Transfers {
	constructor() {
		this.router = express.Router();

		this.router.get('/listar', this.findAll.bind(this));
		this.router.get('/ver/:transfer', this.findOne_GET.bind(this));
		this.router.post('/insertar', this.insertOnePOST.bind(this));
		this.router.put('/cambiar-estado', this.updateOneStatusPUT.bind(this));

		this.router.get('/listar-aprobados', this.findAllApprovedGET.bind(this));
		this.router.get('/listar-retirados', this.findAllWithdrawnGET.bind(this));
		this.router.get('/ver-articulos/:transfer', this.findOneArticlesGET.bind(this));
	}

	findAll(req, res) {
		req.app.db.transfers.findAll().then(rows=>{
			let prows = rows.map(transfer=>{
				return {
					code: transfer.code,
					seq: transfer.seq,
					business: transfer.business,
					status: transfer.status,
					originWarehouseName: transfer.originWarehouseName,
					destinationWarehouseName: transfer.destinationWarehouseName,
					description: transfer.description,
					creationDate: transfer.creationDate,
					modifiedDate: transfer.modifiedDate
				}
			});

			res.status(200).json({
				transfers: {
					columns: req.app.db.transfers.getSchemaColumns(),
					rows: prows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findOne_GET(req, res) {
		req.app.db.transfers.findOne({code: req.params.transfer}).then(data=>{
			res.status(200).json({transfer:{
				code: data.code,
				seq: data.seq,
				business: data.business,
				status: data.status,
				originWarehouse: data.originWarehouse,
				destinationWarehouse: data.destinationWarehouse,
				description: data.description,
				articles: data.modArticles,
				creationDate: data.creationDate,
				modifiedDate: data.modifiedDate
			}});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findAllApprovedGET(req, res) {
		req.app.db.transfers.find({status: 'approved'}).then(rows=>{
			let prows = rows.map(transfer=>{
				return {
					code: transfer.code,
					business: transfer.business,
					status: transfer.status,
					originWarehouseCode: transfer.originWarehouseCode,
					originWarehouseName: transfer.originWarehouseName,
					destinationWarehouseCode: transfer.destinationWarehouseCode,
					destinationWarehouseName: transfer.destinationWarehouseName,
					description: transfer.description,
					creationDate: transfer.creationDate,
					modifiedDate: transfer.modifiedDate
				}
			});

			res.status(200).json({
				transfers: {
					columns: req.app.db.transfers.getSchemaColumns(),
					rows: prows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findAllWithdrawnGET(req, res) {
		req.app.db.transfers.find({status: 'withdrawn'}).then(rows=>{
			let prows = rows.map(transfer=>{
				return {
					code: transfer.code,
					business: transfer.business,
					status: transfer.status,
					originWarehouseCode: transfer.originWarehouseCode,
					originWarehouseName: transfer.originWarehouseName,
					destinationWarehouseCode: transfer.destinationWarehouseCode,
					destinationWarehouseName: transfer.destinationWarehouseName,
					description: transfer.description,
					creationDate: transfer.creationDate,
					modifiedDate: transfer.modifiedDate
				}
			});

			res.status(200).json({
				transfers: {
					columns: req.app.db.transfers.getSchemaColumns(),
					rows: prows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findOneArticlesGET(req, res) {
		req.app.db.transfers.findOne({code: req.params.transfer}).then(data=>{
			res.status(200).json({transferArticles: data.modArticles});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	insertOnePOST(req, res) {
		co(function*(){
			return yield req.app.db.transfers.insertOne(req.body);
		}).then(transfer=>{
			res.json({transfer});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	updateOneStatusPUT(req, res) {
		co(function*(){
			return yield req.app.db.transfers.updateOneStatus(req.body);
		}).then(transfer=>{
			res.json({transfer});
		}).catch(err=>{
			res.sendError(err);
		});
	}
}

module.exports = Transfers;
