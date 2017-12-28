
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';
import Reflux from 'reflux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Randomstring from "randomstring";
import Recaptcha from 'react-recaptcha';

import { SignupActions, SignupStore } from '../flux/signup';
import { AccountActions, AccountStore } from '../flux/account';

import Navbar from '../components/navbar.jsx';
import Form from '../components/form.jsx';
import Input from '../components/input.jsx';
//import FileUpload from '../components/file-upload.jsx';
import MessageModal from '../components/modal.jsx';
import Preloader from '../components/preloader.jsx';

/****************************************************************************************/

class StepPanel extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className="row">
			<div className="col s12 m8 l6 offset-m2 offset-l3" style={{padding: '0rem'}}>
				<div className="card">
					<div className="card-content" style={{padding: '1.4rem 2.4rem'}}>
					{
						this.props.children
					}
					</div>
				</div>
			</div>
		</div>)
	}
}

class StepButton extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<button className="btn" type="submit" 
			style={{textTransform: 'none', backgroundColor: 'rgba(0, 0, 0, 0)', border: '0.05rem solid #0d47a1', color: '#0d47a1', boxShadow: '0rem 0rem'}}>
			{ this.props.children }
		</button>)
	}
}



class Login extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			ready: false
		}

		this.stores = [AccountStore];

		this._formValidationRules = {
			rules: {
				userPass: { required: true },
				email: { required: true, email: true }
			},
			messages: {
				userPass: {
					required: 'Debes ingresar una contraseña'
				},
				email: {
					required: 'Debes ingresar un email',
					email: 'Por favor, introduzca una dirección email válida'
				}
			}
		}
    }

	componentDidMount() {
		AccountActions.authenticate((err, res)=>{
			if(res && res.user){
				window.location.replace('/cuenta');
			}else{
				this.setState({ready: true});
			}
		});
	}

	componentDidUpdate() {
		Materialize.updateTextFields();
	}

	onFormSubmit() {
		let data = {
			email: this.refs.email.value(),
			password: this.refs.userPass.value()
		}

		this.refs.messageModal.show({
			type: 'process', title: 'Enviando...', message: 'Espere mientras se envian sus datos'
		});

		AccountActions.login(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show({
					type: 'error', title: 'Error', message: 'ERROR ' + err.status + ' - ' + err.response.message
				});
			}else if(res && res.token){
				this.refs.messageModal.close();

				localStorage.setItem('authorization', res.token);
				window.location.replace('/cuenta');
			}
		});
	}

	render() {
		return this.state.ready ? (
		<StepPanel>
			<div className="row center-align">
				<h5>Iniciar sesión</h5>

				<img className="responsive-img" src="/images/add-resource-icon-128.png"/>
			</div>

			<Form rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div className="row">
					<Input ref="email" name="email" className="col s12" type="email"
						label="Email" placeholder="Email" iconName="email" required={true}/>
					
					<Input ref="userPass" name="userPass" className="col s12" type="password"
						label="Ingresa tu contraseña" placeholder="Ingresa tu contraseña" iconName="lock" required={true}/>
				</div>
				<div className="row center-align" style={{margin: '0rem', paddingTop: '1rem'}}>
					<StepButton>
						Iniciar sesión
					</StepButton>
				</div>
			</Form>

			<div className="row center-align">
				<span style={{paddingRight: '0.5rem'}}>Eres nuevo en CloudTrade?</span>
				<Link to="/registro">
					Registrate
				</Link>
			</div>

			<MessageModal ref="messageModal"/>
		</StepPanel>) : null;
	}
}

class Welcome extends React.Component {
	constructor(props) {
        super(props);
    }

	componentDidMount() {
		//localStorage.removeItem('regStep');
		//localStorage.removeItem('regUser');
	}

	onFormSubmit() {
		let to = '/registro/crear-cuenta/' +
				Randomstring.generate(8) + '-' +
				Randomstring.generate(4) + '-' +
				Randomstring.generate(4) + '-' +
				Randomstring.generate(8);
		this.props.history.push(to);
	}

	render() {
		return(
		<StepPanel>
			<div className="row center-align">
				<h5>Registrate gratis</h5>
				<span>Administra los datos de tu empresa, productos, inventarios y mucho más, de manera fácil y rápida.</span>
				<img className="responsive-img" src="/images/OBA-Icon-Grey-230x230.png"/>
			</div>

			<Form onSubmit={this.onFormSubmit.bind(this)}>
				<div className="row center-align">
					<StepButton>
						Continuar
					</StepButton>
				</div>
			</Form>
		</StepPanel>)
	}
}

