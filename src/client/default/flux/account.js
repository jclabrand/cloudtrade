
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import api from '../../api';

/****************************************************************************************/

var AccountActions = Reflux.createActions([
	'login', 'logout', 'authenticate',
	'companies',
	'loadSideMenuItems'
]);

class AccountStore extends Reflux.Store {
	constructor() {
		super();
		this.state = {
			user: null,
			sideMenuItems: []
		}
		this.listenables = AccountActions;
	}

	onLogin(data, callback) {
		api.account.login(data, callback);
	}

	onLogout(callback) {
		localStorage.removeItem('authorization');
		this.setState({ user: null });
		callback();
	}

	onAuthenticate(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.account.authenticate(auth, (err, res)=>{
				if(err){
					this.setState({ user: null });
					callback(err);
				}
				else{
					this.setState({ user: res.user });
					callback(null, res);
				}
			});
		}else{
			callback({status: 406, response: {message:'Acceso no autorizado!'}});
		}
	}

	companies(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			console.log('auth');
			api.account.companies(auth, callback);
		}else{
			callback({status: 406, response: {message:'Acceso no autorizado!'}});
		}
	}

	onLoadSideMenuItems(company) {
		var loadedData = [
			{text: 'Inicio', iconName: 'home', linkTo: '/cuenta'},
			{text: 'Perfil', iconName: 'account_circle', linkTo: '/cuenta/perfil'},
			{text: 'empresas', iconName: 'business', linkTo: '/cuenta/empresas'}
		]

		this.setState({ sideMenuItems: loadedData });
	}
}

export { AccountActions, AccountStore }
