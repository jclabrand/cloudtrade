
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import mongoose from 'mongoose';
import randomstring from 'randomstring';
import validator from 'validator';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class CompanySchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: CompanySchema.generateCode },
			uniqueName: { type: String, required: true, unique: true },
			name: { type: String, required: true },
			sysname: { type: String, required: true, unique: true },
			status: { type: String, required: true, default: 'active' },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.path('uniqueName').validate(function(value) {
			return validator.isAlphanumeric(value, 'es-ES');
		},"El campo 'uniqueName' debe ser alfanumérico");
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(4) + '-' + gen(8) + '-' + gen(4) + '-' + gen(8);
	}
}

module.exports = class CompanyModel {
	constructor(db) {
		this.db = db;
		this.schema = new CompanySchema();
		this.model = db.connection.model('Company', this.schema);
	}
	
	findOne(q, lastly) {
		return Transaction.execTimeout(4000, ()=>{ return this.model.findOne(q); }, lastly);
	}

	/**
	 * 
	 * @param {*} data = {
	 * 		uniqueName: String
	 * 		name: String
	 * }
	 */
	insertOne(data) {
		var self = this;
		var transaction = new Transaction();
		return transaction.run(function*(){
			data.sysname = 'co_' + randomstring.generate({length: 8, charset: 'hex'}) + '_' + data.uniqueName;
			var inserted = yield transaction.insert(self.model, data);

			return inserted;
		});
	}
}
