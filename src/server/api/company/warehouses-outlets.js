
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';
import passport from 'passport';

//import faker from 'faker';

/****************************************************************************************/

class WarehousesOutlets {
	constructor() {
		this.router = express.Router();

		this.router.get('/listar', this.findAll.bind(this));
		this.router.get('/ver/:outlet', this.findOne.bind(this));
		this.router.post('/insertar', this.insertOnePOST.bind(this));
	}

	findAll(req, res) {
		req.app.db.warehouseOutlets.findAll().then(rows=>{
			let prows = rows.map(outlet=>{
				return {
					code: outlet.code,
					transactionsTypeName: outlet.transactionsTypeName,
					description: outlet.description,
					outletDate: outlet.outletDate,
					creationDate: outlet.creationDate,
					modifiedDate: outlet.modifiedDate
				}
			});

			res.status(200).json({
				outlets: {
					columns: req.app.db.warehouseOutlets.getSchemaColumns(),
					rows: prows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findOne(req, res) {
		co(function*(){
			let baseOutlet = yield req.app.db.warehouseOutlets.findOne({code: req.params.outlet}),
				outlet;
			switch(baseOutlet.transactionsTypeName){
				case 'transfers':
					outlet = yield req.app.db.warehouseOutletTransfers.findOne({code: req.params.outlet});
					return {
						code: outlet.code,
						transactionsTypeName: baseOutlet.transactionsTypeName,
						description: baseOutlet.description,
						outletDate: baseOutlet.outletDate,
						transactions: outlet.modTransactions,
						creationDate: outlet.creationDate,
						modifiedDate: outlet.modifiedDate
					};

				case 'custom':
					outlet = yield req.app.db.warehouseOutletCustom.findOne({code: req.params.outlet}, null, baseOutlet);
					return {
						code: outlet.code,
						transactionsTypeName: baseOutlet.transactionsTypeName,
						description: baseOutlet.description,
						outletDate: baseOutlet.outletDate,
						transactions: outlet.modTransactions,
						creationDate: outlet.creationDate,
						modifiedDate: outlet.modifiedDate
					};

				default:
					throw 'No se reconoce el tipo de transacción en salida de almacén';
			}
		}).then(outlet=>{
			res.json({outlet});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	insertOnePOST(req, res) {
		co(function*(){
			switch(req.body.transactionsTypeName){
				case 'transfers':
					return yield req.app.db.warehouseOutletTransfers.insertOne(req.body);

				case 'custom':
					return yield req.app.db.warehouseOutletCustom.insertOne(req.body);

				default:
					throw 'No se reconoce el tipo de transacción';
			}
		}).then((entry)=>{
			res.json(entry);
		}).catch((err)=>{
			res.sendError(err);
		});
	}
}

module.exports = WarehousesOutlets;
