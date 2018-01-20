
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import mongoose from 'mongoose';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class WarehouseEntryCustomSchema extends mongoose.Schema {
	constructor() {
		let articleSchema = new mongoose.Schema({
			code: { type: String, ref: 'Article', required: true },
			warehouseCode: { type: String, ref: 'Warehouse', required: true },
			quantity: { type: Number, min: 0, required: true },
			remark: { type: String }
		});

		super({
			code: { type: String, required: true, unique: true, ref: 'WarehouseEntry' },
			articles: [articleSchema],
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.path('articles').validate(function(value) {
			return value.length;
		},"El campo 'articles' no puede ser un array vacío");
	}
}

module.exports = class WarehouseEntryCustomModel {
	constructor(db) {
		this.db = db;
		this.schema = new WarehouseEntryCustomSchema();
		this.model = db.connection.model('WarehouseEntryCustom', this.schema);
	}

	findAll(select) {
		let self = this;
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code articles creationDate modifiedDate';
			return self.model.find({}, sel);
		});
	}

	findOne(where, select, baseEntry) {
		let self = this;
		return co(function*(){
			let entry = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code articles creationDate modifiedDate';
				return self.model.findOne(where, sel);
			});

			entry.modTransactions = [];
			
			let articlePromises = entry.articles.map(art=>{
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
				code: '',
				business: baseEntry ? baseEntry.description : '',
				articles: yield Promise.all(articlePromises)
			});

			return entry;
		});
	}

	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let insertedEntry = yield transaction.insert(self.db.warehouseEntries.model, data);
			data.code = insertedEntry.code;
			data.articles = data.transactions[0].articles;
			let inserted = yield transaction.insert(self.model, data);

				/**
				 * add articles into stock
				 */
				for(let trArticle of data.articles) {
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

			return inserted;
		});
	}
}
