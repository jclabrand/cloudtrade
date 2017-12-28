
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

class ProviderSchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: ProviderSchema.generateCode },
			nit: { type: String, required: true, unique: true},
			name: { type: String, required: true },
			phone: { type: String, required: true },
			country: { type: String, required: true },
			city: { type: String, required: true },
			description: { type: String },
			email: { type: String },
			address: { type: String },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(8) + '-' + gen(4) + '-' + gen(8) + '-' + gen(4);
	}
}

module.exports = class ProviderModel {
	constructor(db) {
		this.db = db;
		this.schema = new ProviderSchema();
		this.model = db.connection.model('Providers', this.schema);
	}

	getSchemaColumns() {
		return [
				{ name: 'code', text: '', visible: false },
				{ name: 'nit', text: 'NIT', visible: true },
				{ name: 'name', text: 'Nombre', visible: true },
				{ name: 'country', text: 'País', visible: true },
				{ name: 'city', text: 'Ciudad', visible: true },
				{ name: 'phone', text: 'Teléfono', visible: true },
				{ name: 'email', text: 'Correo electrónico', visible: true },
				{ name: 'address', text: 'Dirección', visible: true },
				{ name: 'description', text: 'Descripción', visible: true },
				{ name: 'creationDate', text: 'Fecha de creación', visible: true },
				{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
			];
	}

	findAll(lastly) {
		return Transaction.execTimeout(4000, ()=>{
			return this.model.find({}, 'code nit name description email address country city phone creationDate modifiedDate');
		}, lastly);
	}

	findOne(query, select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code nit name description email address country city phone creationDate modifiedDate';
			return this.model.findOne(query, sel);
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
