
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

class WarehouseSchema extends mongoose.Schema {
	constructor() {
		let articleSchema = new mongoose.Schema({
			code: { type: String, ref: 'Article', required: true },
			stock: { type: Number, min: 0, required: true, default: 0 }
		});

		super({
			code: { type: String, required: true, unique: true, default: WarehouseSchema.generateCode },
			clientCode: { type: String, required: true, unique: true },
			name: { type: String, required: true, unique: true },
			type: { type: String, required: true },
			country: { type: String, required: true },
			city: { type: String, required: true, ref: 'City' },
			address: { type: String, required: true },
			phone: { type: String },
			postcode: { type: String },
			articles: [articleSchema],
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.methods.findAllStockOn = this.findAllStockOn;
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(16) + '-' + gen(16);
	}

	findAllStockOn(articlesModel) {
		let self = this;
		return co(function*(){
			return self.articles ? yield Promise.all(
				self.articles.map((item)=>{
					return articlesModel.findOne({code: item.code}).then(article=>{
						return {
							code: article.code,
							name: article.name,
							brand: article.brand,
							category: article.category,
							stock: item.stock
						};
					});
				})
			) : [];
		});
	}
}

module.exports = class WarehouseModel {
	constructor(db) {
		this.db = db;
		this.schema = new WarehouseSchema();
		this.model = db.connection.model('Warehouse', this.schema);
	}

	getSchemaColumns() {
		return [
				{ name: 'code', text: '', visible: false },
				{ name: 'clientCode', text: 'Código', visible: true },
				{ name: 'name', text: 'Nombre', visible: true },
				{ name: 'type', text: 'Tipo', visible: true },
				{ name: 'country', text: 'País', visible: true },
				{ name: 'city', text: 'Ciudad', visible: true },
				{ name: 'address', text: 'Dirección', visible: true },
				{ name: 'phone', text: 'Teléfono', visible: true },
				{ name: 'postcode', text: 'Código postal', visible: true },
				{ name: 'creationDate', text: 'Fecha de creación', visible: true },
				{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
			];
	}

	findAll(select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code clientCode name type country city address phone postcode creationDate modifiedDate';
			return this.model.find({}, sel);
		}, lastly);
	}

	findOne(where, select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code clientCode name type country city address phone postcode articles creationDate modifiedDate';
			return this.model.findOne(where, sel);
		}, lastly);
	}

	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let city = yield self.db.cities.findOne({name: data.city});
			if(!city){
				yield transaction.insert(self.db.cities.model, {name: data.city});
			}
			let inserted = yield transaction.insert(self.model, data);
			return inserted;
		});
	}

	updateOne(where, values) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let city = yield self.db.cities.findOne({name: values.city});
			if(!city){
				yield transaction.insert(self.db.cities.model, {name: values.city});
			}

			values.modifiedDate = AppDate.now();
			let updated = yield transaction.update(self.model, where, values);
			return self.findOne(where);
		});
	}
}
