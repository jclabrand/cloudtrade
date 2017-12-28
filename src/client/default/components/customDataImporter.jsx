/****************************************************************************************

	Copyright (c) 2016-2017, .
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

import Input from '../components/input.jsx';
import Select from '../components/select.jsx';
import { Switch, Case } from '../components/switch.jsx';

/****************************************************************************************/

class CustomImput extends React.Component {
	constructor(props) {
		super(props);
		
	}
	componentDidMount() {
		//this.refs.article.value(this.props.articleDescription);
		//$(this.refs.unit).material_select();
		//this.refs.article.disable();
	}
	componentWillMount() {
	}

	onChange() {
		var val = {
			code: this.props.articleCode,
			/*Artículo: this.refs.article.value(),*/
			
			//Volumen: this.refs.volume.value(),
			
			Cantidad: this.refs.quantity.value(),
			PrecioUnitario: this.refs.unitPrice.value(),
			Unidad: this.refs.unit.value(),
			Observación: this.refs.remark.value(),
		}
		this.props.onChange(this.props.indice, val);
	}

	render() {	
		var color;
		if(this.props.indice % 2==0)
			{color = 'grey lighten-4'}
		return(
		<div>
			<h6 style={{fontWeight: 'bold', padding: '0.5rem 0.5rem'}}>
				{'Elemento ' + (this.props.indice+1) + ': ' + this.props.articleDescription}
			</h6>
			<div className="row no-margin" >
				<Input ref="quantity" name="quantity" placeholder="Cantidad" label="Cantidad" className="col s4" type="text"
					onChange={this.onChange.bind(this)} required={true}/>
				<Input ref="unitPrice" name="unitPrice" placeholder="Precio unitario" label="Precio unitario" className="col s4" type="text"
					onChange={this.onChange.bind(this)} required={true}/>

				<Input ref="unit" name="unit" className="col s4" type="autocomplete"
					label="Unidad" placeholder="Unidad de medida" required={true} onChange={this.onChange.bind(this)}
					options={{data: [{name: "Pieza"}, {name: "Caja"}, {name: "Paquete"}], key: 'name', minLength: 1}}/>
			</div>
			<div className="row no-margin">
				<Input ref="remark" name="remark" className="col s12" type="text" 
					placeholder="Observación" label="Observación"
					onChange={this.onChange.bind(this)}/>
			</div>
		</div>)
	}
}

class CustomImput2 extends React.Component {
	constructor(props) {
		super(props);
		
	}
	componentDidMount() {
		//this.refs.article.value(this.props.articleDescription);
		//$(this.refs.unit).material_select();
		//this.refs.article.disable();
	}
	componentWillMount() {
	}

	onChange() {
		var val = {
			code: this.props.articleCode,
			/*Artículo: this.refs.article.value(),*/
			
			//Volumen: this.refs.volume.value(),
			
			Cantidad: this.refs.quantity.value(),
			PrecioUnitario: this.refs.unitPrice.value(),
			Observación: this.refs.remark.value(),
		}
		this.props.onChange(this.props.indice, val);
	}

	render() {	
		var color;
		if(this.props.indice % 2==0)
			{color = 'grey lighten-4'}
		return(
		<div>
			<h6 style={{fontWeight: 'bold', padding: '0.5rem 0.5rem'}}>
				{'Elemento ' + (this.props.indice+1) + ': ' + this.props.articleDescription}
			</h6>
			<div className="row no-margin" >
				<Input ref="quantity" name="quantity" placeholder="Cantidad" label="Cantidad" className="col s6" type="text"
					onChange={this.onChange.bind(this)} required={true}/>
				<Input ref="unitPrice" name="unitPrice" placeholder="Precio unitario" label="Precio unitario" className="col s6" type="text"
					onChange={this.onChange.bind(this)} required={true}/>
			</div>
			<div className="row no-margin">
				<Input ref="remark" name="remark" className="col s12" type="text" 
					placeholder="Observación" label="Observación"
					onChange={this.onChange.bind(this)}/>
			</div>
		</div>)
	}
}

class CustomImput3 extends React.Component {
	constructor(props) {
		super(props);
		
	}
	componentDidMount() {
	}
	componentWillMount() {
	}

	onChange() {
		var val = {
			code: this.props.article.code,
			quantity: this.refs.quantity.value(),
			remark: this.refs.remark.value(),
		}
		this.props.onChange(this.props.indice, val);
	}

	render() {	
		var color;
		if(this.props.indice % 2==0)
			{color = 'grey lighten-4'}
		return(
		<div>
			<h6 style={{fontWeight: 'bold', padding: '0.5rem 0.5rem'}}>
				{'Elemento ' + (this.props.indice+1) + ': ' + this.props.article.description}
			</h6>
			<div className="row no-margin" >
				<div className="col s8">
					<span>{'Cantidad de pedido: ' + this.props.article.quantity}</span>
				</div>
				<Input ref="quantity" name="quantity" placeholder="Cantidad de entrada" label="Cantidad de entrada" className="col s4" type="text"
					onChange={this.onChange.bind(this)} required={true}/>
			</div>
			<div className="row no-margin">
				<Input ref="remark" name="remark" className="col s12" type="text" 
					placeholder="Observación" label="Observación"
					onChange={this.onChange.bind(this)}/>
			</div>
		</div>)
	}
}

module.exports = class CustomDataImporter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {// fields: [],
					 fieldsValues: {},	
				   }
	}

	componentDidUpdate(prevProps) {
		//Materialize.updateTextFields();

		if(this.props.data !== prevProps.data){
			if(this.props.data && this.props.onFillData){
				Materialize.updateTextFields();
				this.props.onFillData();
			}
		}
	}

	values() {
		return $.map(this.state.fieldsValues,function(value, index){
			return [value] //vuelve un objeto a array [array]
		})
	}

	/*fillArticle() {
		var _articles = this.props.data;
		//var file = this.state.fields;
		//file.push( _articles.map(function(article,i){
		//return(<CustomImput key={i} article={article.id} indice={i}/>)

		//}) );
		//this.setState({fields: file});
		//console.log(this.state.fields);
		var fields = _articles.map((article,i)=>{
			return(<CustomImput key={i} article={article.id} indice={i}/>)			
		});
		if(this.props.onFillData){
			this.props.onFillData();
		}
		return fields;
	}*/

	onFieldChange(fieldId, values) {
		var newFieldsValues = this.state.fieldsValues;
		newFieldsValues[fieldId] = values;
		this.setState({fieldsValues: newFieldsValues});
		//console.log('campos seleccionados=',this.state.fieldsValues);


		if(this.props.onFieldChange){
			this.props.onFieldChange(newFieldsValues);
		}
	}

	render() {
		return(
		<div>
			{this.props.children}
			<Switch match={this.props.type}>
				<Case path="t1">
					{
						this.props.data.map((article,i)=>{
						return(<CustomImput key={i} indice={i} articleCode={article.code}
								articleDescription={article.description}
								onChange={this.onFieldChange.bind(this)}/>)			
						})
					}
				</Case>
				<Case path="t2">
					{
						this.props.data.map((article,i)=>{
						return(<CustomImput2 key={i} indice={i} articleCode={article.code}
								articleDescription={article.description}
								onChange={this.onFieldChange.bind(this)}/>)			
						})
					}
				</Case>
				<Case path="t3">
					{
						this.props.data.map((article,i)=>{
						return(<CustomImput3 key={i} indice={i} article={article}
								onChange={this.onFieldChange.bind(this)}/>)			
						})
					}
				</Case>
			</Switch>
		</div>)
	}
}
