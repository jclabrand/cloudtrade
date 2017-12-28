
import request from 'superagent';


function stdResCallback(err, res, callback) {
	if(err){
		let status = err.status || 404,
			response = { message: 'Servicio o recurso no encontrado' };
		if(err.response){
			if(err.response.body){
				response = err.response.body
			}else if(err.response.text){
				response = { message: err.response.text }
			}
		}
		callback({status, response});
	}else{callback(null, res.body);}
}

function stdResTextCallback(err, res, callback) {
	if(err){
		let status = err.status || 404,
			response = { message: 'Servicio o recurso no encontrado' };
		if(err.response){
			if(err.response.body){
				response = err.response.body
			}else if(err.response.text){
				response = { message: err.response.text }
			}
		}
		callback({status, response});
	}else{callback(null, res.text);}
}

var common = {
	getRecaptchaPublicKey: function(callback){
		request
			.get('/api/seguridad/recaptcha-clave-publica')
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	}
}

var account = {
	/*getSignupStatus: function(hash, authorization, callback){
		if(authorization){
			request
				.get('/registro/api/estado-cuenta/' + hash)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		}else{
			request
				.get('/registro/api/estado-cuenta/' + hash)
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		}
	},

	getSignupEmail: function(hash, headers, callback){
		request
			.get('/registro/api/email/' + hash)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	create: function(data, callback){
		request
			.post('/registro/api/crear-cuenta/' + data.hash)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	createPassword: function(data, callback){
		request
			.post('/registro/api/crear-clave/' + data.hash)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},*/

	authenticate: function(authorization, callback){
		request
			.get('/api/cuenta/autenticar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	login: function(data, callback){
		request
			.post('/api/cuenta/iniciar')
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	companies: function(authorization, callback){
		request
			.get('/api/cuenta/empresas')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
}

/* */

var articles = {
	findAll: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/articulos/listar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
	findOne: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/articulos/ver/' + data.article)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	insertOne: function(data, authorization, callback) {
		request
			.post('/api/empresa/' + data.company + '/adm/inventarios/articulos/insertar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findAllBrands: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/articulos/listar-marcas')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findAllCategories: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/articulos/listar-categorias')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	}
}

var warehouses = {
	findAll: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/almacenes/listar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findOne: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/almacenes/ver/' + data.warehouse)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findAllArticlesFor: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/almacenes/ver-articulos/' + data.warehouse)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	insertOne: function(data, authorization, callback) {
		request
			.post('/api/empresa/' + data.company + '/adm/inventarios/almacenes/insertar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	updateOne: function(data, authorization, callback) {
		request
			.post('/api/empresa/' + data.company + '/adm/inventarios/almacenes/editar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	entries: {
		findAll: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/almacenes-entradas/listar')
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},

		findOne: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/almacenes-entradas/ver/' + data.entryCode)
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},

		insertOne: function(data, authorization, callback) {
			request
				.post('/api/empresa/' + data.company + '/adm/inventarios/almacenes-entradas/insertar')
				.set('authorization', authorization)
				.send(data)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
	},

	outlets: {
		findAll: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/almacenes-salidas/listar')
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},

		findOne: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/almacenes-salidas/ver/' + data.outletCode)
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},

		insertOne: function(data, authorization, callback) {
			request
				.post('/api/empresa/' + data.company + '/adm/inventarios/almacenes-salidas/insertar')
				.set('authorization', authorization)
				.send(data)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
	}
}

var providers = {
	findAll: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/proveedores/listar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findOne: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/proveedores/ver/' + data.provider)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	insertOne: function(data, authorization, callback) {
		request
			.post('/api/empresa/' + data.company + '/adm/inventarios/proveedores/insertar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	updateOne: function(data, authorization, callback) {
		request
			.put('/api/empresa/' + data.company + '/adm/inventarios/proveedores/editar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findAllCities: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/proveedores/listar-ciudades')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	}
}

var purchases = {
	findAll: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/compras/listar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findAllDelivered: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/compras/listar-entregados')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findOne: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/compras/ver/' + data.purchase)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findOneArticles: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/compras/ver-articulos/' + data.purchase)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	insertOne: function(data, authorization, callback) {
		request
			.post('/api/empresa/' + data.company + '/adm/inventarios/compras/insertar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	updateOneStatus: function(data, authorization, callback) {
		request
			.put('/api/empresa/' + data.company + '/adm/inventarios/compras/cambiar-estado')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
}

var transfers = {
	findAll: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/transferencias/listar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findOne: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/transferencias/ver/' + data.transfer)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findAllWithdrawn: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/transferencias/listar-retirados')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findAllApproved: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/transferencias/listar-aprobados')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	findOneArticles: function(data, authorization, callback) {
		request
			.get('/api/empresa/' + data.company + '/adm/inventarios/transferencias/ver-articulos/' + data.transfer)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	insertOne: function(data, authorization, callback) {
		request
			.post('/api/empresa/' + data.company + '/adm/inventarios/transferencias/insertar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},

	updateOneStatus: function(data, authorization, callback) {
		request
			.put('/api/empresa/' + data.company + '/adm/inventarios/transferencias/cambiar-estado')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
}

var reports = {
	articles: {
		getStockReport: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/reportes/articulos/stock/' + data.article)
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
	},
	warehouses: {
		getStockReport: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/reportes/almacenes/stock/' + data.warehouse)
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
	},
	transfers: {
		getDatedReport: function(data, authorization, callback) {
			request
				.post('/api/empresa/' + data.company + '/adm/inventarios/reportes/transferencias/por-fecha')
				.set('authorization', authorization)
				.send(data)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
		getDetailReport: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/reportes/transferencias/detalle/' + data.transfer)
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
	},
	purchases: {
		getDatedReport: function(data, authorization, callback) {
			request
				.post('/api/empresa/' + data.company + '/adm/inventarios/reportes/compras/por-fecha')
				.set('authorization', authorization)
				.send(data)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
		getDetailReport: function(data, authorization, callback) {
			request
				.get('/api/empresa/' + data.company + '/adm/inventarios/reportes/compras/detalle/' + data.purchase)
				.set('authorization', authorization)
				.end((err, res)=>{ stdResCallback(err, res, callback) });
		},
	}
}

var inventory = {
	articles: articles,
	warehouses: warehouses,
	providers: providers,
	purchases: purchases,
	transfers: transfers,

	reports: reports
}

var company = {
	authenticate: function(data, authorization, callback){
		request
			.get('/api/empresa/' + data.company + '/autenticar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
}

/* */

module.exports = {
	common: common,

	account: account,

	company: company,

	inventory: inventory
}
