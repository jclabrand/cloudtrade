
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import api from '../../api';

/****************************************************************************************/

var TransfersActions = Reflux.createActions([
	'setCompany', 'findAll', 'findOne', 'insertOne', 'updateOne', 'updateOneStatus',
	'findAllWarehouses', 'findAllArticlesFor',
	'getDatedReport', 'getDetailReport'
]);

/****************************************************************************************/

class TransfersStore extends Reflux.Store {
    constructor() {
		super();

        this.state = {
			company: '',

			listStatus : 'ready',
        	list : { columns: [], rows: [] },

			viewerStatus: 'ready', // loading, ready, error
			selectedItem: null,
		}

		this.listenables = TransfersActions;
	}

	onSetCompany(company) {
		this.setState({company});
	}

	findAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.transfers.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					res.transfers.rows.forEach(transfer=>{
						transfer.status = this.translateStatus(transfer.status);
					});
					this.setState({list: res.transfers, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	findOne(transferCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.transfers.findOne({company: this.state.company, transfer: transferCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					res.transfer.status = this.translateStatus(res.transfer.status);
					this.setState({selectedItem: res.transfer, viewerStatus: 'ready'});
				}
			});
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	findAllWarehouses(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.findAll({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllArticlesFor(warehouse, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.findAllArticlesFor({company: this.state.company, warehouse}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	insertOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		data.company = this.state.company;
		if(auth){
			api.inventory.transfers.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	updateOneStatus(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.transfers.updateOneStatus(data, auth, (err, res)=>{
				if(err){
					callback(err)
				}else{
					res.transfer.status = this.translateStatus(res.transfer.status);
					this.setState({selectedItem: res.transfer});
					callback(null, res);
				}
			});
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	getDatedReport(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.reports.transfers.getDatedReport(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	getDetailReport(transferCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.reports.transfers.getDetailReport({company: this.state.company, transfer: transferCode}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	/********************* */

	translateStatus(value) {
		switch(value) { //created, approved, cancelled, delayed, delivered, joined
			case 'created': return 'Creado';
			case 'approved': return 'Aprobado';
			case 'cancelled': return 'Cancelado';
			case 'withdrawn': return 'Retirado del almacen de origen';
			case 'delayed': return 'Retrasado';
			case 'joined': return 'Depositado en almacén destino';
			default: return 'Desconocido'
		}
	}
}

export { TransfersActions, TransfersStore }
