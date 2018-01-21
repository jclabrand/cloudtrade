
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';
import passport from 'passport';

import AppFile from '../../persistence/file';

/****************************************************************************************/

class Articles {
	constructor() {
		this.router = express.Router();

		this.router.get('/listar', this.findAll.bind(this));
		this.router.get('/ver/:article', this.findOne.bind(this));

		this.router.get('/listar-marcas', this.findAllBrands.bind(this));
		this.router.get('/listar-categorias', this.findAllCategories.bind(this));

		this.router.post('/insertar', this.insertOnePOST.bind(this));
		this.router.put('/editar', this.updateOnePUT.bind(this));

		this.router.post('/upload-image', this.uploadImagePOST.bind(this));
	}

	findAll(req, res) {
		req.app.db.articles.findAll().then(rows=>{
			res.status(200).json({
				articles: {
					columns: req.app.db.articles.getSchemaColumns(),
					rows
				}
			});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findAllBrands(req, res) {
		req.app.db.articleBrands.findAll().then(brands=>{
			res.status(200).json({brands});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findAllCategories(req, res) {
		req.app.db.articleCategories.findAll().then(categories=>{
			res.status(200).json({categories});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	findOne(req, res) {
		let self = this;
		co(function*(){
			let article = yield req.app.db.articles.findOne({code: req.params.article});
			let encImages = yield self.enc(article.modImages);
			let existences = yield req.app.db.articles.existencesArticle({code: req.params.article});
			return {
				code: article.code,
				clientCode: article.clientCode,
				barCode: article.barCode,
				name: article.name,
				description: article.description,
				brand: article.brand,
				category: article.category,
				images: encImages,
				customFields: article.customFields,
				prices: article.prices,
				creationDate: article.creationDate,
				modifiedDate: article.modifiedDate,
				existences: existences
			};
		}).then(article=>{
			res.json({article});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	insertOnePOST(req, res) {
		let self = this;
		co(function*(){
			//req.body.images = yield self.readFiles('temp', req.body.imageNames);
			return yield req.app.db.articles.insertOne(req.body);
		}).then(article=>{
			res.json({article});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	updateOnePUT(req, res) {
		let self = this;
		co(function*(){
			return yield req.app.db.articles.updateOne({code: req.body.code}, {
				name: req.body.name,
				brand: req.body.brand,
				category: req.body.category,
				description: req.body.description
			});
		}).then(article=>{
			res.json({article});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	/*uploadFilePOST(req, res) {
		req.files.file.save('temp').then((msg)=>{
			res.status(200).json({status: 200, message: msg, name: req.files.file.uname});
		}).catch((err)=>{
			res.sendError(err);
		});
	}*/

	uploadImagePOST(req, res) {
		co(function*(){
			return yield req.app.db.images.insertOne(req.files.file);
		}).then(image=>{
			res.json({name: image.code});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	/************************************************************************************/
	// Helper functions
	/************************************************************************************/

	/*readFiles(dir, filenames) {
		var encres = filenames.map((fname)=>{
			return AppFile.readToBuffer(dir, fname).then(file=>{
				return {
					code: fname,
					data: file
				}
			});
		});
		return Promise.all(encres);
	}*/

	enc(images) {
		var encres = images.map((img)=>{
			return co(function*(){
				var arr = new Uint8Array(img.data.buffer);
				var binstr = Array.prototype.map.call(arr, function(ch){
					return String.fromCharCode(ch);
				}).join('');
				return binstr;
			});
		});
		return Promise.all(encres);
	}
}

module.exports = Articles;
