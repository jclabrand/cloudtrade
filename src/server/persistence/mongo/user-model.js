
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import mongoose from 'mongoose';
import crypto from 'crypto';
import randomstring from 'randomstring';

import Transaction from './transaction';

import AppDate from '../../common/date';


var cryptAlgorithm = 'aes-256-ctr',
    cryptPassword = '79IHEKr3Yq5PNMU1w095t1poNb66xAk5-08skXdhVGJPll9YKEShewJM1wjWG52hp-mKEmSOBVA0fc5yNCeS0AoE4idDAxhHvH';

/****************************************************************************************/

class UserSchema extends mongoose.Schema {
	constructor() {
		let emailSchema = new mongoose.Schema({
			code: { type: String, ref: 'Email', required: true, unique: true },
			current: { type: Boolean, required: true, default: true },
			verified: { type: Boolean, required: true, default: false  },
			verificationHash: { type: String, required: true, unique: true, default: UserSchema.generateEmailVerificationHash },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		let passwordSchema = new mongoose.Schema({
			encrypted: { type: String, required: true },
			current: { type: Boolean, required: true, default: true },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		let profileImageSchema = new mongoose.Schema({
			data: { type: Buffer, required: true },
			current: { type: Boolean, required: true, default: false },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		let companySchema = new mongoose.Schema({
			code: { type: String, ref: 'Company', required: true },
			role: { type: String }
		});

		super({
			code: { type: String, required: true, unique: true, default: UserSchema.generateCode },
			clientHash: { type: String, required: true, unique: true },
			usename: { type: String },
			name: { type: String, required: true },
			emails: [emailSchema], //required
			passwords: [passwordSchema],
			profileImages: [profileImageSchema],
			companies: [companySchema],
			role: { type: String, required: true, default: 'undefined' },
			creationDate: { type: String, default: AppDate.now },
			modifiedDate: { type: String, default: AppDate.now }
		});

		this.path('emails').validate(function(value) {
			return value.length;
		},"El campo 'emails' no puede ser un array vacío");

		this.methods.auth = this.auth;
		this.methods.insertPassword = this.insertPassword;
		this.methods.updateVerifyEmail = this.updateVerifyEmail;
		this.methods.updateRole = this.updateRole;
		this.methods.addCompany = this.addCompany;
	}

	auth(data) {
		let self = this;
		return new Promise(function(resolve, reject){
			let thepass = self.passwords.find((pass)=>{return pass.current === true});
			if(thepass){
				let decrypted = UserSchema.decryptText(thepass.encrypted);
				if(decrypted === data.password){
					resolve(thepass);
				}else{
					reject({
						responseStatus: 406,
						message: 'La contraseña no es válida'
					});
				}
			}else{
				reject({
					responseStatus: 406,
					message: 'El usuario no tiene contraseña'
				});
			}
		});
	}

	/**
	 * 
	 * @param {*} data = {
	 * 		password: String
	 * 	}
	 */
	insertPassword(data) {
		return Transaction.execTimeout(4000, ()=>{
			let foundPass = this.passwords.find((pass)=>{return pass.current === true});
			if(foundPass) {
				foundPass.current = false;
				foundPass.modifiedDate = AppDate.now();
			}
			this.passwords.push({encrypted: UserSchema.encryptText(data.password)});
			return this.save();
		});
	}

	/**
	 * 
	 * @param {*} data = {
	 * 		verificationHash: String
	 * }
	 */
	updateVerifyEmail(data) {
		let foundEmail = this.emails.find((email)=>{return email.verificationHash === data.verificationHash});
		if(foundEmail){
			foundEmail.verified = true;
			foundEmail.modifiedDate = AppDate.now();
			return Transaction.execTimeout(4000, ()=>{
				return this.save();
			});
		}else{
			return new Promise(function(resolve, reject){ reject('Clave de verificación de email inválido') });
		}
	}

	/**
	 * 
	 * @param {*} data = {
	 * 		role: String
	 * }
	 */
	updateRole(data) {
		return Transaction.execTimeout(4000, ()=>{
			this.role = data.role;
			this.modifiedDate = AppDate.now();
			return this.save();
		});
	}

	addCompany(data) {
		return Transaction.execTimeout(4000, ()=>{
			this.companies.push({code: data.code});
			return this.save();
		});
	}


	static encryptText(text){
		var cipher = crypto.createCipher(cryptAlgorithm, cryptPassword);
		var crypted = cipher.update(text, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	}

	static decryptText(text){
		var decipher = crypto.createDecipher(cryptAlgorithm, cryptPassword);
		var dec = decipher.update(text, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	}

	static generateCode() {
		let gen = randomstring.generate;
		return gen(8) + '-' + gen(16) + '-' + gen(8);
	}

	static generateEmailVerificationHash() {
		let gen = randomstring.generate;
		return gen(32) + '-' + gen(32) + '-' + gen(32);
	}
}

module.exports = class UserModel {
	constructor(db) {
		this.db = db;
		this.schema = new UserSchema();
		this.model = db.connection.model('User', this.schema);
	}

	findOne(q, lastly) {
		return Transaction.execTimeout(4000, ()=>{ return this.model.findOne(q); }, lastly);
	}

	findOneByEmail(data) {
		let self = this;
		return co(function*(){
			let existsEmail = yield self.db.emails.findOne({email: data.email});

			if(!existsEmail){
				throw {
					responseStatus: 406,
					message: 'El correo electrónico ' + data.email + ' no está registrado'
				}
			}

			let user = yield Transaction.execTimeout(4000, ()=>{
				return self.model.findOne({'emails.code': existsEmail.code});
			});

			return user;
		});
	}

	/**
	 * 
	 * @param {*} data = {
	 * 		clientHash: String,
	 * 		name: String,
	 * 		email: String
	 * 	}
	 */
	insertOne(data) {
		let self = this;
		let transaction = new Transaction();
		return transaction.run(function*(){
			let existsEmail = yield self.db.emails.findOne({email: data.email});
			if(existsEmail){
				throw {
					responseStatus: 406,
					message: 'El correo electrónico ' + data.email + ' ya fue registrado. Porfavor intente usar un correo electrónico diferente'
				}
			}

			let insertedEmail = yield transaction.insert(self.db.emails.model, {email: data.email});

			let inserted = yield transaction.insert(self.model, {
				clientHash: data.clientHash,
				usename: data.usename,
				name: data.name,
				emails: [{code: insertedEmail.code}]
			});

			return inserted;
		});
	}

	/**
	 * 
	 * @param {*} data = {
	 * 		hash: String,
	 * 		password: String
	 * 	}
	 */
	/*insertPassword(data) {
		let self = this;
		return co(function*(){
			yield Transaction.execTimeout(4000, ()=>{
				return self.model.update({'hashCode': data.hash, 'passwords.current': true}, {'$set': {
					'passwords.$.current': false,
					'passwords.$.modifiedDate': AppDate.now()
				}});
			});

			return yield Transaction.execTimeout(4000, ()=>{
				return self.model.update({'hashCode': data.hash}, {'$push': {
					passwords: {encrypted: data.password}
				}});
			});
		});
	}*/

	/**
	 * 
	 * @param {*} data = {
	 * 		hash: String,
	 * 		emailID: ObjectId
	 * }
	 */
	/*updateEmailVerified(data) {
		return Transaction.execTimeout(4000, ()=>{
			return this.model.update({'hashCode': data.hash, 'emails._id': data.emailID}, {'$set': {
				'emails.$.verified': true,
				'emails.$.modifiedDate': AppDate.now()
			}});
		});
	}*/

	/**
	 * 
	 * @param {*} data = {
	 * 		hash: String
	 * }
	 */
	/*updateRoleToClient_v1(data) {
		return Transaction.execTimeout(4000, ()=>{
			return this.model.update({'hashCode': data.hash}, {'$set': { role: 'client' }});
		});
	}*/
	
}
