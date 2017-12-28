
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';
import Reflux from 'reflux';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import { AccountActions, AccountStore } from '../flux/account';

import Navbar from '../components/navbar.jsx';
import Sidenav from '../components/sidenav.jsx';

import Panel from '../components/sectionCard.jsx';
import MessageModal from '../components/modal.jsx';

/****************************************************************************************/

class Welcome extends Reflux.Component {
	constructor(props) {
        super(props);

		this.stores = [AccountStore];
    }

	/*logout() {
		localStorage.removeItem('authorization');
		window.location.replace('/login');
	}*/

	/*render() {
		return(
		<div className="container">
			<h3>Bienvenido {this.state.user.name}</h3>

			<button className="btn" type="submit" onClick={this.logout.bind(this)}>
				Cerrar sesión
			</button>
		</div>);
	}*/

	render() {
		return(
			<div className="card" style={{padding: '0rem 0.5rem'}}>
			    <div className="card-image waves-effect waves-block waves-light" style={{height: '250px'}}>
			      <img className="activator" src="/images/user-profile-bg.jpg"/>
			    </div>
			    <figure className="card-profile-image" style={{width: '110px',position: 'absolute',top: '190px',zIndex: '1',
						left: '40px',cursor: 'pointer',margin: '0'}}>
                    <img src="/images/profile-pic.jpg" alt="profile image" 
                    className=" z-depth-2 responsive-img activator" style={{maxWidth: '100%', height: 'auto' , borderRadius: '50%'}}/>
                </figure>
			    <div className="card-content" style={{ paddingTop:'0rem'}}>.
			    <div className="row">
			      	<div className="col s3 offset-s2">                        
                        <h4 className="card-title grey-text text-darken-4">{this.state.user.name}</h4>
                        <p className="medium-small grey-text">{this.state.user.email}</p>                        
                   	</div>
                   	<div className="col s2 center-align">
                        {/*<h4 className="card-title grey-text text-darken-4">0+</h4>
                        <p className="medium-small grey-text">Work Experience</p>*/}
                    </div>
                    <div className="col s2 center-align">
                        {/*<h4 className="card-title grey-text text-darken-4">0</h4>
                        <p className="medium-small grey-text">Completed Projects</p>*/}
                    </div>
                    <div className="col s2 center-align">
                        {/*<h4 className="card-title grey-text text-darken-4">$ 0</h4>
                        <p className="medium-small grey-text">Busness Profit</p>*/}
                    </div>
                   	<div className="col s1 right-align">
                      <a className="btn-floating activator waves-effect waves-light darken-2 right">
                          <i className="material-icons">perm_identity</i>
                      </a>
                    </div>
			    </div>
			    </div>
			    <div className="card-reveal">
			      <span className="card-title grey-text text-darken-4">Datos de usuario<i className="material-icons right">close</i></span>
			       <p>
                      <span className="card-title grey-text text-darken-4">{this.state.user.name}<i className="mdi-navigation-close right"></i></span>
                      {/*<span><i className="material-icons cyan-text text-darken-2">store</i> Project Manager</span>*/}
                   </p>
                   <p><i className="material-icons cyan-text text-darken-2">store</i>{this.state.user.email}</p>
			    </div>
			 </div>
			
		)
	}
}

/****************************************************************************************/

class ProfileInfoViewer extends Reflux.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<table style={{display: 'block', width: '100%'}}>
			<tbody>
			{
				this.props.children
			}
			</tbody>
		</table>)
	}
}

class ProfileInfoElement extends Reflux.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<tr>
			<td style={{whiteSpace: 'nowrap', padding: '0.5rem 0.5rem'}}>
				<i className="material-icons cyan-text text-darken-2">{this.props.iconName}</i>
			</td>
			<td style={{whiteSpace: 'nowrap', padding: '0.5rem 0.5rem'}}>{this.props.name}</td>
			<td style={{whiteSpace: 'nowrap', padding: '0.5rem 0.5rem'}}>{this.props.value}</td>
		</tr>)
	}
}

class Profile extends Reflux.Component {
	constructor(props) {
        super(props);

		this.stores = [AccountStore];
    }

