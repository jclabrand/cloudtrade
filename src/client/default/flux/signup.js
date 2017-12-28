
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import api from '../../api';

/****************************************************************************************/

var SignupActions = Reflux.createActions([
	'getRecaptchaPublicKey', 'getAccountStatus', 'getAccountSignupEmail', 'createAccount', 'createAccountPassword'
]);

class SignupStore extends Reflux.Store {
	constructor() {
		super();
		this.state = {
			account: {
				hash: '',
				status: ''
			}
		}
		this.listenables = SignupActions;
	}

	onGetRecaptchaPublicKey(callback) {
		api.common.getRecaptchaPublicKey(callback);
	}

	onGetAccountStatus(hash, bhistory, callback) {
		let auth = localStorage.getItem('authorization');
		api.account.getSignupStatus(hash, auth, (err, res)=>{
			if(err){
				callback(err);
			}else if(this.state.account.status !== res.status){
				this.setState({account: {hash, status: res.status}});

				switch(res.status){
					case 'hashed':
					case 'sigup-posted':
					case 'sigup-verified':
						callback(null, res);
						break;
					case 'sigup-finished':
					case 'loged-out':
						bhistory.push('/login');
						break;
					case 'loged-in':
						window.location.replace('/cuenta');
						break;
					default:
						break
				}
			}
		});
	}

	getAccountSignupEmail(hash, callback) {
		api.account.getSignupEmail(hash, null, callback);
	}

	onCreateAccount(data, callback) {
		api.account.create(data, callback);
	}

	onCreateAccountPassword(data, callback) {
		api.account.createPassword(data, callback);
	}
}

export { SignupActions, SignupStore }
