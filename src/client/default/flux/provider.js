
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';
//const CommonActions = require('../flux/commonActions');
import api from '../../api';

/****************************************************************************************/

var ProviderActions = Reflux.createActions([
	'setCompany', 'findAll', 'findOne', 'insertOne', 'updateOne',
	'findAllCities'
]);

class ProviderStore extends Reflux.Store {
    constructor() {
        super();

		this.state = {
			company: '',

			//view: 'review', // review, insert, update
			selectedItem: null,

            list: { columns: [], rows: [] },
			listStatus: 'loading', // ready, loading, error

			viewerStatus: 'ready',
			//insertStatus: 'ready',
			//updateStatus: 'ready',
        }

		this.listenables = ProviderActions;

	/*	CommonActions.listen('on-update-provider-list', this.onLoadListDone.bind(this));
		CommonActions.listen('on-load-provider-list-done', this.onLoadListDone.bind(this));
		CommonActions.listen('on-load-provider-list-fail', this.onLoadListFail.bind(this));

		CommonActions.listen('on-load-one-provider-done', this.onLoadOneDone.bind(this));
		CommonActions.listen('on-load-one-provider-fail', this.onLoadOneFail.bind(this));

		CommonActions.listen('on-insert-one-provider-done', this.onInsertOneDone.bind(this));
		CommonActions.listen('on-insert-one-provider-fail', this.onInsertOneFail.bind(this));*/
	}

	onSetCompany(company) {
		this.setState({company});
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.providers.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					this.setState({list: res.providers, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(providerCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.providers.findOne({company: this.state.company, provider: providerCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					this.setState({selectedItem: res.provider, viewerStatus: 'ready'});
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
			api.inventory.providers.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	onUpdateOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.providers.updateOne(data, auth, (err, res)=>{
				if(err){
					callback(err)
				}else{
					this.setState({selectedItem: res.provider});
					callback(null, res);
				}
			});
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

	/*_emit(message, data) {
		return new Promise(function(resolve, reject){
			CommonActions.emit(message, data, resolve, reject);
		});
	}*/
	
	/************************************************************************************/
	/************************************************************************************/

	/*onSetView(option) {
		switch(option){
		case 'insert':
			this.setState({view: 'insert', insertStatus: 'ready'});
			break;
		}
	}

	onLoadList(data) {
		var self = this;
		this._emit('find-all-providers', data).then(function(){
			self.setState({listStatus: 'loading'});
		}).catch(function(){
			self.setState({listStatus: 'error'});
		});
	}

	onFindOne(data) {
	}

	onInsertOne(data) {
	}*/

	/************************************************************************************/
	// Connection Listeners
	/************************************************************************************/

	/*onLoadListDone(data) {
		this.setState({list: data, listStatus: 'ready'});
	}

	onLoadListFail(e) {
		this.setState({listStatus: 'error'});
	}

	onLoadOneDone(data) {
		/*this.setState({
			selectedItem: data,
			view: 'show',
			articleViewStatus: 'ready'
		});*/
	/*}

	onLoadOneFail(e) {
		//this.setState({ articleViewStatus: 'error' })
	}

	onInsertOneDone(data) {
		//this.setState({articleInsertStatus: 'done'});
	}

	onInsertOneFail(data) {
		//this.setState({articleInsertStatus: 'fail'});
	}*/

}

export { ProviderActions, ProviderStore }
