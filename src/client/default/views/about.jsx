
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

/****************************************************************************************/

class About extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className="container">
			<div className="row">
				<h5>Acerca de CloudTrade</h5>
				<p>Copyright (c) 2016-2017, CloudTrade</p>
			</div>
		</div>)
	}
}

class Conditions extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className="container">
			<div className="row">
				<h5>Condiciones de servicio de CloudTrade</h5>
				<p>Última modificación: 23 de mayo de 2017</p>
				<h6 style={{display:'inline', fontWeight: 'bold', fontSize: '1.2rem'}}>
					Te damos la bienvenida a CloudTrade
				</h6>
				<p>Te agradecemos que uses los productos y los servicios de Google (en adelante, los «Servicios»). Los Servicios se proporcionan a través de Google Inc. (en adelante, «Google»), cuyo domicilio social está ubicado en 1600 Amphitheatre Parkway, Mountain View, CA 94043, Estados Unidos.</p>
				<p>El uso de nuestros Servicios implica la aceptación de estas condiciones. Te recomendamos que las leas detenidamente.</p>
				<p>Nuestros Servicios son muy diversos, por lo que en ocasiones se pueden aplicar condiciones o requisitos de productos adicionales (incluidas restricciones de edad). Las condiciones adicionales estarán disponibles junto con los Servicios pertinentes y formarán parte del acuerdo que estableces con Google al usar nuestros servicios.</p>
				
				
				<h6 style={{display:'inline', fontWeight: 'bold', fontSize: '1.2rem'}}>
					Uso de nuestros Servicios
				</h6>
				<p>Debes seguir las políticas disponibles a través de los Servicios.</p>
				<p>No debes usar nuestros Servicios de forma inadecuada. Por ejemplo, no debes interferir con dichos Servicios ni intentar acceder a ellos usando un método distinto a la interfaz y a las instrucciones proporcionadas por Google. Solo podrás usar los Servicios en la medida en que la ley lo permita, incluidas las leyes y las normativas de control de las exportaciones y de las reexportaciones que estén en vigor. Podemos suspender o cancelar nuestros Servicios si no cumples con nuestras políticas o condiciones o si consideramos que tu conducta puede ser malintencionada.</p>

			</div>
		</div>)
	}
}

class DataPolicy extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className="container">
			<div className="row">
				<h5>Política de datos del servicio de CloudTrade</h5>
				<p>Última modificación: 23 de mayo de 2017</p>

				<h6 style={{display:'inline', fontWeight: 'bold', fontSize: '1.2rem'}}>
					POLÍTICA DE PRIVACIDAD
				</h6>
				<p>El presente Política de Privacidad establece los términos en que CloudTrade usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.</p>

				<h6 style={{display:'inline', fontWeight: 'bold', fontSize: '1.2rem'}}>
					Información que es recogida
				</h6>
				<p>Nuestro sitio web podrá recoger información personal por ejemplo: Nombre, información de contacto como  su dirección de correo electrónica e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.</p>

				<h6 style={{display:'inline', fontWeight: 'bold', fontSize: '1.2rem'}}>
					Uso de la información recogida
				</h6>
				<p>Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios.  Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.</p>
				<p>CloudTrade está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.</p>

			</div>
		</div>)
	}
}

/****************************************************************************************/

class AboutApp extends React.Component {
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
				<div className="blue-grey darken-1">
					<div className="container">
						<div className="center" style={{padding: '2.2rem 0rem'}}>
							<img src="/images/cloudtrade-logo.png"/>
						</div>
					</div>
				</div>
				{ this.props.children }
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
		this.render();
	}

	render() {
		ReactDOM.render(
			<BrowserRouter>
				<AboutApp>
					<Route exact={true} path="/acerca-de" component={About}/>
					<Route exact={true} path="/acerca-de/condiciones" component={Conditions}/>
					<Route exact={true} path="/acerca-de/politica-de-datos" component={DataPolicy}/>
				</AboutApp>
			</BrowserRouter>,
			this._mainSection);
	}
}

var app = new App();