class CreateAccount extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			captcha: null,
			captchaValidated: false,
			rpk: null
		}

		this.stores = [SignupStore];

		this._formValidationRules = {
			rules: {
				email: { required: true, email: true }
			},
			messages: {
				email: {
					required: 'Debes ingresar un email',
					email: 'Por favor, introduzca una dirección email válida'
				}
			}
		}
    }

	componentDidMount() {
		this.updateAccountStatus();
		Materialize.updateTextFields();
	}

	componentDidUpdate() {
		this.updateAccountStatus();
		Materialize.updateTextFields();
	}

	updateAccountStatus() {
		let hash = this.props.match.params.accountHash;
		SignupActions.getAccountStatus(hash, this.props.history, (err0, res0)=>{
			if(err0){
				console.log(err0);
			}else if(res0.status === 'hashed'){
				SignupActions.getRecaptchaPublicKey((err1, res1)=>{
					if(err1){
						console.log(err1);
					}
					else if(res1){
						this.setState({rpk: res1.rpk});
					}
				});
			}else{
				this.props.history.push('/registro');
			}
		});
	}

	onFormSubmit() {
		if(this.state.captchaValidated){
			let hash = this.props.match.params.accountHash,
				history = this.props.history,
				to = '/registro/verificar/' + hash;

			var data = {
				hash,
				name: this.refs.userName.value(),
				email: this.refs.email.value(),
				recaptcha: this.state.captcha
			}

			this.refs.messageModal.show({
				type: 'process', title: 'Enviando...', message: 'Espere mientras se envian sus datos'
			});

			SignupActions.createAccount(data, (err, res)=>{
				if(err){
					this.refs.messageModal.show({
						type: 'error', title: 'Error', message: 'ERROR ' + err.status + ' - ' + err.response.message
					});
				}else if(res){
					this.refs.messageModal.close();
					history.push(to);
				}
			});
		}
	}

	onRecaptchaLoad() {
	}

	onRecaptchaVerify(response) {
		this.setState({captcha: response, captchaValidated: true});
	}

	onRecaptchaExpires() {
		this.setState({captchaValidated: false});
	}

	render() {
		return (
		<StepPanel>
			<div className="row center-align">
				<h5>Registrate gratis</h5>
				<h6>Ingresa tus datos para continuar</h6>
				<img className="responsive-img" src="/images/add-resource-icon-128.png"/>
			</div>
				<Form rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
					<div className="row">
						<Input ref="userName" name="userName" className="col s12" type="text"
							label="Tu nombre completo" placeholder="Tu nombre completo" iconName="account_circle" required={true}/>

						<Input ref="email" name="email" className="col s12" type="email"
							label="Email" placeholder="Email" iconName="email" required={true}/>

						{
							/*<Input ref="companyName" name="companyName" className="col s12" type="text"
							label="Nombre de tu empresa" placeholder="Nombre de tu empresa" iconName="account_balance" required={true}/>*/
						}
					</div>
					{
						this.state.rpk ?
						<div className="row center-align">
							<div style={{transform:'scale(0.95)', transformOrigin:'0 0', display: 'table', margin: '0 auto'}}>
								<Recaptcha
									sitekey={this.state.rpk}
									render="explicit"
									onloadCallback={this.onRecaptchaLoad.bind(this)}
									verifyCallback={this.onRecaptchaVerify.bind(this)}
									expiredCallback={this.onRecaptchaExpires.bind(this)}
									/>
							</div>
						</div> :
						<div className="row center-align">
							<Preloader/>
						</div>
					}
					<div className="row center-align">
						<span>
							Al hacer clic en "Crear cuenta", aceptas las <a href="/acerca-de/condiciones" target="_blank">Condiciones</a> y confirmas que leíste nuestra <a href="/acerca-de/politica-de-datos" target="_blank">Política de datos</a>
						</span>
					</div>
					<div className="row center-align" style={{margin: '0rem', paddingTop: '1rem'}}>
						<StepButton>
							Crear cuenta
						</StepButton>
					</div>
				</Form>
			<MessageModal ref="messageModal"/>
		</StepPanel>)
	}
}

class VerifyAccount extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			email: null
		}

		this.stores = [SignupStore];
    }

	componentDidMount() {
		this.updateAccountStatus();
	}

	updateAccountStatus() {
		let hash = this.props.match.params.accountHash;
		SignupActions.getAccountStatus(hash, this.props.history, (err0, res0)=>{
			if(err0){
				console.log(err0);
			}else if(res0.status === 'sigup-posted'){
				SignupActions.getAccountSignupEmail(hash, (err1, res1)=>{
					if(err1){
						console.log('VERIFY ERROR', err1)
					}else if(res1){
						this.setState({email: res1.email});
					}
				});
			}else{
				this.props.history.push('/registro');
			}
		});
	}

	render() {
		return (
		<StepPanel>
		{
			this.state.email ?
			<div>
				<div className="row">
					<h6 style={{fontWeight: 'bold', fontSize: '1.2rem'}}>
						Confirma tu dirección de correo electrónico
					</h6>
				</div>
				<div className="row">
					<p>Gracias por unirte a CloudTrade. Acabamos de enviarte un mensaje de confirmación a {this.state.email}.</p>
				</div>
				<div className="row">
					<p>Haz clic en el enlace de confirmación del mensaje para completar tu registro.</p>
				</div>
			</div> :
			<div className="row center-align">
				<Preloader/>
			</div>
		}
		</StepPanel>)
	}
}

