
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';
import io from 'socket.io-client';

/****************************************************************************************/

var CommonActions = Reflux.createActions(['listen', 'emit', 'loadTheme']);

class CommonStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			theme: {
			   colorName: 'black'
			},
			
			connectionStatus: 'connecting'
        }

        this.listenables = CommonActions;

		/*this._cnn = io(null, { log: false });
		

		this._cnn.on('connecting', this.onConnecting.bind(this));
		this._cnn.on('connect', this.onConnect.bind(this));
		this._cnn.on('connect_failed', this.onConnectFailed.bind(this));
		this._cnn.on('disconnect', this.onDisconnect.bind(this));
		
		this._cnn.on('reconnect_failed', this.onReconnectFailed.bind(this));
		this._cnn.on('reconnect_error', this.onReconnectError.bind(this));
		this._cnn.on('error', this.onError.bind(this));

		this._cnn.on('on-load-theme', this.onLoadThemeDone.bind(this));

		console.log('NEW CommonStore');*/
    }

	// Action Listeners

	onListen(message, callback) {
		this._cnn.on(message, callback);
	}

	onEmit(message, data, done, fail) {
		switch(this.state.connectionStatus){
		case 'connecting':
		case 'connected':
			this._cnn.emit(message, data);
			done();
			break;

		case 'disconnected':
		default:
			fail();
			break;
		}
	}

	onLoadTheme() {
		this.onLoadThemeDone({colorName: "blue-grey darken-4"});
		//this._cnn.emit('load-theme', {});
	}

	// Connection Listeners

	onConnecting() {
		console.log('onConnecting');
	}

	onConnect() {
		this.setState({connectionStatus: 'connected'});
	}

	onConnectFailed() {
		console.log('onConnectFailed');
	}

	onDisconnect() {
		this.setState({connectionStatus: 'disconnected'});
	}

	onReconnectFailed() {
		console.log('onReconnectFailed');
	}

	onReconnectError(e) {
		//console.log('onReconnectError');
	}

	onError() {
		console.log('onError');
	}


	onLoadThemeDone(data) {
		this.setState({ theme: data });
	}
}

export { CommonActions, CommonStore }
