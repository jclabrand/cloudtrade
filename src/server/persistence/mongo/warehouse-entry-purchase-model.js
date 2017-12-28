
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import mongoose from 'mongoose';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class WarehouseEntryPurchaseSchema extends mongoose.Schema {
	constructor() {
		let articleSchema = new mongoose.Schema({
			code: { type: String, ref: 'Article', required: true },
			warehouseCode: { type: String, ref: 'Warehouse', required: true },
			quantity: { type: Number, min: 0, required: true },
			remark: { type: String }
		});

		let transactionSchema = new mongoose.Schema({
			code: { type: String, ref: 'Purchase', required: true },
			articles: [articleSchema]
		});

		super({
			code: { type: String, required: true, unique: true, ref: 'WarehouseEntry' },
			transactions: [transactionSchema],
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		transactionSchema.path('articles').validate(function(value) {
			return value.length;
		},"El campo 'articles' no puede ser un array vacío");
		
		this.path('transactions').validate(function(value) {
			return value.length;
		},"El campo 'transactions' no puede ser un array vacío");
	}
}

module.exports = class WarehouseEntryPurchaseModel {
	constructor(db) {
		this.db = db;
		this.schema = new WarehouseEntryPurchaseSchema();
		this.model = db.connection.model('WarehouseEntryPurchase', this.schema);
	}

	/*findIntoTransactions(where, select) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code transactions creationDate modifiedDate';
			return this.model.find({'transactions': {$elemMatch: where}}, sel);
		});
	}*/


	/*getSchemaColumns() {
		return [
			{ name: 'code', text: 'Código', visible: false },
			{ name: 'description', text: 'Descripción', visible: true },
			{ name: 'warehouseName', text: 'Nombre del almacén', visible: true },// must search
			{ name: 'entryDate', text: 'Fecha de entrada', visible: true },
			{ name: 'creationDate', text: 'Fecha de creación', visible: true },
			{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
		];
	}*/

	findAll(select) {
		let self = this;
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code transactions creationDate modifiedDate';
			return self.model.find({}, sel);
		});
	}

	findOne(where, select) {
		let self = this;
		return co(function*(){
			/*let entry = yield Transaction.execTimeout(4000, ()=>{
				let _select_ = select || 'code description entryDate transactions warehouseCode creationDate modifiedDate';
				return self.model.findOne(where, _select_);
			});

			let warehouse = yield self.db.warehouses.findOne({code: entry.warehouseCode});
			entry.warehouseName = warehouse.name;

			let promises = entry.transactions.map(tran=>{
				return self.db.purchases.findOne({code: tran.code}).then(res=>{
					return {
						code: res.code,
						business: res.business,
						promises: tran.articles.map(art=>{
							return self.db.articles.findOne({code: art.code}).then(ares=>{
								return {
									code: ares.code,
									name: ares.name,
									quantity: art.quantity,
									remark: art.remark
								}
							});
						})
					}
				});
			});

			let tempTransactions = yield Promise.all(promises);

			for (let tran of tempTransactions) {
				tran.articles = yield Promise.all(tran.promises);
			}

			entry.modTransactions = tempTransactions.map(tran=>{
				return {
					code: tran.code,
					business: tran.business,
					articles: tran.articles,
					transactionsTypeName: 'purchases'
				}
			});*/

			let entry = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code transactions creationDate modifiedDate';
				return self.model.findOne(where, sel);
			});

			if(entry.transactions){
				entry.modTransactions = [];

				for(let tran of entry.transactions) {
					let purchase = yield self.db.purchases.findOne({code: tran.code}, 'code business');
					if(!purchase){ throw 'Referencia a compra perdida'; }

					let articlePromises = tran.articles.map(art=>{
						return co(function*(){
							let warehouse = yield self.db.warehouses.findOne({code: art.warehouseCode}, 'code name');
							if(!warehouse){ throw 'Referencia a almacén perdida'; }

							let article = yield self.db.articles.findOne({code: art.code}, 'code name');

							return {
								code: article.code,
								name: article.name,
								quantity: art.quantity,
								warehouseCode: art.warehouseCode,
								warehouseName: warehouse.name,
								remark: art.remark
							}
						});
					});

					entry.modTransactions.push({
						code: purchase.code,
						business: purchase.business,
						articles: yield Promise.all(articlePromises)
					});
				}
			}

			return entry;
		});
	}

	/**
	 * 		{
	 * 			description: String,
	 * 			entryDate: String,
	 * 			warehouseCode: String,
	 * 			transactions: [
	 * 				{
	 * 					code: String:
	 * 					articles: [
	 * 						{
	 * 							code: String,
	 * 							quantity: Number,
	 * 							remark: String,
	 * 						}
	 * 					]
	 * 				}
	 * 			]
	 * 		}
	 */

	/**
	 * 
	 * @param {*} data = {
	 * 		description: String,
	 * 		transaction: {
	 * 			type: String,
	 * 			name: String
	 * 		}
	 * 		entryDate: String,
	 * 		warehouseCode: String,
	 * 		articles: [
	 * 			{
	 * 				code: String,
	 * 				quantity: Number,
	 * 				remark: String,
	 * 			},
	 * 			.
	 * 			.
	 * 			.
	 * 		]
	 * }
	 */
	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let insertedEntry = yield transaction.insert(self.db.warehouseEntries.model, data);
			data.code = insertedEntry.code;
			let inserted = yield transaction.insert(self.model, data);

			for(let tran of data.transactions) {
				/**
				 * add articles into stock
				 */
				for(let trArticle of tran.articles) {
					let warehouse = yield self.db.warehouses.findOne({code: trArticle.warehouseCode}, 'code articles');
					if(!warehouse){ throw 'Referencia a almacén perdida'; }

					let whArticle = warehouse.articles.find(whArticle=>{ return whArticle.code === trArticle.code });
					if(whArticle){
						whArticle.stock = whArticle.stock + trArticle.quantity
					}else{
						warehouse.articles.push({code: trArticle.code, stock: trArticle.quantity})
					}
					yield transaction.update(self.db.warehouses.model, {code: trArticle.warehouseCode}, {
						articles: warehouse.articles,
						modifiedDate: AppDate.now()
					});
				}
				/**
				 * Update purchase transactions to joined
				 */
				yield transaction.update(self.db.purchases.model, {code: tran.code}, {
					status: tran.status || 'joined',
					modifiedDate: AppDate.now()
				});
			}

			return inserted;
		});
	}
}