class Finish extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			authorized: false
		}

		this.stores = [SignupStore];

		this._formValidationRules = {
			rules: {
				userPass: { required: true, minlength: 6 },
				userPassAgain: { equalTo: '#userPass' }
			},
			messages: {
				userPass: {
					required: 'Debes ingresar una contraseña',
					minlength: 'Debe ingresar almenos 6 caracteres'
				},
				userPassAgain: {
					required: 'Debes ingresar una contraseña',
					equalTo: 'Vuelva a ingresar su contraseña'
				}
			}
		}
    }

	componentDidMount() {
		this.updateAccountStatus();
		Materialize.updateTextFields();

		/*let hash = this.props.match.params.accountHash;

		SignupActions.getAccountStatus(hash, (err, res)=>{
			if(err){
				console.log(err);
			}
			else if(res){
				switch(res.status){
				case 'hashed':
					this.props.history.push('/registro/crear-cuenta/' + hash);
					break;
				case 'sigup-posted':
					this.props.history.push('/registro/verificar/' + hash);
					break;
				case 'sigup-verified':
					//this.props.history.push('/registro/finalizar/' + hash);
					this.setState({authorized: true});
					break;
				case 'sigup-finished':
				case 'loged-out':
					this.props.history.push('/login');
					break;
				case 'loged-in':
					this.props.history.push('/cuenta');
					break;
				default:
					break
				}
			}
		});*/
	}

	componentDidUpdate() {
		this.updateAccountStatus();
		Materialize.updateTextFields();
	}

	updateAccountStatus() {
		let hash = this.props.match.params.accountHash;
		SignupActions.getAccountStatus(hash, this.props.history, (err0, res0)=>{
			if(err0){
				console.log(err0);
			}else if(res0.status === 'sigup-verified'){
				this.setState({authorized: true});
			}else{
				this.props.history.push('/registro');
			}
		});
	}

	onFormSubmit() {
		let hash = this.props.match.params.accountHash;

		var data = {
			hash,
			password: this.refs.userPass.value()
		}

		this.refs.messageModal.show({
			type: 'process', title: 'Enviando...', message: 'Espere mientras se envian sus datos'
		});

		SignupActions.createAccountPassword(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show({
					type: 'error', title: 'Error', message: 'ERROR ' + err.status + ' - ' + err.response.message
				});
			}else if(res.token){
				localStorage.setItem('authorization', res.token);
				this.refs.messageModal.close();
				window.location.replace('/cuenta');
			}
		});
	}

	render() {
		return (
		<StepPanel>
			<div className="row center-align">
				<h5>Finalizar registro</h5>
				<h6>Crea una contrasseña para tu cuenta</h6>
				<img className="responsive-img" src="/images/add-resource-icon-128.png"/>
			</div>
			{
				this.state.authorized ?
				<Form rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
					<div className="row">
						<Input ref="userPass" name="userPass" className="col s12" type="password"
							label="Ingresa una contraseña" placeholder="Ingresa una contraseña" iconName="lock" required={true}/>

						<Input ref="userPassAgain" name="userPassAgain" className="col s12" type="password"
							label="Vuelva a ingresar su contraseña" placeholder="Vuelva a ingresar su contraseña" iconName="vpn_key" required={true}/>
					</div>
					<div className="row center-align" style={{margin: '0rem', paddingTop: '1rem'}}>
						<StepButton>
							Finalizar
						</StepButton>
					</div>
				</Form> :
				<div className="row center-align">
					<Preloader/>
				</div>
			}
			<MessageModal ref="messageModal"/>
		</StepPanel>);
	}
}

class SignupApp extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div>
			{/*<header>
				<Navbar/>
			</header>*/}
			<main>
				<div className="blue-grey darken-1" style={{height: '14rem'}}>
					<div className="container">
						<div className="center" style={{padding: '2.2rem 0rem'}}>
							<img src="/images/cloudtrade-logo.png"/>
						</div>
					{ this.props.children }
					</div>
				</div>
			</main>
			{/*<footer>
			</footer>*/}
		</div>)
	}
}

class App {
	constructor() {
		document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded.bind(this));

		//console.log(window.location);
		/*if (typeof(Storage) !== "undefined") {
			console.log('Code for localStorage/sessionStorage.');
		} else {
			console.log('Sorry! No Web Storage support..');
		}*/
	}

	onDOMContentLoaded() {
		this._mainSection = window.document.getElementById('app-main');

		$.extend($.validator.messages, { required: "Campo obligatorio" });

		this.render();
	}

	render() {
		ReactDOM.render(
			<BrowserRouter>
				<SignupApp>
					<Route exact={true} path="/login" component={Login}/>
					<Route exact={true} path="/registro" component={Welcome}/>
					<Route path="/registro/crear-cuenta/:accountHash" component={CreateAccount}/>
					<Route path="/registro/verificar/:accountHash" component={VerifyAccount}/>
					<Route path="/registro/finalizar/:accountHash" component={Finish}/>
				</SignupApp>
			</BrowserRouter>,
			this._mainSection);
	}
}

var app = new App();
