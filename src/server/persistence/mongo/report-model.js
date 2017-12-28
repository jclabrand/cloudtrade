
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import randomstring from 'randomstring';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class ReportSchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: ReportSchema.generateCode },
			name: { type: String, required: true },
			seq: { type: Number, required: true },
			htmlResult: { type: String },
			creationDate: { type: String, default: AppDate.now }
		});
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(4) + '-' + gen(16) + '-' + gen(4);
	}
}

module.exports = class ReportModel {
	constructor(db) {
		this.db = db;
		this.schema = new ReportSchema();
		this.model = db.connection.model('Report', this.schema);
	}

	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let last = yield self.model.findOne().sort({seq: -1}).exec();
			if(last){
				data.seq = last.seq + 1;
			}else{
				data.seq = 1001
			}
			let inserted = yield transaction.insert(self.model, data);
			return inserted;
		});
	}
}