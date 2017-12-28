
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import mongoose from 'mongoose';
import randomstring from 'randomstring';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class EmployeeSchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true },
			role: { type: String, required: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});
	}
}

module.exports = class EmployeeModel {
	constructor(db) {
		this.db = db;
		this.schema = new EmployeeSchema();
		this.model = db.connection.model('Employee', this.schema);
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
