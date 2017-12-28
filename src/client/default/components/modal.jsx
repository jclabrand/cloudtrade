
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Victor Bedoya.
	For conditions of distribution and use, see copyright notice in license.txt

/****************************************************************************************/

import React from 'react';

import Progress from'./progress.jsx';

/****************************************************************************************/

module.exports = class Modal extends React.Component {
	constructor(props) {
		super(props);

        this.state = {
            type: '',
            title: '',
            message: ''
        }
	}

	componentDidMount() {
		$(this.refs.modal1).modal({
            dismissible: false
        });
        if(this.props.autoOpen){
            this.open();
        }
	}

    componentDidUpdate() {
        if(this.props.autoOpen){
            this.open();
        }
    }

    show(state, msg) {
        let finalState = null;
        switch(typeof state) {
            case 'object':
                finalState = state; break;
            case 'string':
                switch(state){
                    case 'sending':
                        finalState = {
                            type: 'process',
                            title: 'Enviando...',
                            message: 'Espere mientras se envian los datos'
                        };
                        break;
                    case 'success_save':
                        finalState = {
                            type: 'success',
                            title: 'Completado',
                            message: 'Los datos se guardaron correctamente'
                        };
                        break;
                    case 'save_error':
                        finalState = {
                            type: 'error',
                            title: 'Error',
                            message: 'ERROR No se pudieron guardar los datos. ' + msg
                        };
                        break;
                }
        }
        this.setState(finalState);
        $(this.refs.modal1).modal('open');
    }

	open() {
		$(this.refs.modal1).modal('open');
	}

	close() {
		$(this.refs.modal1).modal('close');
	}

	onModalButtonSelect(buttonName) {
		this.props.onModalButtonSelect(buttonName);
	}

	render() {
        var contentBackgroundColor;
        var titleIcon;
        var closeBtn;

        switch(this.state.type){
            case 'error':
                contentBackgroundColor = 'red darken-2';
                titleIcon = 'error';
                closeBtn = (
                    <button className="btn waves-effect waves-light red darken-2"
                        style={{textTransform: 'none'}} onClick={this.close.bind(this)}>
                        Cerrar
                    </button>);
                break;
            case 'process':
                contentBackgroundColor = 'blue-grey darken-1';
                titleIcon = 'swap_horiz';
                closeBtn = (
                    <div className="row">
                        <Progress type="indeterminate"/>
                    </div>);
                break;

            case 'success':
                contentBackgroundColor = 'green darken-3';
                titleIcon = 'done';
                closeBtn = (
                    <button className="btn waves-effect waves-light green darken-3"
                        style={{textTransform: 'none'}} onClick={this.close.bind(this)}>
                        Aceptar
                    </button>)
                break;

            default:
                contentBackgroundColor = 'blue darken-1';
                titleIcon = 'info';
                break;
        }
        //style={{position:'relative',top:'5px'}}
        return (
        <div ref="modal1" className="modal">
            <div className={'modal-content ' + contentBackgroundColor} style={{color: '#f5f5f5'}}>
                <h5>
                    <i className="material-icons" style={{paddingRight: '1rem'}}>
                        {titleIcon}
                    </i>
                    {this.state.title}
                </h5>
                <p>{this.state.message}</p>

                {this.props.children}
            </div>
            <div className="modal-footer" style={{padding:'0 2rem 0 2rem'}}>
                {closeBtn}
            </div>
        </div>)
	}
}
