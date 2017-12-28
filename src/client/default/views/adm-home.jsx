
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';
import Reflux from 'reflux';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from '../components/navbar.jsx';
import ButtonAdmin from '../components/buttonAdmin.jsx';

//import { CommonActions, CommonStore } from '../flux/common';
import { AccountActions, AccountStore } from '../flux/account';
import { CompanyActions, CompanyStore } from '../flux/company';

/****************************************************************************************/

class AdminHomeView extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
		}

		this.stores = [CompanyStore];
    }

	componentWillMount() {
		super.componentWillMount();
		CompanyActions.setCompany(this.props.match.params.company);
		CompanyActions.authenticate((err, res)=>{
			if(err){
				window.location.replace('/empresa/' + this.props.match.params.company);
			}
		});
	}

	render() {
		let company = this.props.match.params.company;
		return this.state.user ? (
		<div className="container">
			<div className="row">
				<h5 className="center-align" style={{ textShadow:' 1px 1px 1px #999'}}><b>Menu Principal</b></h5>
			</div>
			<div className="row">
				<div > 
					<ButtonAdmin text="Inventarios" href={'/empresa/'+company+'/adm/inventarios'} iconName="work"/>	
					<ButtonAdmin text="Compras" href="#" iconName="language"/>
					<ButtonAdmin text="Ventas" href="" iconName="shopping_cart"/>
					<ButtonAdmin text="Administracion" href="" iconName="settings"/>
				</div>
			</div>
		</div>) : null;
	}
}

class AdminHome extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
		}

		this.stores = [AccountStore];//[CommonStore, AccountStore];
    }

	componentWillMount() {
		super.componentWillMount();
		AccountActions.authenticate((err, res)=>{
			if(err){
				window.location.replace('/login');
			}
		});
	}

	onLogout() {
		AccountActions.logout(()=>{
			window.location.replace('/login');
		});
	}

	render() {
		return(
		<div>
			<header>
				{/*<Sidenav items={this._sideMenuItems}/>*/}
				{/*<Navbar themeColor={this.state.theme.colorName}/>*/}
				<Navbar user={this.state.user} onLogout={this.onLogout.bind(this)}/>
			</header>
			<main>
				{
					this.state.user ?
					this.props.children : null
				}
			</main>
			{/*<footer>
			</footer>*/}
		</div>)
	}
}

class AdminHomeApp {
	constructor() {
		document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded.bind(this));
	}

	onDOMContentLoaded() {
		this._mainSection = window.document.getElementById('app-main');
		this.render();
	}

	render() {
		ReactDOM.render(
			<BrowserRouter>
				<AdminHome>
					<Route exact={true} path="/empresa/:company/adm" component={AdminHomeView}>
					</Route>
				</AdminHome>
			</BrowserRouter>,
			this._mainSection);
	}
}

var app = new AdminHomeApp();
