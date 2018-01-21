
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

class ArticleSchema extends mongoose.Schema {
	constructor() {
		let imageSchema = new mongoose.Schema({
			code: { type: String, ref: 'Image', required: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		let dataSheetSchema = new mongoose.Schema({
			code: { type: String, required: true },
			data: { type: Buffer, required: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		let customFieldSchema = new mongoose.Schema({
			name: { type: String, required: true },
			value: { type: String, required: true },
		});

		super({
			code: { type: String, required: true, unique: true, default: ArticleSchema.generateCode },
			clientCode: { type: String, required: true, unique: true },
			barCode: { type: String, required: true, unique: true },
			name: { type: String, required: true, unique: true },
			description: { type: String, required: true },
			brand: { type: String, required: true },
			category: { type: String, required: true },
			images: [imageSchema],
			dataSheets: [dataSheetSchema],
			customFields: [customFieldSchema],
			prices: { type: Array },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(16) + '-' + gen(8) + '-' + gen(4) + '-' + gen(8) + '-' + gen(4) + '-' + gen(4);
	}

	static generateImageCode() {
		let gen = randomstring.generate;
		return gen(32) + '-' + gen(32);
	}

	static generateDataSheetCode() {
		let gen = randomstring.generate;
		return gen(32) + '-' + gen(32);
	}
}

module.exports = class ArticleModel {
	constructor(db) {
		this.db = db;
		this.schema = new ArticleSchema();
		this.model = db.connection.model('Article', this.schema);
	}

	getSchemaColumns() {
		return [
			{ name: 'code', text: '', visible: false },
			{ name: 'clientCode', text: 'Código', visible: true },
			{ name: 'name', text: 'Nombre', visible: true },
			{ name: 'brand', text: 'Marca', visible: true },
			{ name: 'category', text: 'Categoria', visible: true },
			{ name: 'creationDate', text: 'Fecha de creación', visible: true },
			{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
		];
	}

	findAll(lastly) {
		return Transaction.execTimeout(4000, ()=>{
			return this.model.find({}, 'code clientCode name brand category creationDate modifiedDate');
		}, lastly);
	}

	findOne(query, select) {
		let self = this;
		return co(function*(){
			let article = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code clientCode barCode name brand category description images customFields prices creationDate modifiedDate'
				return self.model.findOne(query, sel);
			});

			if(article.images){
				let promises = article.images.map(img=>{
					return self.db.images.findOne({code: img.code}).then(res=>{
						return {
							code: res.code,
							data: res.data
						}
					})
				});
				article.modImages = yield Promise.all(promises);
			}

			return article;
		});
	}

	find(query, select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code clientCode name brand category creationDate modifiedDate'
			return this.model.find(query, sel);
		}, lastly);
	}

	/*findOneWithEncImages(q, enc) {
		var self = this;
		return co(function*(){
			var doc = yield self._model.findOne(q);

			var encImg = doc.images[0] ? yield enc(doc.images[0].buffer) : null;

			var tdoc = {
				_id: doc._id,
				code: doc.code,
				description: doc.description,
				brand: doc.brand,
				category: doc.category,
				images: [encImg],
				customFields: doc.customFields,
				prices: doc.prices,
				creationDate: doc.creationDate,
				modifiedDate: doc.modifiedDate,
			}

			return tdoc;
		});
	}*/

	/*insertOne(user, data) {
		var self = this;
		var syslogModel = this._connection.baseModels.syslog._model;

		return co(function*(){
			var transaction = new Transaction();
			return yield transaction.run(function*(){
				var inserted = yield transaction.insert(self._model, data);

				yield transaction.insert(syslogModel, {
					user: user._id,
					schemaName: 'Article',
					action: 'Insert',
					new: inserted,
				});

				return inserted;
			});
		});
	}*/

	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let brand = yield self.db.articleBrands.findOne({name: data.brand});
			let category = yield self.db.articleCategories.findOne({name: data.category});
			if(!brand){
				yield transaction.insert(self.db.articleBrands.model, {name: data.brand});
			}
			if(!category){
				yield transaction.insert(self.db.articleCategories.model, {name: data.category});
			}
			let inserted = yield transaction.insert(self.model, data);
			return inserted;
		});
	}

	updateOne(where, values) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let brand = yield self.db.articleBrands.findOne({name: values.brand});
			let category = yield self.db.articleCategories.findOne({name: values.category});
			if(!brand){
				yield transaction.insert(self.db.articleBrands.model, {name: values.brand});
			}
			if(!category){
				yield transaction.insert(self.db.articleCategories.model, {name: values.category});
			}

			values.modifiedDate = AppDate.now();
			let updated = yield transaction.update(self.model, where, values);
			return self.findOne(where);
		});
	}

	existencesArticle(req) {
		let self = this;
		return co(function*(){
			let debugWarehouses = {};
			let whs = yield self.db.warehouses.findAll('code clientCode name articles');
			if(whs.length) {
				for(let wh of whs) {
					let fart = wh.articles.find(iart=>{ return iart.code === req.code});
					if(fart) {
						debugWarehouses[wh.code]={
							clientCode: wh.clientCode,
							name: wh.name,
							stock: fart.stock,
						}
					}
				}
			}
			return debugWarehouses;
		});
	}
}
