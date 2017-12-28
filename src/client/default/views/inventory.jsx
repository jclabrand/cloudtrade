
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';
import Reflux from 'reflux';
import { BrowserRouter, Route } from 'react-router-dom';

import { CommonActions, CommonStore } from '../flux/common';
import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';

const Navbar = require('../components/navbar.jsx');
const Sidenav = require('../components/sidenav.jsx');

import InventoryHomeView from './inventory-home-view.jsx';
import InventoryArticlesView from './inventory-articles-view.jsx';
import InventoryWarehousesView from './inventory-warehouses-view.jsx';
import InventoryProvidersView from './inventory-providers-view.jsx';
import InventoryPurchasesView from './inventory-purchases-view.jsx';
import InventoryTransfersView from './inventory-transfers-view.jsx';
import InventoryWarehousesEntriesView from './inventory-wh-entries.jsx';
import InventoryWarehousesOutletsView from './inventory-wh-outlets.jsx';

/****************************************************************************************/

class InventoryApp extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			//authorized: false
		}

		this.stores = [CommonStore, AccountStore, InventoryStore];
    }

	componentWillMount() {
		super.componentWillMount();
		CommonActions.loadTheme();
		AccountActions.authenticate((err, res)=>{
			if(err){
				window.location.replace('/login');
			}/*else if(res && res.user){
				InventoryActions.loadSideMenuItems('tabletec');
				this.setState({authorized: true});
			}*/
		});
	}

	onLogout() {
		AccountActions.logout(()=>{
			window.location.replace('/login');
		});
	}

	render() {
		return(
		<div style={{backgroundColor: '#eeeeee', display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
			<header>
				<Sidenav user={this.state.user} items={this.state.sideMenuItems}/>
				<Navbar user={this.state.user} useSideMenu={true} onLogout={this.onLogout.bind(this)}/>
			</header>
			<main>
				{
					this.state.user ?
					this.props.children : null
				}
			</main>
			<footer className="page-footer grey darken-4">
				<div className="footer-copyright">
					<div className="container">
						©2017 <a className="brown-text text-lighten-3" href="#">CloudTrade</a> Bolivia. Todos los derechos reservados.
					</div>
				</div>
			</footer>
		</div>)
	}
}

class App {
	constructor() {
		document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded.bind(this));
	}

	onDOMContentLoaded() {
		this._mainSection = window.document.getElementById('app-main');

		$.extend($.validator.messages, { required: "Campo obligatorio" });

		this.render();
	}

	render() {
		ReactDOM.render(
			<BrowserRouter>
				<InventoryApp>
					<Route exact={true} path="/empresa/:company/adm/inventarios" component={InventoryHomeView}/>
					
					{/*<Route exact={true} path="/:company/adm/inventarios/articulos" component={InventoryArticlesView}/>*/}
					<Route path="/empresa/:company/adm/inventarios/articulos/:action?/:article?" component={InventoryArticlesView}/>
					
					{/*<Route path="/:company/adm/inventarios/articulos/:action/:article" component={InventoryArticlesView}/>
					<Route exact={true} path="/:company/adm/inventarios/articulos/:article?" component={InventoryArticlesView}/>
					*/}


					<Route path="/empresa/:company/adm/inventarios/almacenes/:action?/:warehouse?" component={InventoryWarehousesView}/>
					<Route path="/empresa/:company/adm/inventarios/almacenes-entradas/:action?/:entry?" component={InventoryWarehousesEntriesView}/>
					<Route path="/empresa/:company/adm/inventarios/almacenes-salidas/:action?/:outlet?" component={InventoryWarehousesOutletsView}/>
					{/*<Route path="/inventarios/almacenes" component={WarehousesView}/>
					<Route path="/inventarios/proveedores" component={ProviderView}/>*/}
					<Route path="/empresa/:company/adm/inventarios/proveedores/:action?/:provider?" component={InventoryProvidersView}/>
					<Route path="/empresa/:company/adm/inventarios/compras/:action?/:purchase?" component={InventoryPurchasesView}/>
					<Route path="/empresa/:company/adm/inventarios/transferencias/:action?/:transfer?" component={InventoryTransfersView}/>
					
				</InventoryApp>
			</BrowserRouter>,
			this._mainSection);
	}
}

var app = new App();
