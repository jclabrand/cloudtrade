
import React from 'react';
import ReactDOM from'react-dom';
import Reflux from 'reflux';

import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from '../components/navbar.jsx';

import { AccountActions, AccountStore } from '../flux/account';


class TabletecHome extends React.Component {
	constructor(props) {
        super(props);
    }

    componentDidMount() {
    	$('.parallax').parallax();
    }

	render() {
		return(
			<div>
			<header>
				<div className="center-align"><img src="/images/tabletecbanner.jpg" alt="tabletec" className="responsive-img"/></div>
			</header>
			<section>
				<div className="container">
					<div className="section">
					  <div className="row">
					    <div className="col s12 center">
					      <h3><i className="mdi-content-send brown-text"></i></h3>
					      <h5 style={{ textShadow:' 1px 1px 1px #999'}}>NOSOTROS</h5>
					      <h6 className="center-align" >Es una empresa dedicada a la comercialización de tableros melaminicos, aglomerados, multilaminados , MDF y todo insumos para la fabricación de muebles</h6>
					    </div>
					  </div>
					</div>
				</div>
			</section>

			<section>
				<div className="parallax-container valign-wrapper">
					<div className="section no-pad-bot">
					  <div className="container">
					    {/*<div className="row center">
					      <h5 className="header col s12 light">A modern responsive front-end framework based on Material Design</h5>
					    </div>*/}
					  </div>
					</div>
					<div className="parallax"><img src="/images/tabletecImage1.jpg" alt="Unsplashed background img 2"/></div>
				</div>
			</section>

			<section className="grey">
				<div className="container ">
					<div className="section">
					  <div className="row">
					    <div className="col s12 center">
					      <h3><i className="mdi-content-send brown-text"></i></h3>
					      <h5 className="white-text" style={{ textShadow:' 1px 1px 1px #000'}}>SERVICIOS</h5>
					      <p className="center-align white-text ">xxxxxx</p>
					    </div>
					  </div>
					</div>
				</div>
			</section>

			<section style={{ background:'#f2eee7'}}>
				{/*<div className="row center">
				   	<h5 className="header col s12 light">Encuentranos aqui </h5>
				</div>*/}
				<div className="center-align" ><img src="/images/tabletecMap.jpg" alt="tabletec" className="responsive-img"/></div>
			</section>

			<footer className="page-footer red darken-4">
				<div className="container">
					<div className="row">
						<div className="col s8 offset-s4">
						  <h5 className="white-text" style={{ textShadow:' 1px 1px 1px #000'}}>Contáctanos</h5>
						  <h6 className="grey-text text-lighten-4">Teléfono: 4 6441156</h6>
						  <h6 className="grey-text text-lighten-4">Dirección: Av. German Busch # 738 Ciudad Sucre, Chuquisaca, Bolivia</h6>
						  <h6 className="grey-text text-lighten-4">Messenger: @tabletecinsumosparaelmueble</h6>
						</div>
					</div>
				</div>
				<div className="footer-copyright">
					  <div className="container">
					  Made by <a className="brown-text text-lighten-3" href="/">cloudtrade</a>
					  </div>
				</div>
			</footer>
		</div>
		)
	}
}

class Tabletec extends Reflux.Component {
		constructor(props) {
			super(props);

			/*this.state = {
			authorized: false
			}*/

		this.stores = [AccountStore];
		}

		componentWillMount() {
			super.componentWillMount();

			AccountActions.authenticate((err, res)=>{
				if(err){
					//window.location.replace('/login');
				}else if(res && res.user){
					//this.setState({authorized: true});
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
				<Navbar user={this.state.user} onLogout={this.onLogout.bind(this)}/>
			</header>
			<main>
				{ this.props.children }
			</main>
			{/*<footer>
			</footer>*/}
		</div>
		)
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
				<Tabletec>
					<Route exact={true} path="/empresa/:tabletec" component={TabletecHome}/>
				</Tabletec>
			</BrowserRouter>,
			this._mainSection);
	}
}

var app = new App();