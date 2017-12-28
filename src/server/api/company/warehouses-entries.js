
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';
import passport from 'passport';

//import faker from 'faker';

/****************************************************************************************/

class WarehousesEntries {
	constructor() {
		this.router = express.Router();

		this.router.get('/listar', this.findAll.bind(this));
		this.router.get('/ver/:entry', this.findOne.bind(this));
		this.router.post('/insertar', this.insertOnePOST.bind(this));
		/*this.router.post('/api/editar', passport.authenticate('jwt', {session: false}), this.updateOnePOST.bind(this));*/
	}

	findAll(req, res) {
	/*
		let columns = [
				{ name: 'name', text: 'Nombre', visible: true },
				{ name: 'email', text: 'Dirección', visible: true },
				{ name: 'phone', text: 'Teléfono', visible: true },
				{ name: 'address', text: 'Dirección', visible: true },
				{ name: 'creationDate', text: 'Fecha de creación', visible: true },
				{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
			];

		let rows = []


		for(var i=0; i<1000; i++){
			rows.push({
				name: faker.name.findName(),
				email: faker.internet.email(),
				phone: faker.phone.phoneNumber(),
				address: faker.address.streetAddress(),
				creationDate: faker.date.past(),
				modifiedDate: faker.date.recent()
			});
		}

		res.status(200).json({
			entries: {
				columns,
				rows
			}
		});
	*/
		req.app.db.warehouseEntries.findAll().then((rows)=>{
			let prows = rows.map((entry)=>{
				return {
					code: entry.code,
					transactionsTypeName: entry.transactionsTypeName,
					description: entry.description,
					entryDate: entry.entryDate,
					creationDate: entry.creationDate,
					modifiedDate: entry.modifiedDate
				}
			});

			res.status(200).json({
				entries: {
					columns: req.app.db.warehouseEntries.getSchemaColumns(),
					rows: prows
				}
			});
		}).catch((err)=>{
			res.sendError(err);
		});
	}

	findOne(req, res) {
		co(function*(){
			let baseEntry = yield req.app.db.warehouseEntries.findOne({code: req.params.entry}),
				entry;
			switch(baseEntry.transactionsTypeName){
				case 'purchases':
					entry = yield req.app.db.warehouseEntryPurchases.findOne({code: req.params.entry});
					break;
				case 'transfers':
					entry = yield req.app.db.warehouseEntryTransfers.findOne({code: req.params.entry});
					break;
				default:
					throw 'No se reconoce el tipo de transacción';
			}
			return {
				code: entry.code,
				transactionsTypeName: baseEntry.transactionsTypeName,
				description: baseEntry.description,
				entryDate: baseEntry.entryDate,
				transactions: entry.modTransactions,
				creationDate: entry.creationDate,
				modifiedDate: entry.modifiedDate
			};
		}).then(entry=>{
			res.json({entry});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	insertOnePOST(req, res) {
		co(function*(){
			switch(req.body.transactionsTypeName){
				case 'purchases':
					return yield req.app.db.warehouseEntryPurchases.insertOne(req.body);
				case 'transfers':
					return yield req.app.db.warehouseEntryTransfers.insertOne(req.body);
				case 'custom':
					break;
					
				default:
					throw 'No se reconoce el tipo de transacción';
			}
		}).then((entry)=>{
			res.json(entry);
		}).catch((err)=>{
			res.sendError(err);
		});

		/*console.log(req.body);
		res.json({entry: req.body});*/
	}
}

module.exports = WarehousesEntries;
