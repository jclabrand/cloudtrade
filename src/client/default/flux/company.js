
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import api from '../../api';

/****************************************************************************************/

var CompanyActions = Reflux.createActions([
	'setCompany', 'authenticate'
]);

/****************************************************************************************/

class CompanyStore extends Reflux.Store {
    constructor() {
		super();

		this.state = {
			company: '',
			user: null,
		}

		this.listenables = CompanyActions;
	}

	onSetCompany(company) {
		this.setState({company});
	}

	authenticate(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.company.authenticate({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({ user: null });
					callback(err);
				}else{
					this.setState({ user: res.user });
					callback(null, res);
				}
			});
		}else{
			callback({status: 401, response:{message: 'Acceso no autorizado'}});
		}
	}
}

export { CompanyActions, CompanyStore }
