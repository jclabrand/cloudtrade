
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

class WarehouseOutletSchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: WarehouseOutletSchema.generateCode },
			transactionsTypeName: { type: String, required: true },
			description: { type: String, required: true, unique: true },
			outletDate: { type: String, required: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(8) + '-' + gen(8) + '-' + gen(8) + '-' + gen(8);
	}
}

module.exports = class WarehouseOutletModel {
	constructor(db) {
		this.db = db;
		this.schema = new WarehouseOutletSchema();
		this.model = db.connection.model('WarehouseOutlet', this.schema);
	}

	getSchemaColumns() {
		return [
			{ name: 'code', text: 'Código', visible: false },
			{ name: 'transactionsTypeName', text: 'Concepto', visible: true },
			{ name: 'description', text: 'Descripción', visible: true },
			{ name: 'outletDate', text: 'Fecha de salida', visible: true },
			{ name: 'creationDate', text: 'Fecha de creación', visible: true },
			{ name: 'modifiedDate', text: 'Fecha de modificación', visible: true }
		];
	}

	findAll() {
		return this.find({});
	}

	find(where, select) {
		let self = this;
		return co(function*(){
			let outlets = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code transactionsTypeName description outletDate creationDate modifiedDate';
				return self.model.find(where, sel);
			});

			return outlets;
		});
	}

	findOne(query, select) {
		let self = this;
		return co(function*(){
			let outlet = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code transactionsTypeName description outletDate creationDate modifiedDate';
				return self.model.findOne(query, sel);
			});
			return outlet;
		});
	}
}
