
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';

/****************************************************************************************/

class NotFound extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (
		<div className="container">
			<div className="row">
				<img src="/images/cloudtrade1.png" alt=""/>
				<h3>No se encontraron resultados</h3>
				<p>La página solicitada no pudo encontrarse. Trate de perfeccionar su búsqueda o utilice la navegación para localizar la entrada.</p>
			</div>
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
			<NotFound/>,
			this._mainSection);
	}
}

var app = new App();
