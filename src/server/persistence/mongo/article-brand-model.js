
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

class ArticleBrandSchema extends mongoose.Schema {
	constructor() {
		super({
			code: { type: String, required: true, unique: true, default: ArticleBrandSchema.generateCode },
			name: { type: String, required: true, unique: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(8) + '-' + gen(4) + '-' + gen(4) + '-' + gen(8);
	}
}

module.exports = class ArticleBrandModel {
	constructor(db) {
		this.db = db;
		this.schema = new ArticleBrandSchema();
		this.model = db.connection.model('ArticleBrand', this.schema);
	}

	findAll(lastly) {
		return Transaction.execTimeout(4000, ()=>{
			return this.model.find({}, 'code name creationDate modifiedDate');
		}, lastly);
	}

	findOne(query, select, lastly) {
		return Transaction.execTimeout(4000, ()=>{
			let sel = select || 'code name creationDate modifiedDate'
			return this.model.findOne(query, sel);
		}, lastly);
	}

	insertOne(data) {
	}
}
