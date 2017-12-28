
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

class WarehouseEntrySchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: WarehouseEntrySchema.generateCode },
			transactionsTypeName: { type: String, required: true },
			description: { type: String, required: true, unique: true },
			entryDate: { type: String, required: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(8) + '-' + gen(8) + '-' + gen(8) + '-' + gen(8);
	}
}

module.exports = class WarehouseEntryModel {
	constructor(db) {
		this.db = db;
		this.schema = new WarehouseEntrySchema();
		this.model = db.connection.model('WarehouseEntry', this.schema);
	}

	getSchemaColumns() {
		return [
			{ name: 'code', text: 'Código', visible: false },
			{ name: 'transactionsTypeName', text: 'Concepto', visible: true },
			{ name: 'description', text: 'Descripción', visible: true },
			{ name: 'entryDate', text: 'Fecha de entrada', visible: true },
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
			let entries = yield Transaction.execTimeout(4000, ()=>{
				let sel = select || 'code transactionsTypeName description entryDate creationDate modifiedDate';
				return self.model.find(where, sel);
			});

			return entries;
		});
	}

	findOne(where, select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code transactionsTypeName description entryDate creationDate modifiedDate';
			return this.model.findOne(where, sel);
		}, lastly);
	}
}
