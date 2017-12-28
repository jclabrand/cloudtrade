
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import { CommonActions } from '../flux/common';

import api from '../../api';

/****************************************************************************************/

var WarehousesActions = Reflux.createActions([
	'setCompany', 'findAll', 'findOne', 'insertOne', 'updateOne',
	'findAllCities',
	'getStockReport'
]);

/****************************************************************************************/

class WarehousesStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: '',

			//view: 'show', // show, insert, update
			selectedItem: null,

			list: { columns: [], rows: [] },
			listStatus: 'loading', // loading, ready, error

			viewerStatus: 'ready', // loading, ready, error

			//insertStatus: 'ready', // ready, loading, sending, done, fail, error
			//updateStatus: 'ready', // ready, loading, sending, done, fail, error
		}

		this.listenables = WarehousesActions;

		/*CommonActions.listen('on-update-warehouses-list', this.onLoadListDone.bind(this));
		CommonActions.listen('on-load-warehouses-list-done', this.onLoadListDone.bind(this));
		CommonActions.listen('on-load-warehouses-list-fail', this.onLoadListFail.bind(this));

		CommonActions.listen('on-load-one-warehouse-done', this.onLoadOneDone.bind(this));
		CommonActions.listen('on-load-one-warehouse-fail', this.onLoadOneFail.bind(this));

		CommonActions.listen('on-insert-one-warehouse-done', this.onInsertOneDone.bind(this));
		CommonActions.listen('on-insert-one-warehouse-fail', this.onInsertOneFail.bind(this));*/
	}

	_emit(message, data) {
		return new Promise(function(resolve, reject){
			CommonActions.emit(message, data, resolve, reject);
		});
	}

	// Action Listeners


	onSetCompany(company) {
		this.setState({company});
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.warehouses.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					this.setState({list: res.warehouses, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(warehouseCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.warehouses.findOne({company: this.state.company, warehouse: warehouseCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					this.setState({selectedItem: res.warehouse, viewerStatus: 'ready'});
				}
			});
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	onInsertOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.warehouses.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	onUpdateOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.warehouses.updateOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllCities(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.providers.findAllCities({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	getStockReport(warehouseCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.reports.warehouses.getStockReport({company: this.state.company, warehouse: warehouseCode}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}


	/*onLoadList(data) {
		var self = this;
		CommonActions.emit('find-all-warehouses', {},
		function(){
			self.setState({listStatus: 'loading'});
		},
		function(){
			self.setState({listStatus: 'error'});
		});
    }

	onFindOne(data) {
		var self = this;
		this._emit('find-one-warehouse', data).then(function(){
			self.setState({view: 'show', viewerStatus: 'loading'});
		}).catch(function(){
			self.setState({view: 'show', viewerStatus: 'error'});
		});
	}

	onInsertOne(data) {
		var self = this;
		this._emit('insert-one-warehouse', data).then(function(){
			self.setState({insertStatus: 'sending'});
		}).catch(function(){
			self.setState({insertStatus: 'error'});
		});
	}

	// Connection Listeners

	onLoadListDone(data) {
		this.setState({list: data, listStatus: 'ready'});
	}
	onLoadListFail(e) {
		this.setState({listStatus: 'error'});
	}


	onLoadOneDone(data) {
		this.setState({
			selectedItem: data,
			view: 'show',
			viewerStatus: 'ready'
		});
	}
	onLoadOneFail(e) {
		this.setState({view: 'show', viewerStatus: 'error'});
	}


	onInsertOneDone() {
		this.setState({insertStatus: 'done'});
	}
	onInsertOneFail() {
		this.setState({insertStatus: 'fail'});
	}*/
}

export { WarehousesActions, WarehousesStore }
