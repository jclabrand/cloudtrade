
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import path from 'path';
import React from 'react'
import { renderToString } from 'react-dom/server'

import Home from './routes/home.jsx';
import TabletecHome from './routes/tabletec-home.jsx';
import Signup from './routes/signup.jsx';
import Account from './routes/account.jsx';
import About from './routes/about.jsx';
import AdminHome from './routes/adm-home.jsx';
import Inventory from './routes/inventory.jsx';

import ErrorView from './routes/error.jsx';

/****************************************************************************************/

module.exports = class Render {
	constructor() {
	}

	static view(name) {
		switch(name){
		case 'home': return renderToString(<Home/>);
		case 'tabletec': return renderToString(<TabletecHome/>);
		
		case 'signup':
			let recaptcha = (<script key={0} src="https://www.google.com/recaptcha/api.js?render=explicit" async defer></script>);
			return renderToString(<Signup headScripts={[recaptcha]}/>);

		case 'account': return renderToString(<Account/>);
		case 'about': return renderToString(<About/>);

		case 'adm-home': return renderToString(<AdminHome/>);
		case 'inventory': return renderToString(<Inventory/>);

		case 'error': return renderToString(<ErrorView/>);
		default:
			return null;
		}
	}
}
