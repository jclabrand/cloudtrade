
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import mongoose from 'mongoose';
import randomstring from 'randomstring';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class TransferSchema extends mongoose.Schema {
	constructor() {
		let articleSchema = new mongoose.Schema({
			code: { type: String, ref: 'Article', required: true },
			quantity: { type: Number, min: 1, required: true },
			unitPrice: { type: Number, required: true },
			remark: { type: String }
		});

		super({
			code: { type: String, required: true, unique: true, default: TransferSchema.generateCode },
			seq: { type: Number, required: true, unique: true },
			business: { type: String, required: true },
			status: { type: String, required: true, default: 'created' }, // created, approved, cancelled, delayed, withdrawn, joined
			originWarehouseCode: { type: String, ref: 'Warehouse', required: true },
			destinationWarehouseCode: { type: String, ref: 'Warehouse', required: true },
			description: { type: String },
			articles: [articleSchema],
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.path('articles').validate(function(value) {
			return value.length;
		},"El campo 'articles' no puede ser un array vacío");
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(16) + '-' + gen(32);
	}
}

module.exports = class TransferModel {
	constructor(db) {
		this.db = db;
		this.schema = new TransferSchema();
		this.model = db.connection.model('Transfer', this.schema);
	}

	getSchemaColumns() {
		return [
			{ name: 'code', text: 'code', visible: false },
			{ name: 'seq', text: 'Número', visible: true },
			{ name: 'business', text: 'Asunto', visible: true},
			{ name: 'status', text: 'Estado', visible: true },

			{ name: 'originWarehouseName', text: 'Almacén origen', visible: true },
			{ name: 'destinationWarehouseName', text: 'Almacén destino', visible: true },

			{ name: 'description', text: 'Descripción', visible: true },
			{ name: 'creationDate', text: 'Fecha de creación', visible: true },
			{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
		];
	}

	findAllPlane(select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code seq business status description creationDate';
			return this.model.find({}, sel);
		}, lastly);
	}

	findAll() {
		/*let self = this;
		return co(function*(){
			let transfers = yield Transaction.execTimeout(4000, ()=>{
				return self.model.find({},
				'code business status originWarehouseCode destinationWarehouseCode description creationDate modifiedDate');
			});

			let promises0 = transfers.map(transfer=>{
				return self.db.warehouses.model.findOne({code: transfer.originWarehouseCode}).then(res=>{
					transfer.originWarehouseName = res.name;
				});
			});

			let promises1 = transfers.map(transfer=>{
				return self.db.warehouses.model.findOne({code: transfer.destinationWarehouseCode}).then(res=>{
					transfer.destinationWarehouseName = res.name;
				});
			});

			yield Promise.all(promises0);
			yield Promise.all(promises1);

			return transfers;
		});*/
		return this.find({});
	}

	findOne(q, select) {
		let self = this;
		return co(function*(){
			let transfer = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code seq business status originWarehouseCode destinationWarehouseCode description articles creationDate modifiedDate';
				return self.model.findOne(q, sel);
			});

			if(!transfer) { throw 'No se ha encontrado la transferencia';}

			if(transfer.originWarehouseCode){
				let originWarehouse = yield self.db.warehouses.model.findOne({code: transfer.originWarehouseCode});
				transfer.originWarehouse = {
					code: originWarehouse.code,
					name: originWarehouse.name
				}
			}
			if(transfer.destinationWarehouseCode){
				let destinationWarehouse = yield self.db.warehouses.model.findOne({code: transfer.destinationWarehouseCode});
				transfer.destinationWarehouse = {
					code: destinationWarehouse.code,
					name: destinationWarehouse.name
				}
			}
			if(transfer.articles){
				let promises = transfer.articles.map(article=>{
					return self.db.articles.model.findOne({code: article.code}, 'code name brand').then(res=>{
						return {
							code: res.code,
							name: res.name,
							brand: res.brand,
							quantity: article.quantity,
							unitPrice: article.unitPrice,
							remark: article.remark
						}
					});
				});
				transfer.modArticles = yield Promise.all(promises);
			}

			return transfer;
		});
	}

	find(query, select) {
		let self = this;
		return co(function*(){
			let transfers = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code seq business status originWarehouseCode destinationWarehouseCode description creationDate modifiedDate';
				return self.model.find(query, sel);
			});

			let promises0 = transfers.map(transfer=>{
				return self.db.warehouses.model.findOne({code: transfer.originWarehouseCode}).then(res=>{
					transfer.originWarehouseName = res.name;
				});
			});

			let promises1 = transfers.map(transfer=>{
				return self.db.warehouses.model.findOne({code: transfer.destinationWarehouseCode}).then(res=>{
					transfer.destinationWarehouseName = res.name;
				});
			});

			yield Promise.all(promises0);
			yield Promise.all(promises1);

			return transfers;
		});
	}

	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let last = yield self.model.findOne().sort({seq: -1}).exec();
			if(last){ data.seq = last.seq + 1;
			}else{ data.seq = 1001; }

			let inserted = yield transaction.insert(self.model, data);
			return inserted;
		});
	}

	updateOneStatus(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let transfer = yield self.findOne({code: data.code});
			if((transfer.status === "withdrawn") && (data.status !== "delayed")) {
				let entryData = {
					transactionsTypeName :"transfers",
					description :"Por cancelación de transferencia",
					entryDate : AppDate.now(),
					transactions :[
						{ 
							code: transfer.code,
							articles: transfer.articles.map(art=>{
								return {
									warehouseCode: transfer.originWarehouseCode,
									code: art.code,
									quantity: art.quantity,
									remark: "Por Cancelación"
								}
							})
						}
					],

				}
				let insertedEntry = yield self.db.warehouseEntryTransfers.insertOne(entryData);	
			}
			let updated = yield transaction.update(self.model, {code: data.code}, {
				status: data.status,
				modifiedDate: AppDate.now()
			});
			return yield self.findOne({code: data.code});
		});
	}
}
