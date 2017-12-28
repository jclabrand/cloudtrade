
/****************************************************************************************

	Copyright (c) 2016-2017,.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import { CommonActions } from '../flux/common';

import api from '../../api';

/****************************************************************************************/

var WarehousesEntryActions = Reflux.createActions([
	'setCompany', 'findAll', 'findOne', 'insertOne', 'updateOne',
	'findAllWarehouses', 'findAllDeliveredPurchases', 'findAllWithdrawnTransfers',
	'findAllPurchaseArticles', 'findAllTransferArticles'
]);

class WarehousesEntryStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: '',

			selectedItem: null,

			list: { columns: [], rows: [] },
			listStatus: 'loading', // loading, ready, error

			viewerStatus: 'ready', // loading, ready, error
		}

		this.listenables = WarehousesEntryActions;
	}

	onSetCompany(company) {
		this.setState({company});
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.warehouses.entries.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					res.entries.rows.forEach(entry=>{
						entry.transactionsTypeName = this.translateTypeName(entry.transactionsTypeName);
					});
					this.setState({list: res.entries, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(entryCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			/*api.inventory.warehouses.findOne({company: this.state.company, warehouse: warehouseCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					this.setState({selectedItem: res.warehouse, viewerStatus: 'ready'});
				}
			});*/

			api.inventory.warehouses.entries.findOne({company: this.state.company, entryCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					res.entry.tTransactionsTypeName = this.translateTypeName(res.entry.transactionsTypeName);
					this.setState({selectedItem: res.entry, viewerStatus: 'ready'});
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

	findAllDeliveredPurchases(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.purchases.findAllDelivered({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllPurchaseArticles(purchaseCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.purchases.findOneArticles({company: this.state.company, purchase: purchaseCode}, auth, callback);
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	findAllWithdrawnTransfers(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.transfers.findAllWithdrawn({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllTransferArticles(transferCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.transfers.findOneArticles({company: this.state.company, transfer: transferCode}, auth, callback);
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	onInsertOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		data.company = this.state.company;
		if(auth){
			api.inventory.warehouses.entries.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	translateTypeName(value) {
		switch(value) {
			case 'purchases': return 'Compra';
			case 'transfers': return 'Transferencia';
			case 'custom': return 'Entrada';
			default: return 'Desconocido'
		}
	}
}

export { WarehousesEntryActions, WarehousesEntryStore }
