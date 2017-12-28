
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import mongoose from 'mongoose';
import randomstring from 'randomstring';

import Transaction from './transaction';

import AppDate from '../../common/date';

/****************************************************************************************/

class ImageSchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: ImageSchema.generateCode },
			data: { type: Buffer, required: true },
			mimetype: { type: String, required: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(32) + '-' + gen(8) + '-' + gen(32);
	}
}

module.exports = class ImageModel {
	constructor(db) {
		this.db = db;
		this.schema = new ImageSchema();
		this.model = db.connection.model('Image', this.schema);
	}

	findOne(query, select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code data type creationDate modifiedDate'
			return this.model.findOne(query, sel);
		}, lastly);
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
