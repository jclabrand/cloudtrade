
/****************************************************************************************

	Copyright (c) 2016-2017,
	Authors: Juan Victor Bedoya, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import Randomstring from "randomstring";

const Form = require('../components/form.jsx');
const Input = require('../components/input.jsx');
const Table = require('../components/table.jsx');
import Progress from'../components/progress.jsx';
const Panel = require('../components/sectionCard.jsx');
const MessageModal = require('../components/modal.jsx');
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Alert from '../components/alert.jsx';

const SectionView = require('../components/sectionView.jsx');

import { CommonStore } from '../flux/common';
import { InventoryActions } from '../flux/inventory';
import { CompanyActions, CompanyStore } from '../flux/company';
import { WarehousesActions, WarehousesStore } from '../flux/warehouses';

//??????????????
//import WarehouseEntryActions from '../flux/warehouse-entry-actions';
//import WarehouseEntryStore from '../flux/warehouse-entry-store';


/****************************************************************************************/

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

class WarehousesWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<Panel title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de almacenes."/>
			</div>
		</Panel>);
	}
}

class WarehousesInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			cities: [],
			countries: [{name: 'Bolivia'}]
		}

		this.stores = [CommonStore, WarehousesStore];
		this.storeKeys = ['theme', 'insertStatus'];

		this._formValidationRules = {
		}
	}

	componentWillMount() {
		super.componentWillMount();

		WarehousesActions.findAllCities((err, res)=>{
			if(err){} else if(res){ this.setState({cities: res.cities}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onFormSubmit(form) {
		var self = this;

		var data = {
			clientCode: this.refs.warehouseCode.value(),
			name: this.refs.warehouseName.value(),
			type: this.refs.warehouseType.value(),
			country: this.refs.warehouseCountry.value(),
			city: this.refs.warehouseCity.value(),
			address: this.refs.warehouseAddress.value(),
			phone: this.refs.warehousePhone.value(),
			postcode: this.refs.warehousePostcode.value(),
		}

		this.refs.messageModal.show('sending');
		WarehousesActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	render() {
		return(
		<Panel title="Insertar nuevo almacén" iconName="library_books">
			<div className="row no-margin">
				<h6 style={{padding: '0rem 0.8rem'}}>Introduzca los datos para el nuevo almacén.</h6>
			</div>

			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div style={{padding: '0.5rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

					<div className="row no-margin">
						<Input ref="warehouseSubsidiary" name="warehouseSubsidiary" className="col s6" type="text"
							label="Sucursal" placeholder="Sucursal" disabled={true}/>
						<Input ref="warehouseCode" name="warehouseCode" className="col s6" type="text"
							label="Código del almacén *" placeholder="Ingrese el código del almacén" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="warehouseType" name="warehouseType" className="col s12" type="text"
							label="Tipo *" placeholder="Ingrese el tipo de almacén" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="warehouseName" name="warehouseName" className="col s12" type="text"
							label="Nombre *" placeholder="Ingrese el nombre del almacén" required={true}/>
					</div>

					<div className="row no-margin">
						<Input ref="warehouseCountry" name="warehouseCountry" className="col s6" type="autocomplete"
							label="País *" placeholder="País" required={true} options={{data: this.state.countries, key: 'name', minLength: 1}}/>
						<Input ref="warehouseCity" name="warehouseCity" className="col s6" type="autocomplete"
							label="Ciudad *" placeholder="Ciudad" required={true} options={{data: this.state.cities, key: 'name', minLength: 1}}/>
					</div>
					<div className="row no-margin">
						<Input ref="warehouseAddress" name="warehouseAddress" className="col s12" type="text"
							label="Dirección *" placeholder="Dirección del almacén" required={true}/>
					</div>
				</div>

				<div style={{padding: '0.5rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos opcionales</h6>

					<div className="row no-margin">	
						<Input ref="warehousePhone" name="warehousePhone" className="col s6" type="text"
							label="Teléfono" placeholder="Ingrese el número de teléfono del almacén"/>
						<Input ref="warehousePostcode" name="warehousePostcode" className="col s6" type="text"
							label="Código postal" placeholder="Código postal"/>
					</div>
				</div>

				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Finalizar</h6>
					<div className="row">
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
		</Panel>)
	}
}

class WarehousesUpdate extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.stores = [WarehousesStore];

		this._formValidationRules = {
			rules: {
				warehouseDescription: { required: true, minlength: 8 }
			},
			messages: {
				warehouseDescription: {
					minlength: 'Debe escribir almenos 8 caracteres'
				}
			}
		}
	}

	componentDidMount() {
		if(this.state.selectedItem){
			if(this.props.warehouse === this.state.selectedItem.code){
				this.onLoad();
			}else{
				WarehousesActions.findOne(this.props.warehouse);
			}
		}else{
			WarehousesActions.findOne(this.props.warehouse);
		}
	}

	componentDidUpdate() {
		this.onLoad();
	}

	onLoad() {
		if(this.state.viewerStatus === 'ready'){
			Materialize.updateTextFields();

			var warehouse = this.state.selectedItem;

			this.refs.warehouseName.value(warehouse.name);
			this.refs.warehousePhone.value(warehouse.phones);
			this.refs.warehouseDescription.value(warehouse.description);
			this.refs.warehouseCity.value(warehouse.city);
			this.refs.warehouseAddress.value(warehouse.addres);
		}
	}

	onFormSubmit(form) {
		var data = {
			company: this.props.company,
			code: this.state.selectedItem.code,
			name: this.refs.warehouseName.value(),
			description: this.refs.warehouseDescription.value(),
			city: this.refs.warehouseCity.value(),
			addres: this.refs.warehouseAddress.value(),
			phones: [this.refs.warehousePhone.value()]
		}

		this.refs.messageModal.show('sending');
		WarehousesActions.updateOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	render() {
		var cities = [
			{ name: "Sucre" },
			{ name: "Santa Cruz" },
			{ name: "Cochabamba" },
			{ name: "Oruro" },
			{ name: "Potosí" },
			{ name: "Tarija" },
		];

		switch(this.state.updateStatus){
		case 'ready':
			return(
			<Panel title="Editar datos de almacen" iconName="library_books">
				<div style={{padding: '0rem 1rem'}}>
					<span>Introduzca los datos para el nuevo artículo.</span>
				</div>

				<Form ref="editForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
					<div style={{padding: '0rem 0.3rem'}}>
						<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

						<div className="row no-margin">
							<Input ref="warehouseName" name="warehouseName" className="col s6" type="text"
								label="Nombre del almacén" placeholder="Ingrese el nombre del almacén" required={true}/>
							<Input ref="warehousePhone" name="warehousePhone" className="col s6" type="text"
								label="Teléfono" placeholder="Ingrese el número de teléfono del almacén" required={true}/>
						</div>

						<div className="row no-margin">
							<Input ref="warehouseDescription" name="warehouseDescription" type="text" label="Descripción"
								className="col s12" placeholder="Ingrese la descripción del almacén" required={true}/>
						</div>
						<div className="row no-margin">
							<Input ref="warehouseCity" name="warehouseCity" className="col s6" type="autocomplete"
								label="Ciudad" placeholder="Ciudad del almacén" data={cities} required={true} options={{data: cities, key: 'name', minLength: 1}}/>
							<Input ref="warehouseAddress" name="warehouseAddress" className="col s6" type="text"
								label="Dirección" placeholder="Dirección del almacén" required={true}/>
						</div>
					</div>

					<div className="row">
						<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Finalizar</h6>

						<div style={{padding: '0rem 0.5rem'}}>
							<button className="btn waves-effect waves-light col s12 red darken-2" type="submit"
								style={{textTransform: 'none', fontWeight: 'bold', marginBottom: '1rem'}}>
								Guardar datos
								<i className="material-icons right">send</i>
							</button>
						</div>
					</div>
				</Form>
				<MessageModal ref="messageModal"/>
			</Panel>);
		case 'loading':
			return (
			<Panel title="Editar datos de almacen" iconName="library_books">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		}
	}
}

class WarehousesList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehousesStore;
		this.storeKeys = ['list', 'listStatus'];

		this.dropdowOptions = [
			{
				text:'Insertar nuevo almacén',
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
		WarehousesActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate() {
		WarehousesActions.findAll();
	}

	render() {
		return(
		<Panel title="Lista de almacenes" iconName="view_list" menuID="warehousesList" menuItems={this.dropdowOptions}>

			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos los almacenes registrados en la base de datos.
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
						<Alert type="error" text="ERROR: No se pudo cargar la lista de almacenes"/>
					</Case>
				</Switch>
			</div>
		</Panel>)
	}
}

class WarehousesViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehousesStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];

		this.dropdowOptions = [
			/*{
				text: 'Editar',
				select: this.onDropdowOptionUpdate.bind(this)
			},
			{
				text: 'Eliminar',
				select: this.onDropdowOptionDelete.bind(this)
			},*/
			{
				text: 'Reporte de existencias',
				select: this.onDropdowOptionStockReport.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.warehouseCode){
			WarehousesActions.findOne(this.props.warehouseCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.warehouseCode !== nextProps.warehouseCode){
			if(nextProps.warehouseCode){
				WarehousesActions.findOne(nextProps.warehouseCode);
			}
		}
	}

	onDropdowOptionUpdate() {
		this.props.history.push(this.props.url + '/editar/' + this.props.warehouseCode);
	}

	onDropdowOptionDelete() {
	}

	onDropdowOptionStockReport() {
		this.refs.messageModal.show('sending');
		WarehousesActions.getStockReport(this.props.warehouseCode, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.close();
				window.open('data:application/pdf;base64,'+res.pdf);
			}
		});		
	}

	render(){
		var item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready':
			return item ? (
			<Panel title="Datos de almacen" iconName="store" menuID="warehousesViewer" menuItems={this.dropdowOptions}>
				
				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>{item.name}</h6>

				<Collapsible defaultActiveIndex={0}>
					<CollapsibleCard title="Datos del almacen" iconName="info_outline">
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Sucursal" value={'Matríz'} className="col s6"/>
							<ItemProperty name="Código" value={item.clientCode} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Tipo" value={item.type} className="col s12"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Nombre" value={item.name} className="col s12"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="País" value={item.country} className="col s6"/>
							<ItemProperty name="Ciudad" value={item.city} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Direccion" value={item.address} className="col s12"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Telefono" value={item.phone} className="col s6"/>
							<ItemProperty name="Código postal" value={item.postcode} className="col s6"/>
						</div>
					</CollapsibleCard>
				</Collapsible>
				<MessageModal ref="messageModal"/>
			</Panel>) : (
			<Panel title="Datos de almacen" iconName="store">
				<p>Seleccione una elemento de la lista de almacenes</p>
			</Panel>);

		case 'loading':
			return (
			<Panel title="Cargando datos de almacen..." iconName="store">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);

		case 'error':
			return (
			<Panel title="Datos de almacen" iconName="store">
				<Alert type="error" text="ERROR: No se pudo cargar los datos del almacen"/>
			</Panel>);
		}
	}
}
/*
class WarehousesEntry extends Reflux.Component {
	constructor(props) {
		super(props);

		this.stores = [WarehouseEntryStore];

		this._formValidationRules = {
			rules: {
				currentStock: { required: true, digits: true },
				minStock: { required: true, digits: true },
				articleTotal: { required: true, digits: true }
			},
			messages: {
				currentStock: { digits: 'Sólo números' },
				minStock: { digits: 'Sólo números' },
				articleTotal: { digits: 'Sólo números' }
			},
			submitHandler: this.onFormSubmit.bind(this)
		}
	}

	componentDidMount() {
		Materialize.updateTextFields();

		WarehouseEntryActions.loadArticles();
	}

	onFormSubmit(form) {
	}

	onArticleDescriptionAutocomplete(data) {
		this.refs.articleCode.value(data.code);
		this.refs.articleMeasurement.value(data.measurement);
		this.refs.currentStock.value(data.currentStock);
		this.refs.minStock.value(data.minStock);
	}

	onArticleCodeAutocomplete(data) {
		this.refs.articleDescription.value(data.description);
		this.refs.articleMeasurement.value(data.measurement);
		this.refs.currentStock.value(data.currentStock);
		this.refs.minStock.value(data.minStock);
	}

	onArticleDescriptionChange() {
		this.refs.articleCode.clear();
		this.refs.articleMeasurement.clear();
		this.refs.currentStock.clear();
		this.refs.minStock.clear();
	}

	onArticleCodeChange() {
		this.refs.articleDescription.clear();
		this.refs.articleMeasurement.clear();
		this.refs.currentStock.clear();
		this.refs.minStock.clear();
	}

	render() {
		var articles = this.state.articles;

		return(
		<Form ref="whinForm" rules={this._formValidationRules}>
			<div>
				<div className="row no-margin">
					<Input ref="articleDescription" name="articleDescription" className="col s12" type="autocomplete"
						label="Artículo" placeholder="Escriba el nombre o descripción del artículo" data={articles} dataKey="description"
						onAutocomplete={this.onArticleDescriptionAutocomplete.bind(this)} onChange={this.onArticleDescriptionChange.bind(this)}/>
				</div>
				<div className="row no-margin">
					<Input ref="articleCode" name="articleCode" className="col s6" type="autocomplete"
						label="Código" placeholder="Código del artículo" data={articles} dataKey="code" required={true}
						onAutocomplete={this.onArticleCodeAutocomplete.bind(this)} onChange={this.onArticleCodeChange.bind(this)}/>
					<Input ref="articleMeasurement" name="articleMeasurement" className="col s6" type="text"
						label="Unidad de medida" placeholder="Unidad de medida del artículo" required={true} readOnly={true}/>
				</div>
				<div className="row no-margin">
					<Input ref="currentStock" name="currentStock" className="col s4" type="text"
						label="Stock actual" placeholder="Stock actual del artículo" required={true} readOnly={true}/>
					<Input ref="minStock" name="minStock" className="col s4" type="text"
						label="Stock mínimo" placeholder="Stock mínimo del artículo" required={true}/>
					<Input ref="articleTotal" name="articleTotal" className="col s4" type="text"
						label="Cantidad" placeholder="Cantidad de articulos que ingresarán" required={true}/>
				</div>
				<div className="row no-margin">
					<Input ref="inputDetail" name="inputDetail" className="col s12" type="text"
						label="Detalle" placeholder="Detalle de la entrada" required={true}/>
				</div>
			</div>
			<div>
				<h6 style={{fontWeight: 'bold'}}>Registrar entrada</h6>
				<div className="row no-margin">
					<button className="btn waves-effect waves-light col s12 blue-grey darken-1" type="submit"
						style={{textTransform: 'none', fontWeight: 'bold'}}>
						Guardar datos
						<i className="material-icons right">send</i>
					</button>
				</div>
			</div>
		</Form>)
	}
}*/




module.exports = class WarehousesManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [CompanyStore, WarehousesStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/empresa/' + this.props.match.params.company + '/adm/inventarios/almacenes';

		CompanyActions.setCompany(this.props.match.params.company);
		WarehousesActions.setCompany(this.props.match.params.company);
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
			<SectionView className="col s12 m5 l4">
				<Switch match={action}>
					<WarehousesWelcome path="welcome"/>
					<WarehousesViewer path="ver" url={this.url} history={this.props.history}
						warehouseCode={this.props.match.params.warehouse}/>
					<WarehousesInsert path="insertar" company={company}/>
					<WarehousesUpdate path="editar" company={company}
						warehouseCode={this.props.match.params.warehouse}/>
				</Switch>
			</SectionView>

			<SectionView className="col s12 m7 l8">
				<WarehousesList url={this.url} history={this.props.history}/>
			</SectionView>
		</div>) : null;
	}
}
