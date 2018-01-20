
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import mongoose from 'mongoose';
import Hashmap from 'hashmap';
import colors from 'colors';

import EmailModel from './email-model';
import UserModel from './user-model';
import CompanyModel from './company-model';

import ImageModel from './image-model';
import CityModel from './city-model';
import EmployeeModel from './employee-model';
import ArticleModel from './article-model';
import ArticleBrandModel from './article-brand-model';
import ArticleCategoryModel from './article-category-model';
import ProviderModel from './provider-model';
import WarehouseModel from './warehouse-model';
import WarehouseEntryModel from './warehouse-entry-model';
import WarehouseEntryPurchaseModel from './warehouse-entry-purchase-model';
import WarehouseEntryTransferModel from './warehouse-entry-transfer-model';
import WarehouseEntryCustomModel from './warehouse-entry-custom-model';
import WarehouseOutletModel from './warehouse-outlet-model';
import WarehouseOutletTransferModel from './warehouse-outlet-transfer-model';
import WarehouseOutletCustomModel from './warehouse-outlet-custom-model';
import PurchaseModel from './purchase-model';
import TransferModel from './transfer-model';
import ReportModel from './report-model';

/****************************************************************************************/

mongoose.Promise = global.Promise;

class Connection {
	constructor(opt, system, callback) {
		this.isConnected = false;

		this.connection = mongoose.createConnection();

		this.connection.on('error', this.onError.bind(this));

		this.connection.on('connecting', ()=>{
			//console.log('DB connecting'); //////////////////////////////////
		});
		
		this.connection.on('connected', ()=>{
			console.log(colors.green('[DB] connected to:', opt.db));
			this.isConnected = true;
			if(callback){ callback(null, this); }
		});
		this.connection.on('disconnected', ()=>{
			console.log(colors.yellow('[DB] disconnected from:', opt.db));
			this.isConnected = false;
		});
		this.connection.on('reconnected', ()=>{
			console.log(colors.green('[DB] reconnected to:', opt.db));
			this.isConnected = true;
		});
		this.connection.on('close', this.onClose.bind(this));

		let cnnstr = 'mongodb://';
		if(opt.user && opt.user.length > 0){
			cnnstr = cnnstr + opt.user+':'+opt.pass+'@'+opt.host+':'+opt.port+'/'+opt.db;
		}else{
			cnnstr = cnnstr + opt.host+':'+opt.port+'/'+opt.db;
		}


		this.connection.open(cnnstr,
			{server: {reconnectTries: Number.MAX_VALUE}}
		).then(()=>{

		}).catch(err=>{
			console.log(err);
			if(callback){ callback(err); }
		});

		if(system){
			this.emails = new EmailModel(this);
			this.users = new UserModel(this);
			this.companies =new CompanyModel(this);
		}else{
			this.images	= new ImageModel(this);
			this.cities = new CityModel(this);
			this.staff = new EmployeeModel(this);
			this.articles = new ArticleModel(this);
			this.articleBrands = new ArticleBrandModel(this);
			this.articleCategories = new ArticleCategoryModel(this);
			this.providers = new ProviderModel(this);
			this.warehouses = new WarehouseModel(this);
			this.warehouseEntries = new WarehouseEntryModel(this);
			this.warehouseEntryPurchases = new WarehouseEntryPurchaseModel(this);
			this.warehouseEntryTransfers = new WarehouseEntryTransferModel(this);
			this.warehouseEntryCustom = new WarehouseEntryCustomModel(this);
			this.warehouseOutlets = new WarehouseOutletModel(this);
			this.warehouseOutletTransfers = new WarehouseOutletTransferModel(this);
			this.warehouseOutletCustom = new WarehouseOutletCustomModel(this);
			this.purchases = new PurchaseModel(this);
			this.transfers = new TransferModel(this);
			this.reports = new ReportModel(this);
		}
	}

	onError(err) {
		console.log('DB Error', err);
	}

	/*onConnected() {
		console.log('DB connected');
	}*/

	/*onDisconnected() {
		console.log('DB disconnected');
	}*/

	onReconnected() {
		console.log('DB reconnected');
	}

	onClose() {
		console.log('DB close');
	}
}

class DB {
	constructor(config) {
		this.connections = new Hashmap();
		this.cnnopt = {
			host: config.connection.host,
			port: config.connection.port,
			user: config.connection.user,
			pass: config.connection.pass,
			db: config.connection.sysdb
		}
		this.systemdb = new Connection(this.cnnopt, true);
	}

	connection(dbname, callback) {
		let cnnopt = {
			host: this.cnnopt.host,
			port: this.cnnopt.port,
			user: this.cnnopt.user,
			pass: this.cnnopt.pass,
			db: dbname
		}
		var connections = this.connections;
		if(connections.has(dbname)){
			let cnn = connections.get(dbname);
			if(cnn.isConnected){
				callback(null, cnn);
			}
		}else{
			var cnn = new Connection(cnnopt, false, callback);
			connections.set(dbname, cnn);
		}
	}

}

module.exports = DB;
