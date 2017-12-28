
/****************************************************************************************

	Copyright (c) 2016-2017,
	Authors: Juan Victor Bedoya, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import Randomstring from "randomstring";

import Form from '../components/form.jsx';
import Input from '../components/input.jsx';
import Table from'../components/table.jsx';
import Progress from'../components/progress.jsx';
import Panel from '../components/sectionCard.jsx';
import { Switch, Case } from '../components/switch.jsx';
import SectionView from '../components/sectionView.jsx';
import Alert from '../components/alert.jsx';
import MessageModal from '../components/modal.jsx';
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';

import { InventoryActions } from '../flux/inventory';
import { CompanyActions, CompanyStore } from '../flux/company';
import { ProviderActions, ProviderStore } from '../flux/provider';

/*****************************************************************************************/

class ItemProperty extends Reflux.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className={this.props.className}>
			<h6 style={{fontWeight: 'bold', fontSize: '1rem'}}>{ this.props.name + ':'}</h6>
			<div style={{paddingLeft: '1rem'}}>
				<span>{ this.props.value }</span>
			</div>
		</div>)
	}
}

/*****************************************************************************************/

class ProvidersWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<Panel title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de proveedores."/>
			</div>
		</Panel>);
	}
}

class ProvidersList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = ProviderStore;

		this.dropdowOptions = [
			{
				text:'Insertar nuevo proveedor',
				select: this.onDropdowOptionInsert.bind(this)
			},
			{
				text: 'Actualizar',
				select: this.onDropdowOptionUpdate.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();
		ProviderActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate() {
		ProviderActions.findAll();
	}

	render() {
		return(
		<Panel title="Lista de proveedores" iconName="view_list" menuID="providersList" menuItems={this.dropdowOptions}>
			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos los proveedores registrados en la base de datos.
				</span>
			</div>

			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Switch match={this.state.listStatus}>
					<Case path="loading" className="center">
						<div className="row">
							<Progress type="indeterminate"/>
						</div>
					</Case>
					<Case path="ready">
						<Table columns={this.state.list.columns} rows={this.state.list.rows} filterBy="name"
							onSelectRow={this.onSelectItem.bind(this)}/>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de proveedores"/>
					</Case>
				</Switch>
			</div>
		</Panel>)
	}

}

class ProvidersInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			cities: [],
			countries: [{name: 'Bolivia'}]
		}

		this.stores = [ProviderStore];

		this._formValidationRules = {
			rules: {
				email: { email: true }
			},
			messages: {
				email: {
					required: 'Debes ingresar un email',
					email: 'Por favor, introduzca una dirección email válida'
				}
			}
		}
	}

	componentWillMount() {
		super.componentWillMount();

		ProviderActions.findAllCities((err, res)=>{
			if(err){} else if(res){ this.setState({cities: res.cities}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onFormSubmit(form) {
		var data = {
			name: this.refs.providerName.value(),
			nit: this.refs.providerNIT.value(),
			description: this.refs.providerDescription.value,
			country: this.refs.providerCountry.value(),
			city: this.refs.providerCity.value(),
			phone: this.refs.providerPhone.value(),
			email: this.refs.email.value(),
			address: this.refs.providerAddress.value()
		}

		this.refs.messageModal.show('sending');
		ProviderActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	render() {
		return(
		<Panel title="Insertar nuevo proveedor" iconName="library_books">
			<div style={{padding: '0rem 1rem'}}>
				<span>Introduzca los datos para el nuevo proveedor.</span>
			</div>

			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

					<div className="row no-margin">
						<Input ref="providerName" name="providerName" className="col s6" type="text"
							label="Nombre del proveedor *" placeholder="Ingrese el nombre del proveedor" required={true}/>
						<Input ref="providerNIT" name="providerNIT" className="col s6" type="text"
							label="NIT *" placeholder="Ingrese el NIT del proveedor" required={true}/>
					</div>

					<div className="row no-margin">
						<Input ref="providerCountry" name="providerCountry" className="col s6" type="autocomplete"
							label="País del proveedor *" placeholder="Ingrese el país del proveedor" required={true} options={{data: this.state.countries, key: 'name', minLength: 1}}/>
						<Input ref="providerCity" name="providerCity" className="col s6" type="autocomplete"
							label="Ciudad del proveedor *" placeholder="Ingrese la ciudad del proveedor" required={true} options={{data: this.state.cities, key: 'name', minLength: 1}}/>
					</div>
					<div className="row no-margin">
						<Input ref="providerPhone" name="providerPhone" className="col s6" type="text"
							label="Teléfono *" placeholder="Ingrese el teléfono del proveedor" required={true}/>
					</div>
				</div>
				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos opcionales</h6>
					<div className="row no-margin">
						<div className="input-field col s12">
							<textarea ref="providerDescription" id="providerDescription" className="materialize-textarea" data-length="10240" placeholder="Detalles de la descripción"/>
							<label htmlFor="providerDescription">{'Detalles de la descripción'}</label>
						</div>
					</div>
					<div className="row no-margin">
						<Input ref="email" name="email" className="col s12" type="email" label="Email" placeholder="Email"/>
					</div>
					<div className="row no-margin">
						<Input ref="providerAddress" name="providerAddress" type="text" label="Dirección"
							className="col s12" placeholder="Ingrese la dirección del proveedor"/>
					</div>
				</div>

				<div className="row">
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Finalizar</h6>
					<div>
						<div style={{padding: '0rem 0.5rem'}}>
							<button className="btn waves-effect waves-light col s12 red darken-2" type="submit"
								style={{textTransform: 'none', fontWeight: 'bold', marginBottom: '1rem'}}>
								Guardar datos
								<i className="material-icons right">send</i>
							</button>
						</div>
					</div>
				</div>
			</Form>
			<MessageModal ref="messageModal"/>
		</Panel>);
	}
}

class ProvidersViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = ProviderStore;

		this.dropdowOptions = [
			{
				text: 'Editar',
				select: this.onDropdowOptionUpdate.bind(this)
			},
			{
				text: 'Eliminar',
				select: this.onDropdowOptionDelete.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.providerCode){
			ProviderActions.findOne(this.props.providerCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.providerCode !== nextProps.providerCode){
			if(nextProps.providerCode){
				ProviderActions.findOne(nextProps.providerCode);
			}
		}
	}

	onDropdowOptionUpdate() {
		this.props.history.push(this.props.url + '/editar/' + this.props.providerCode);
	}

	onDropdowOptionDelete() {
	}

	render(){
		var item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready':
			return item ? (
			<Panel title="Datos de proveedor" iconName="people" menuID="providersViewer" menuItems={this.dropdowOptions}>

				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>{item.name}</h6>

				<Collapsible defaultActiveIndex={0}>
					<CollapsibleCard title="Datos del proveedor" iconName="info_outline">
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Nombre" value={item.name} className="col s6"/>
							<ItemProperty name="NIT" value={item.nit} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="País" value={item.country} className="col s6"/>
							<ItemProperty name="Ciudad" value={item.city} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Teléfono" value={item.phone} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Correo electrónico" value={item.email} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Dirección" value={item.address} className="col s12"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Descripcion" value={item.description} className="col s12"/>
						</div>
					</CollapsibleCard>
				</Collapsible>
			</Panel>) : (
			<Panel title="Datos de proveedor" iconName="people">
				<p>Seleccione una elemento de la lista de proveedores</p>
			</Panel>);
		case 'loading':
			return (
			<Panel title="cargando datos de proveedor" iconName="people">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		}
	}
}

class ProvidersUpdate extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = ProviderStore;
	}

	componentDidMount() {
		if(this.state.selectedItem){
			if(this.props.providerCode === this.state.selectedItem.code){
				this.onLoad();
			}else{
				ProviderActions.findOne(this.props.providerCode);
			}
		}else{
			ProviderActions.findOne(this.props.providerCode);
		}
	}

	componentDidUpdate() {
		this.onLoad();
	}

	onLoad() {
		if(this.state.viewerStatus === 'ready'){
			Materialize.updateTextFields();

			var provider = this.state.selectedItem;

			this.refs.providerName.value(provider.name);
			this.refs.providerNIT.value(provider.nit);
			this.refs.providerCity.value(provider.city);
			this.refs.providerPhone.value(provider.phone);
			this.refs.providerDescription.value(provider.description);
			this.refs.email.value(provider.email);
			this.refs.providerAddress.value(provider.address);
		}
	}

	onFormSubmit(form) {
		var data = {
			company: this.props.company,
			code: 	this.state.selectedItem.code,
			name: 	this.refs.providerName.value(),
			nit: 	this.refs.providerNIT.value(),
			city: 	this.refs.providerCity.value(),
			phone: 	this.refs.providerPhone.value(),
			description: this.refs.providerDescription.value(),
			email: 	this.refs.email.value(),
			address:this.refs.providerAddress.value()
		}

		this.refs.messageModal.show('sending');

		ProviderActions.updateOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	render() {
		switch(this.state.viewerStatus){
		case 'ready':
			return(
				<Panel title="Editar datos de proveedor" iconName="library_books">
					<div style={{padding: '0rem 1rem'}}>
						<span>Introduzca los datos para el nuevo proveedor.</span>
					</div>
					<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
						<div style={{padding: '0rem 0.3rem'}}>
							<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>
							<div className="row no-margin">
								<Input ref="providerName" name="providerName" className="col s6" type="text"
									label="Nombre del proveedor" placeholder="Ingrese el nombre del proveedor" required={true}/>
								<Input ref="providerNIT" name="providerNIT" className="col s6" type="text"
									label="NIT" placeholder="Ingrese el NIT del proveedor" required={true}/>
							</div>

							<div className="row no-margin">
								<Input ref="providerCity" name="providerCity" className="col s6" type="text"
									label="Ciudad del proveedor" placeholder="Ingrese la ciudad del proveedor" required={true}/>
								<Input ref="providerPhone" name="providerPhone" className="col s6" type="text"
									label="Teléfono" placeholder="Ingrese el teléfono del proveedor" required={true}/>
							</div>
						</div>
						<div style={{padding: '0rem 0.3rem'}}>
							<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos opcionales</h6>
							<div className="row no-margin">
								<Input ref="providerDescription" name="providerDescription" type="text" label="Descripción"
									className="col s12" placeholder="Ingrese la descripción del proveedor"/>
							</div>
							<div className="row no-margin">
								<Input ref="email" name="email" className="col s12" type="email" label="Email" placeholder="Email"/>
							</div>
							<div className="row no-margin">
								<Input ref="providerAddress" name="providerAddress" type="text" label="Dirección"
									className="col s12" placeholder="Ingrese la dirección del proveedor"/>
							</div>
						</div>	
						<div className="row">
							<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Finalizar</h6>
							<div>
								<div style={{padding: '0rem 0.5rem'}}>
									<button className="btn waves-effect waves-light col s12 red darken-2" type="submit"
										style={{textTransform: 'none', fontWeight: 'bold', marginBottom: '1rem'}}>
										Guardar datos
										<i className="material-icons right">send</i>
									</button>
								</div>
							</div>
						</div>
					</Form>
					<MessageModal ref="messageModal"/>
				</Panel>);
		case 'loading':
			return (
			<Panel title="Editar datos de proveedor" iconName="library_books">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		}
	}
}

/*****************************************************************************************/

module.exports = class ProvidersManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [CompanyStore, ProviderStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/empresa/' + this.props.match.params.company + '/adm/inventarios/proveedores';

		CompanyActions.setCompany(this.props.match.params.company);
		ProviderActions.setCompany(this.props.match.params.company);
		CompanyActions.authenticate((err, res)=>{
			if(err){
				window.location.replace('/empresa/' + this.props.match.params.company);
			}
		});
		InventoryActions.loadSideMenuItems(this.props.match.params.company);
	}

	render() {
		let action = this.props.match.params.action ? this.props.match.params.action : 'welcome',
			company = this.props.match.params.company;

		return this.state.user ? (
		<div className="row no-margin" style={{backgroundColor: '#eeeeee'}}>
			<SectionView className="col s12 m6 l5">
				<Switch match={action}>
					<ProvidersWelcome path="welcome"/>
					<ProvidersViewer path="ver" url={this.url} history={this.props.history}
						providerCode={this.props.match.params.provider}/>
					<ProvidersInsert path="insertar" company={company}/>
					<ProvidersUpdate path="editar" company={company}
						providerCode={this.props.match.params.provider}/>
				</Switch>
			</SectionView>

			<SectionView className="col s12 m6 l7">
				<ProvidersList url={this.url} history={this.props.history}/>
			</SectionView>
		</div>) : null;
	}
}
