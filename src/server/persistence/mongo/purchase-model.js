
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

class PurchaseSchema extends mongoose.Schema {
	constructor() {
		let articleSchema = new mongoose.Schema({
			code: {type: String, ref: 'Article', required: true},
			quantity: {type: Number, min: 1, required: true},
			unitPrice: {type: Number, required: true},
			measurement: {type: String, required: true},
			remark: {type: String}
		});

		super({
			code: {type: String, required: true, unique: true, default: PurchaseSchema.generateCode},
			business: {type: String, required: true},
			order: {type: String},
			guideNumber: {type: String, required: true, unique: true},
			status: {type: String, required: true, default: 'created'}, // created, approved, cancelled, delayed, delivered, joined
			providerCode: {type: String, ref: 'Provider', required: true},
			contactName: {type: String},
			payDate: {type: String},
			billingDir: {type: String, required: true},
			billingCountry: {type: String},
			billingDep: {type: String},
			shippingDir: {type: String, required: true},
			shippingCountry: {type: String},
			shippingDep: {type: String},
			shippingProvince: {type: String},
			shippingPostal: {type: String},
			terms: {type: String},
			description: {type: String},
			articles: [articleSchema],
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.path('articles').validate(function(value) {
			return value.length;
		},"El campo 'articles' no puede ser un array vacío");

		this.methods.addField = this.addField;
	}

	addField(name, value) {
		this[name] = value;
		console.log(this[name]);
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(16) + '-' + gen(16) + '-' + gen(16);
	}
}

module.exports = class PurchaseModel {
	constructor(db) {
		this.db = db;
		this.schema = new PurchaseSchema();
		this.model = db.connection.model('Purchase', this.schema);
	}

	getSchemaColumns() {
		return [
			{ name: 'code', text: 'Código', visible: false },
			{ name: 'guideNumber', text: 'Número de guía', visible: true },
			{ name: 'business', text: 'Asunto', visible: true},
			{ name: 'order', text: 'Referencia del pedido', visible: true },
			{ name: 'status', text: 'Estado', visible: true },

			{ name: 'providerName', text: 'Nombre del proveedor', visible: true },// must be finded from providers model

			{ name: 'contactName', text: 'Nombre de contacto', visible: true },
			{ name: 'payDate', text: 'Fecha de pago', visible: true },
			{ name: 'billingDir', text: 'Derección de facturación', visible: true },
			{ name: 'shippingDir', text: 'Derección de envío', visible: true },
			{ name: 'description', text: 'Descripción', visible: true },
			{ name: 'creationDate', text: 'Fecha de creación', visible: true },
			{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
		];
	}

	findAll() {
		/*let self = this;
		return co(function*(){
			let purchases = yield Transaction.execTimeout(4000, ()=>{
				return self.model.find({},
				'code business order guideNumber status providerCode contactName payDate billingDir shippingDir description creationDate modifiedDate');
			});

			let promises = purchases.map(purchase=>{
				return self.db.providers.findOne({code: purchase.providerCode}, 'name').then(res=>{
					purchase.providerName = res.name;
				});
			});

			yield Promise.all(promises);

			return purchases;
		});*/
		return this.find({});
	}

	find(query, select) {
		let self = this;
		return co(function*(){
			let purchases = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code business order guideNumber status providerCode contactName payDate billingDir shippingDir description creationDate modifiedDate';
				return self.model.find(query, sel);
			});

			let promises = purchases.map(purchase=>{
				return self.db.providers.findOne({code: purchase.providerCode}, 'name').then(res=>{
					purchase.providerName = res.name;
				});
			});

			yield Promise.all(promises);

			return purchases;
		});
	}

	findOne(q, select) {
		let self = this;
		return co(function*(){ 
			let purchase = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code business order guideNumber status providerCode contactName payDate billingDir billingCountry billingDep shippingDir shippingCountry shippingDep shippingProvince shippingPostal terms description articles creationDate modifiedDate';
				return self.model.findOne(q, sel);
			});

			if(!purchase) { throw 'No se ha encontrado la compra'; }

			if(purchase.providerCode){
				let provider = yield self.db.providers.findOne({code: purchase.providerCode}, 'code name');
				purchase.modProvider = {
					code: provider.code,
					name: provider.name
				}
			}

			if(purchase.articles){
				let promises = purchase.articles.map(article=>{
					return self.db.articles.findOne({code: article.code}, 'code name').then(res=>{
						return {
							code: res.code,
							name: res.name,
							quantity: article.quantity,
							unitPrice: article.unitPrice,
							measurement: article.measurement,
							remark: article.remark
						}
					});
				});

				purchase.modArticles = yield Promise.all(promises);
			}

			return purchase;
		});
	}

	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			/*let promises = data.articles.map((article)=>{
				return new Promise((resolve, reject)=>{
					Transaction.execTimeout(4000, ()=>{
						return self.db.articles.model.findOne({code: article.code}, '_id');
					}).then(res=>{
						article.articleRef = res._id;
						resolve(article);
					}).catch(err=>{
						reject(err);
					});
				});
			});

			data.provider = yield Transaction.execTimeout(4000, ()=>{
				return self.db.providers.findOne({code: data.providerCode}, '_id');
			});

			yield Promise.all(promises);*/

			let inserted = yield transaction.insert(self.model, data);
			return inserted;
		});
	}

	updateOneStatus(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let updated = yield transaction.update(self.model, {code: data.code}, {
				status: data.status,
				modifiedDate: AppDate.now()
			});
			return self.findOne({code: data.code});
		});
	}
}
