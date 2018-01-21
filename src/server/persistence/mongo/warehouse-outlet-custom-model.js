
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import mongoose from 'mongoose';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class WarehouseOutletCustomSchema extends mongoose.Schema {
	constructor() {
		let articleSchema = new mongoose.Schema({
			code: { type: String, ref: 'Article', required: true },
			warehouseCode: { type: String, ref: 'Warehouse', required: true },
			quantity: { type: Number, min: 0, required: true },
			remark: { type: String }
		});

		super({
			code: { type: String, required: true, unique: true, ref: 'WarehouseOutlet' },
			articles: [articleSchema],
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.path('articles').validate(function(value) {
			return value.length;
		},"El campo 'articles' no puede ser un array vacío");
	}
}

module.exports = class WarehouseOutletCustomModel {
	constructor(db) {
		this.db = db;
		this.schema = new WarehouseOutletCustomSchema();
		this.model = db.connection.model('WarehouseOutletCustom', this.schema);
	}

	findAll(select) {
		let self = this;
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code articles creationDate modifiedDate';
			return self.model.find({}, sel);
		});
	}

	findOne(where, select, baseOutlet) {
		let self = this;
		return co(function*(){
			let outlet = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code articles creationDate modifiedDate';
				return self.model.findOne(where, sel);
			});

			outlet.modTransactions = [];

			let articlePromises = outlet.articles.map(art=>{
				return co(function*(){
					let warehouse = yield self.db.warehouses.findOne({code: art.warehouseCode}, 'code name');
					if(!warehouse){ throw 'Referencia a almacén perdida'; }

					let article = yield self.db.articles.findOne({code: art.code}, 'code name');

					return {
						code: article.code,
						name: article.name,
						warehouseCode: art.warehouseCode,
						warehouseName: warehouse.name,
						quantity: art.quantity,
						remark: art.remark
					}
				});
			});

			outlet.modTransactions.push({
				code: '',
				business: baseOutlet ? baseOutlet.description : '',
				articles: yield Promise.all(articlePromises)
			});

			return outlet;
		});
	}

	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let insertedOutlet = yield transaction.insert(self.db.warehouseOutlets.model, data);
			data.code = insertedOutlet.code;
			data.articles = data.transactions[0].articles;
			let inserted = yield transaction.insert(self.model, data);

				/**
				 * decrease articles into stock
				 */
				for(let trArticle of data.articles) {
					let warehouse = yield self.db.warehouses.findOne({code: trArticle.warehouseCode}, 'code name articles');
					if(!warehouse){ throw 'Referencia a almacén perdida'; }

					let dbArticle = yield self.db.articles.findOne({code: trArticle.code}, 'code name');
					if(!dbArticle){ throw 'Referencia a artículo perdida'; }

					let whArticle = warehouse.articles.find(whArticle=>{ return whArticle.code === trArticle.code });
					if(whArticle) {
						if(whArticle.stock >= trArticle.quantity) {
							whArticle.stock = whArticle.stock - trArticle.quantity;
						} else {
							throw 'Catidad excedida para el artículo ' + dbArticle.name + ', el stock en almacén es ' + whArticle.stock;
						}
					} else {
						throw 'El almacén ' + warehouse.name + ' no tiene el artículo ' + dbArticle.name + ' en stock';
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
