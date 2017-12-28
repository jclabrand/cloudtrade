
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import mongoose from 'mongoose';
import randomstring from 'randomstring';
import validator from 'validator';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class EmailSchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: EmailSchema.generateCode },
			email: { type: String, required: true, unique: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.path('email').validate(function(value) {
			return validator.isEmail(value);
		},"El campo 'email' no es válido");
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(8) + '-' + gen(8) + '-' + gen(8) + '-' + gen(8);
	}
}

module.exports = class EmailModel {
	constructor(db) {
		this.db = db;
		this.schema = new EmailSchema();
		this.model = db.connection.model('Email', this.schema);
	}

	findOne(q, lastly) {
		return Transaction.execTimeout(4000, ()=>{ return this.model.findOne(q); }, lastly);
	}

	insertOne(data) {
		var self = this;
		var transaction = new Transaction();
		return transaction.run(function*(){
			var inserted = yield transaction.insert(self.model, data);

			return inserted;
		});
	}
}
