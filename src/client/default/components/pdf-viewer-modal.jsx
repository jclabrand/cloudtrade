
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import PDFObject from 'pdfobject';

/****************************************************************************************/

class PdfViewerModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			docURL: ''
		};
	}

	setDoc(url) {
		this.setState({docURL: url});
	}

	open() {
		PDFObject.embed(this.state.docURL, this.refs.viewer);
		this.refs.modal.setAttribute('style', 'position: fixed;left: 0%;top: 0%;width: 100%;height: 100%;background-color: rgba(10, 10, 10, 0.6);z-index: 1000;');
	}

	close() {
		this.refs.modal.setAttribute('style', 'display: none;');
	}

	supports() {
		return PDFObject.supportsPDFs;
	}

	render() {
		return (
			<div ref="modal" style={{display: 'none'}}>
				<div>
					<button className="btn waves-effect waves-light red darken-2" type="button"
						style={{textTransform: 'none', fontWeight: 'bold', marginBottom: '1rem', float: 'right'}}
						onClick={this.close.bind(this)}>
						Cerrar
						<i className="material-icons right">close</i>
					</button>
				</div>
				<div ref="viewer" style={{margin: '4%', height: '90%'}}></div>
			</div>
		);
	}
}

module.exports = PdfViewerModal;
