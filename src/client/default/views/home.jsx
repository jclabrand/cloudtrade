
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';
import Reflux from 'reflux';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from '../components/navbar.jsx';

import { AccountActions, AccountStore } from '../flux/account';

/****************************************************************************************/

class Home extends React.Component {
	constructor(props) {
        super(props);
    }

	componentDidMount() {
		$('.parallax').parallax();
	}

	render() {
		return(
		<div>
			<div id="index-banner" className="parallax-container">
				<div className="section no-pad-bot">
					<div className="container">
						<br/><br/>
						<h1 className="header center teal-text text-lighten-2"><br/></h1>
						<div className="row center">
							<h5 className="header col s12 light">Somos un grupo de profesionales que amamos lo que hacemos, aquí puede ver nuestros servicios</h5>
						</div>
						<div className="row center">
							<a href="/registro" id="download-button" className="btn-large waves-effect waves-light red darken-4">Registrarse</a>
						</div>
						<br/><br/>
					</div>
				</div>
				<div className="parallax">
					<img src="/images/background1.jpg" alt="Unsplashed background img 1"/>
				</div>
			</div>

			<div className="container">
				<div className="section">
					<div className="row">
						<div className="col s12 center">
							<h3><i className="mdi-content-send brown-text"></i></h3>
							<h4>NOSOTROS</h4>
							<p className="left-align light">En cloudtrade, Ofrecemos soluciones informáticas para cada proyecto en cualquier plataforma, nuestras soluciones son full stack. Estamos orgullosos de nuestro trabajo y todo lo que creamos se ejecuta profesionalismo y dedicación poniendo al cliente siempre por delante.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="parallax-container valign-wrapper">
				<div className="section no-pad-bot">
					<div className="container">
						<div className="row center">
							<h5 className="header col s12 light">A modern responsive front-end framework based on Material Design</h5>
						</div>
					</div>
				</div>
				<div className="parallax">
					<img src="/images/background2.jpeg" alt="Unsplashed background img 2"/>
				</div>
			</div>

			<div className="container">
				<div className="section">

					<div className="row">
						<div className="col s12 center">
							<h3><i className="mdi-content-send brown-text"></i></h3>
							<h4>SERVICIOS</h4>
							<p className="left-align light">Nuestros servicios son toda una variedad de soluciones informáticas Full Stack. Te invitamos a ver nuestra lista de servicios para tener una idea general de lo que somos capaces de realizar. asegúrese de ver nuestro portafolio para prueba de nuestra genialidad.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="section">

					<div className="row">
						<div className="col s12 m4">
							<div className="icon-block">
								<h2 className="center red-text"><i className="material-icons">flash_on</i></h2>
								<h5 className="center">Software a Medida</h5>

								<p className="light">Desarrollamos el programa de gestión que necesite tu negocio, aportando una solución personalizada. </p>
							</div>
						</div>

						<div className="col s12 m4">
							<div className="icon-block">
								<h2 className="center red-text"><i className="material-icons">group</i></h2>
								<h5 className="center">Servicio Web Integral</h5>

								<p className="light">Diseño de páginas web a la medida, diseño profesional, claro y moderno.</p>
							</div>
						</div>

						<div className="col s12 m4">
							<div className="icon-block">
								<h2 className="center red-text"><i className="material-icons">settings</i></h2>
								<h5 className="center">Diseño Web Responsivo</h5>

								<p className="light">Realizamos sitios web modernos y funcionales, utilizando las últimas tecnologías y tendencias.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="parallax-container valign-wrapper">
				<div className="section no-pad-bot">
					<div className="container">
						<div className="row center">
							<h5 className="header col s12 light">A modern responsive front-end framework based on Material Design</h5>
						</div>
					</div>
				</div>
				<div className="parallax">
					<img src="/images/background3.jpeg" alt="Unsplashed background img 3"/>
				</div>
			</div>

		</div>)
	}
}

class HomeApp extends Reflux.Component {
	constructor(props) {
        super(props);

		this.stores = [AccountStore];
	}

	componentDidMount() {
		this.onAuthenticate();
	}

	onAuthenticate() {
		AccountActions.authenticate((err, res)=>{
			console.log(err, res);
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
				<Navbar user={this.state.user} onLogout={this.onLogout.bind(this)}/>
			</header>
			<main>
				{ this.props.children }
			</main>
			<footer className="page-footer grey darken-3">
				<div className="container">
					<div className="row">
						<div className="col l6 s12">
							<h5 className="white-text">Contáctanos</h5>
							<p className="grey-text text-lighten-4">Teléfono: +591 73430013</p>
						</div>

					</div>
				</div>
				<div className="footer-copyright">
					<div className="container">
					Made by <a className="brown-text text-lighten-3" href="#">cloudtrade</a>
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
				<HomeApp>
					<Route exact={true} path="/" component={Home}/>
				</HomeApp>
			</BrowserRouter>,
			this._mainSection);
	}
}

var app = new App();
