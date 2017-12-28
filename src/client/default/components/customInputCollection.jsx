
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

const React = require('react');

const Input = require('../components/input.jsx');

/****************************************************************************************/

class MutantInput extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
			mutantField: null
		}
    }

	onMutantChange(pair, callback) {
		var activatorText = pair.name;
		var mutantField = null;

		switch(activatorText){
		case 'Medidas':
			var mutantName = 'Volumen';
			var mutantValue = this.calculateVolume(pair.value) + ' m³';
			mutantField = this.renderMutant(mutantName, mutantValue);
			callback({primary: pair, secondary: {name: mutantName, value: mutantValue}});
			break;

		default:
			callback({primary: pair});
			break;
		}

		this.setState({mutantField});
	}

	calculateVolume(text) {
		
		var arr = text.split(/\s*x\s*/, 3);

		if(arr.length === 3){
			try{
				var n1 = this.parseFloatIS(arr[0]);
				var n2 = this.parseFloatIS(arr[1]);
				var n3 = this.parseFloatIS(arr[2]);
				var nr = n1 * n2 * n3;
				return Number((nr).toFixed(3));
			}catch(e){
				return 'N';
			}
		}else{
			return 'N';
		}
	}

	parseFloatIS(text) {
		var float = parseFloat(text);
		var unit = text.replace(/[^a-z]/gi, '');

		if(isNaN(float)){
			throw 'Error';
		}else{
			switch(unit){
			case 'mm': return float * 0.001;
			case 'cm': return float * 0.01;
			case 'm': return float;
			default: throw 'Error';
			}
		}
	}

	renderMutant(name, value) {
		return (
		<div className="row no-margin">
			<div className="input-field col s6">
				<input className="validate" id="mutantFieldName" type="text" readOnly value={name}
						style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
				<label htmlFor="mutantFieldName">Nombre</label>
			</div>
			<div className="input-field col s6">
				<input className="validate" id="mutantFieldValue" type="text" readOnly value={value}
						style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
				<label htmlFor="mutantFieldValue">Valor</label>
			</div>
		</div>)
	}
}

class CustomInput extends MutantInput {
	constructor(props) {
        super(props);
    }

	componentDidMount() {
    	this.setValues(this.props.name, this.props.value);
    }
    componentDidUpdate() {
		this.setValues(this.props.name, this.props.value);	
    }

	setValues(name, value) {
		console.log(name, value);
    	if(name){
			this.refs.fieldName.value(name);
		}
		if(value) {
			this.refs.fieldValue.value(value);
		}
    }

	onFocus() {
		this.props.onFocus(this.props.id);
	}

	onBlur() {
		this.props.onBlur(this.props.id);
	}

	onChange(values) {
		this.props.onChange(this.props.id, values);
	}

	onChangeBeforeMutate() {
		var pair = {
			name: this.refs.fieldName.value(),
			value: this.refs.fieldValue.value()
		}
		this.onMutantChange(pair, this.onChange.bind(this));
	}

	render() {
		return(
		<div>
			<div className="row no-margin">
				<Input ref="fieldName" name={'fieldName' + this.props.id} className="col s6" type="text"
					label={'Nombre'} placeholder="Nombre del campo" required={true}
					onChange={this.onChangeBeforeMutate.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}/>
				<Input ref="fieldValue" name={'fieldValue' + this.props.id} className="col s6" type="text"
					label={'Valor'} placeholder="Valor del campo" required={true}
					onChange={this.onChangeBeforeMutate.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}/>
			
				
			</div>
			{ this.state.mutantField }
		</div>)
	}
}

module.exports = class CustomInputCollection extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
			fields: [],
			fieldsValues: {},
			deleteStatus: 'disabled'
		}

		this._selectedFieldKey = null;
		this._delete = false;
		this._keyhist = Math.floor((Math.random() * 100000) + 1);
    }

	componentDidUpdate() {
		Materialize.updateTextFields();
	}

	values() {
		return $.map(this.state.fieldsValues, function(value, index) {
			if(value.secondary){
				return [value.primary, value.secondary];
			}else{
				return [value.primary];
			}
		});
	}

	insert(field) {
		//if(field.editable)
			this.onInsertField(field.name, field.value);
	}

	onFieldFocus(fieldKey) {
		this._selectedFieldKey = fieldKey;
		this.setState({deleteStatus: ''});
	}

	onFieldBlur(fieldKey) {
		var self = this;

		this._selectedFieldKey = null;
		setTimeout(function(){
			if(!self._selectedFieldKey){
				if(self._delete){
					self.onDeleteField(fieldKey);
				}else{
					self.setState({deleteStatus: 'disabled'});
				}
			}
		}, 100);
	}

	onInsertField(name, value) {
		let iname = (name && (typeof name === 'string')) ? name : '',
			ivalue = (value && (typeof value === 'string')) ? value : '',
			
			aps = this.state.fields,
			key = this._keyhist++;
		aps.push(
			<CustomInput key={key} id={key} name={iname} value={ivalue} onChange={this.onFieldChange.bind(this)}
				onFocus={this.onFieldFocus.bind(this)} onBlur={this.onFieldBlur.bind(this)}/>
		);
		this.setState({fields: aps});
		
		if(this.props.onInsertOrDeleteField){
			this.props.onInsertOrDeleteField();
		}
	}

	onDeleteField(fieldId) {
		var fields = this.state.fields;
		var index = -1;
		fields.find(function(e, i){
			if(e.props.id === fieldId){
				index = i; return true;
			}
			return false;
		});

		if(index >= 0){
			fields.splice(index, 1);
		}

		this._delete = false;

		var newFieldsValues = this.state.fieldsValues;
		delete newFieldsValues[fieldId];

		this.setState({fields, fieldsValues: newFieldsValues, deleteStatus: 'disabled'});
		
		if(this.props.onInsertOrDeleteField){
			this.props.onInsertOrDeleteField();
		}
	}

	onNeedDeleteField() {
		this._delete = true;
	}

	onFieldChange(fieldId, values) {
		var newFieldsValues = this.state.fieldsValues;
		newFieldsValues[fieldId] = values;
		
		this.setState({fieldsValues: newFieldsValues});
	}

	render() {
		return(
		<div>
			{this.props.children}

			<div className="row">
				{this.state.fields}
			</div>
			<div className="row">
				<div className="col s6" style={{padding: '0rem 0.5rem'}}>
					<button className="btn waves-effect waves-light blue-grey darken-1" type="button"
						onClick={this.onInsertField.bind(this)} style={{textTransform: 'none', fontWeight: 'bold', padding: '0rem 0.5rem', width: '100%'}}>
						<i className="material-icons right">add</i>Añadir campo
					</button>
				</div>
				<div className="col s6" style={{padding: '0rem 0.5rem'}}>
					<button className={'btn waves-effect waves-light blue-grey darken-1 ' + this.state.deleteStatus} type="button"
						onClick={this.onNeedDeleteField.bind(this)} style={{textTransform: 'none', fontWeight: 'bold', padding: '0rem 0.5rem', width: '100%'}}>
						<i className="material-icons right">delete</i>Eliminar campo
					</button>
				</div>
			</div>
		</div>)
	}
}