	/*render() {
		return(
		<div className="container">
			<h3>Perfil {this.state.user.name}</h3>
		</div>);
	}*/
	render() {
		console.log(this.state.user);
		return(
		<div style={{padding: '0rem 0.5rem'}}>
			<div className="card blue-grey lighten-4">
				<div className="row">
					<div className="col s12">
						<h6 style={{fontWeight: 'bold', fontSize: '1.4rem'}}>
							{this.state.user.name + ': Perfil'}
						</h6>
					</div>
				</div>
				
			</div>
		<Panel>
			<div className="row">

				<div className="col s12 m3 l3 center-align">
					<img src="/images/profile-pic.jpg" alt="" className="responsive-img z-depth-3" 
						style={{maxWidth: '100%', height: 'auto' , borderRadius: '2%'}}/>
				</div>

				<div className="col s12 m9 l9">
					<h6 style={{fontWeight: 'bold', fontSize: '1.2rem'}}>
						Información de contacto
					</h6>
					<div className="row">
						<div className="col s12 m10 l8">
							<ProfileInfoViewer>
								<ProfileInfoElement name="Correo electrónico:" value={this.state.user.email} iconName="email"/>
								<ProfileInfoElement name="Sitio web:" value="" iconName="web"/>
								<ProfileInfoElement name="Teléfono:" value="" iconName="phone"/>
							</ProfileInfoViewer>
						</div>
					</div>

					<h6 style={{fontWeight: 'bold', fontSize: '1.2rem'}}>
						Información general
					</h6>
					<div className="row">
						<div className="col s12 m10 l8">
							<ProfileInfoViewer>
								<ProfileInfoElement name="Nombre de usuario:" value={this.state.user.name} iconName="face"/>
								<ProfileInfoElement name="Nombre completo:" value="" iconName="person"/>
							</ProfileInfoViewer>
						</div>
					</div>

					<h6 style={{fontWeight: 'bold', fontSize: '1.2rem'}}>
						Información adicional
					</h6>
					<div className="row">
						<div className="col s12 m10 l8">
							<ProfileInfoViewer>
								<ProfileInfoElement name="Fecha de nacimiento:" value="" iconName="perm_contact_calendar"/>
							</ProfileInfoViewer>
						</div>
					</div>
				</div>
			</div>
		</Panel>
		</div>)
	}
}

/****************************************************************************************/

class UserCompanies extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			companies: []
		}

		this.stores = [AccountStore];
    }

	componentWillMount() {
		super.componentWillMount();

		AccountActions.companies((err, res)=>{
			if(err){
				//console.log('ERR', err);
			}else{
				//console.log('RES', res);
				this.setState({companies: res.companies});
			}
		});
	}

	render() {
		return(
		<div style={{padding: '0rem 0.5rem'}}>
			<div className="card blue-grey lighten-4">
				<div className="row">
					<div className="col s12">
						<h6 style={{fontWeight: 'bold', fontSize: '1.4rem'}}>
							{'Mis empresas'}
						</h6>
					</div>
				</div>
			</div>
				<div className="row">
					<ul className="collection">
						{
							this.state.companies.map((company, i)=>{
								return (
								<li className="collection-item avatar" key={i}>
									<i className="material-icons circle">folder</i>
									<span className="title">{company.name}</span>
									<p>
										<a href={'/empresa/'+company.uniqueName}>{'Ir a la página de inicio de '+company.name}</a>
										<br/>
										<a href={'/empresa/'+company.uniqueName+'/adm'}>{'Ir a la pagina de administración de '+company.name}</a>
										{/*<a className="secondary-content">
											<i className="material-icons">send</i>
										</a>*/}
									</p>
								</li>)
							})
						}
						{/*<li className="collection-item dismissable">
							<div>
								Tabletec
								<a className="secondary-content">
									<i className="material-icons">send</i>
								</a>
							</div>
						</li>
						<li className="collection-item dismissable">
							<div>
								Tektable
								<a className="secondary-content">
									<i className="material-icons">send</i>
								</a>
							</div>
						</li>*/}
					</ul>
				</div>
		</div>)
	}
}

/****************************************************************************************/

class AccountApp extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [AccountStore];
    }

	componentDidMount() {
		this.onAuthenticate();
		//console.log('componentDidUpdate', localStorage);
		//console.log('componentDidUpdate', sessionStorage);
	}

	componentDidUpdate() {
		//console.log('componentDidUpdate');
		//this.onAuthenticate();
	}

	onAuthenticate() {
		AccountActions.authenticate((err, res)=>{
			if(err){
				let msg = (err.response && err.response.message) ? err.response.message : 'Error del servidor' + err;
				this.refs.messageModal.show({
					type: 'error', title: 'Error', message: 'ERROR ' + err.status + ' - ' + msg
				});
			}else if(res && res.user){
				AccountActions.loadSideMenuItems();
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
				<Sidenav user={this.state.user} items={this.state.sideMenuItems}/>
				<Navbar user={this.state.user} useSideMenu={true} onLogout={this.onLogout.bind(this)}/>
			</header>
			<main>
			{
				this.state.user ?
				this.props.children :
				null
			}
				<MessageModal ref="messageModal"/>
			</main>
			{/*<footer>
			</footer>*/}
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
				<AccountApp>
					<Route exact={true} path="/cuenta" component={Welcome}/>
					<Route exact={true} path="/cuenta/perfil" component={Profile}/>
					<Route exact={true} path="/cuenta/empresas" component={UserCompanies}/>
				</AccountApp>
			</BrowserRouter>,
			this._mainSection);
	}
}

var app = new App();
