
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
import Select from '../components/select.jsx';
import { Button } from '../components/button.jsx';
import Table from'../components/table.jsx';
import Progress from'../components/progress.jsx';
import Panel from '../components/sectionCard.jsx';
import { Switch, Case } from '../components/switch.jsx';
import SectionView from '../components/sectionView.jsx';
import Alert from '../components/alert.jsx';
import MessageModal from '../components/modal.jsx';
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import { DataImporter } from '../components/data-importer.jsx';


//import CustomDataImporter from '../components/customDataImporter.jsx';

import { InventoryActions } from '../flux/inventory';
import { CompanyActions, CompanyStore } from '../flux/company';
import { PurchaseActions, PurchaseStore } from '../flux/purchase';
//import { ProviderActions, ProviderStore } from '../flux/provider';

import {PretyDate} from '../tools/prety-date';

/*****************************************************************************************/

class ArticleMutator extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.article.purchase = { quantity: 0, unitPrice: 0, remark: '' }
		this.refs.quantity.value('0');
		this.refs.unitPrice.value('0');
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.article !== this.props.article){
			this.props.article.purchase = { quantity: 0, unitPrice: 0, remark: '' }

			this.refs.quantity.value('0');
			this.refs.unitPrice.value('0');
			this.refs.remark.value = '';
		}
	}

	onQuantityChange() {
		let quantity = parseInt(this.refs.quantity.value(), 10);

		if(Number.isInteger(quantity)){
			this.refs.quantity.value(quantity.toString()); // This line doesn't trigger a new onChange event
		}else{
			quantity = 0;
			this.refs.quantity.value('0'); // This line doesn't trigger a new onChange event
		}
		
		this.props.article.purchase.quantity = quantity;
	}

	onUnitPriceChange() {
		this.props.article.purchase.unitPrice = parseFloat(this.refs.unitPrice.value());
	}

	onMeasurementChange() {
		this.props.article.purchase.measurement = this.refs.measurement.value();
	}

	onRemarkChange() {
		this.props.article.purchase.remark = this.refs.remark.value;;
	}

	render() {
		return(
		<div>
			<h6 style={{fontWeight: 'bold', padding: '0.5rem 0.5rem'}}>
				{'Artículo: ' + this.props.article.name}
			</h6>
			<div className="row no-margin" >
				<Input ref="quantity" name={'quantity' + this.props.id} placeholder="Cantidad" label="Cantidad *" className="col s4" type="text"
					onChange={this.onQuantityChange.bind(this)} required={true}/>
				<Input ref="unitPrice" name={'unitPrice' + this.props.id} placeholder="Precio unitario" label="Precio unitario *" className="col s4" type="text"
					onChange={this.onUnitPriceChange.bind(this)} required={true}/>
				<Input ref="measurement" name={'measurement' + this.props.id} placeholder="Unidad de medida" label="Unidad de medida *" className="col s4" type="text"
					onChange={this.onMeasurementChange.bind(this)} required={true}/>
			</div>
			<div className="row no-margin">
				<div className="input-field col s12">
					<textarea ref="remark" id={'remark' + this.props.id} className="materialize-textarea" data-length="1024"
						placeholder="Observación" onChange={this.onRemarkChange.bind(this)}/>
					<label htmlFor={'remark' + this.props.id}>Observación</label>
				</div>
			</div>
		</div>)
	}
}

class ArticleImporter extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let article = this.props.transaction;
		return(<ArticleMutator id={article.code} article={article}/>)
	}
}

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

class PurchaseWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<Panel title="Bienvenido" iconName="shopping_cart">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de compras."/>
			</div>
		</Panel>);
	}
}

class PurchasesList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = PurchaseStore;

		this.dropdowOptions = [
			{
				text:'Crear nueva compra',
				select: this.onDropdowOptionInsert.bind(this)
			},
			{
				text:'Crear reporte por fechas',
				select: this.onDropdowOptionDatedReport.bind(this)
			},
			{
				text: 'Actualizar',
				select: this.onDropdowOptionUpdate.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();
		PurchaseActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionDatedReport() {
		this.props.history.push(this.props.url + '/reporte-fechas/' + Randomstring.generate());
	}

	onDropdowOptionUpdate() {
		PurchaseActions.findAll();
	}

	render() {
		return(
		<Panel title="Lista de compras" iconName="view_list" menuID="purchasesList" menuItems={this.dropdowOptions}>
			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos las compras registradas en la base de datos.
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
						<Table columns={this.state.list.columns} rows={this.state.list.rows} filterBy="business"
							onSelectRow={this.onSelectItem.bind(this)}/>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de compras"/>
					</Case>
				</Switch>
			</div>

		</Panel>)
	}
}

class PurchaseInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			providers: [/*{name: 'Importadora las Lomas', code}, {name: 'Tablec Ltd'}*/]
		}

		this.stores = [PurchaseStore];

		this._formValidationRules = {
		}
	}

	componentWillMount() {
		super.componentWillMount();

		PurchaseActions.findAllProviders((err, res)=>{
			if(res && res.providers){
				this.setState({providers: res.providers.rows});
			}
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onFormSubmit(form) {
		let transactions = this.refs.transactions.getSelectedTransactions();
		let data = {
			business: 	this.refs.shoppingBusiness.value(),
			order: 		this.refs.shoppingOrder.value(),
			guideNumber: 	this.refs.shoppingNGuide.value(),
			providerCode: 	this.refs.provider.value(),
			contactName:	this.refs.shoppingCantactName.value(),
			payDate: 		this.refs.shoppingPayDate.value(),
			billingDir: 	this.refs.shoppingBillingDir.value(),
			billingCountry:	this.refs.shoppingBillingCountry.value(),
			billingDep: 	this.refs.shoppingBillingDep.value(),
			shippingDir: 		this.refs.shopShippingDir.value(),
			shippingCountry:	this.refs.shopShippingCountry.value(),
			shippingDep:		this.refs.shopShippingState.value(),
			shippingProvince: 	this.refs.shopShippingProvince.value(),
			shippingPostal: 	this.refs.shopShippingPostal.value(),
			terms: 			this.refs.shopTerms.value,
			description:	this.refs.shopDescription.value,
			articles: transactions.map(article=>{
				return {
					code: article.code,
					quantity: article.purchase.quantity,
					unitPrice: article.purchase.unitPrice,
					measurement: article.purchase.measurement,
					remark: article.purchase.remark
				}
			})
		}

		let p1 = new Promise((resolve, reject)=>{
			if(data.business.length > 0){ resolve(); }else{ reject({opencard: 0}); }
		});
		let p2 = new Promise((resolve, reject)=>{
			if(data.providerCode.length > 0){ resolve(); }else{ reject({opencard: 0}); }
		});
		let p3 = new Promise((resolve, reject)=>{
			if(data.billingDir.length > 0){ resolve(); }else{ reject({opencard: 1}); }
		});
		let p4 = new Promise((resolve, reject)=>{
			if(data.shippingDir.length > 0){ resolve(); }else{ reject({opencard: 1}); }
		});
		let p5 = new Promise((resolve, reject)=>{
			if(data.articles.length > 0){ resolve(); }else{ reject({opencard: 3}); }
		});

		Promise.all([p1, p2, p3, p4, p5]).then(values => {
			this.refs.messageModal.show('sending');
			PurchaseActions.insertOne(data, (err, res)=>{
				if(err){
					this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
				}else{
					this.refs.messageModal.show('success_save');
				}
			});
		}).catch(err=>{
			this.refs.collapsible.openCard(err.opencard);
			this.refs.insertForm.valid();
		});
	}

	onRequireArticles(callback) {
		PurchaseActions.findAllArticles((err, res)=>{
			if(res){ callback(null, {data: res.articles}); }else{ callback(err); }
		});
	}

	onDataImporterChange() {
		Materialize.updateTextFields();
		this.refs.insertForm.revalidate();
	}

	render() {
		let articlesColumns = [
			{ name: 'clientCode', text: 'Código', visible: true },
			{ name: 'name', text: 'Nombre', visible: true },
			{ name: 'brand', text: 'Marca', visible: true },
			{ name: 'category', text: 'Categoría', visible: true }
		];

		return(
		<Panel title="Crear una orden compra" iconName="shopping_cart" >
			<div style={{padding: '0rem 1rem'}}>
				<span>Introduzca los datos para la orden de compra.</span>
			</div>
	
			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
		<Collapsible ref="collapsible" defaultActiveIndex={0}>
			<CollapsibleCard title="Información de la orden de compra" iconName="shop">
				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Información de la orden de compra</h6>

					<div className="row no-margin">
						<Input ref="shoppingBusiness" name="shoppingBusiness" type="text" className="col s12"
							label="Asunto *" placeholder="(p. ej. : Equipo de oficina)" required={true}/>
					</div>

					<div className="row no-margin">
						<Input ref="shoppingOrder" name="shoppingOrder" type="text" className="col s6"
							label="Referencia del pedido" placeholder="Referencia del pedido"/>
						<Input ref="shoppingNGuide" name="shoppingNGuide" type="text" className="col s6"
							label="Número de guía" placeholder="Número de guía" required={true}/>
					</div>
				</div>

				<div style={{padding: '0rem 0.3rem 1rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Información del proveedor</h6>

					<div className="row no-margin">
						<Select ref="provider" className="col s12" options={this.state.providers} nameField="name" valueField="code"
							label="Proveedor *" placeholder="Seleccione un proveedor"/>
					</div>
					<div className="row no-margin">
						<Input ref="shoppingCantactName" name="shoppingCantactName" type="text" className="col s6"
							label="Nombre de contacto" placeholder="Nombre de contacto"/>
						<Input ref="shoppingPayDate" name="shoppingPayDate" type="date" className="col s6"
							label="Fecha de pago" placeholder="Fecha de pago"/>
					</div>
				</div>
			</CollapsibleCard>
			<CollapsibleCard title="Información de direcciones" iconName="location_on">
				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Detalles de la dirección de facturación</h6>
					<div className="row no-margin">
						<Input ref="shoppingBillingDir" name="shoppingBillingDir" type="text" className="col s12"
							label="Dirección de facturación *" placeholder="Dirección de facturación" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="shoppingBillingCountry" name="shoppingBillingCountry" type="text" className="col s6"
							label="País de facturación" placeholder="País de facturación"/>
						<Input ref="shoppingBillingDep" name="shoppingBillingDep" type="text" className="col s6"
							label="Departamento (Estado)" placeholder="Departamento (Estado) de facturación"/>
					</div>
				</div>

				<div style={{padding: '0rem 0.3rem 1rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Detalles de la dirección de envío</h6>
					<div className="row no-margin">
						<Input ref="shopShippingDir" name="shopShippingDir" type="text" className="col s12"
							label="Dirección de envío *" placeholder="Dirección de envío" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="shopShippingCountry" name="shopShippingCountry" type="text" className="col s6"
							label="País de envío" placeholder="País de envío"/>
						<Input ref="shopShippingState" name="shopShippingState" type="text" className="col s6"
							label="Departamento (Estado)" placeholder="Departamento (Estado) de envío"/>
					</div>
					<div className="row no-margin">
						<Input ref="shopShippingProvince" name="shopShippingProvince" type="text" className="col s6"
							label="Provincia de envío" placeholder="Provincia de envío"/>
						<Input ref="shopShippingPostal" name="shopShippingPostal" type="text" className="col s6"
							label="Código postal" placeholder="Código postal"/>
					</div>
				</div>
			</CollapsibleCard>
			<CollapsibleCard title="Información adicional" iconName="import_contacts">
				<div className="row no-margin">
					<div className="input-field col s12">
						<textarea ref="shopTerms" id="textarea1" className="materialize-textarea" data-length="1024" placeholder="Términos y condiciones">
						</textarea>
						<label htmlFor="textarea1">Términos y condiciones</label>
					</div>
				</div>
				<div className="row no-margin">
					<div className="input-field col s12">
						<textarea ref="shopDescription" id="textarea2" className="materialize-textarea" data-length="1024" placeholder="Descripción">
						</textarea>
						<label htmlFor="textarea2">Detalles de la descripción</label>
					</div>
				</div>
			</CollapsibleCard>
			<CollapsibleCard title="Detalles sobre los elementos" iconName="library_books">
				{/*<DataImporter ref="customeFields" loadData={this.onUpdateArticles.bind(this)} onChange={this.onDataImporterChange.bind(this)}/>*/}
				
				<DataImporter ref="transactions" columns={articlesColumns} dataComponent={ArticleImporter} filterBy="name"
					loadData={this.onRequireArticles.bind(this)} onChange={this.onDataImporterChange.bind(this)}/>
			</CollapsibleCard>
		</Collapsible>

				<div className="row no-margin" style={{padding: '0rem 0.8rem 1rem 0.8rem'}}>
					<h6 style={{fontWeight: 'bold'}}>Finalizar</h6>
					<Button ref="submitBtn" className="col s12 red darken-2" text="Guardar datos" iconName="send" type="submit"/>
				</div>
			</Form>
			<MessageModal ref="messageModal"/>
		</Panel>)
	}

}

class PurchaseViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = PurchaseStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];

		this.dropdowOptions = [
			{
				text: 'Cambiar estado',
				select: this.onDropdowOptionUpdateStatus.bind(this)
			},
			{
				text: 'Crear reporte',
				select: this.onDropdowOptionDetailReport.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.purchaseCode){
			PurchaseActions.findOne(this.props.purchaseCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.purchaseCode !== nextProps.purchaseCode){
			if(nextProps.purchaseCode){
				PurchaseActions.findOne(nextProps.purchaseCode);
			}
		}
	}

	onDropdowOptionUpdateStatus() {
		this.props.history.push(this.props.url + '/cambiar-estado/' + this.props.purchaseCode);
	}

	onDropdowOptionDetailReport() {
		this.refs.messageModal.show('sending');
		PurchaseActions.getDetailReport(this.props.purchaseCode, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.close();
				window.open('data:application/pdf;base64,'+res.pdf);
			}
		});
	}

	render() {
		let item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready':
			return item ? (
			<Panel title="Orden de compra" iconName="shopping_cart" menuID="purchaseViewer" menuItems={this.dropdowOptions}>
				<h6 style={{fontWeight: 'bold', padding: '0.3rem 1rem'}}>{item.business}</h6>
			
				<Collapsible defaultActiveIndex={0}>
					<CollapsibleCard title="Datos de la compra" iconName="assignment_turned_in">
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Asunto" value={item.business} className="col s6"/>
							<ItemProperty name="Referencia del pedido" value={item.order} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Número de guía" value={item.guideNumber} className="col s6"/>
							<ItemProperty name="Estado" value={item.status} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Proveedor" value={item.provider.name} className="col s6"/>
							<ItemProperty name="Nombre de contacto" value={item.contactName} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Fecha de pago" value={item.payDate} className="col s6"/>
						</div>


						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Términos y condiciones" value={item.terms} className="col s12"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Descripción" value={item.description} className="col s12"/>
						</div>
					</CollapsibleCard>
				</Collapsible>
				<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Información sobre los artículos</h6>
				<Collapsible>
					{
						item.articles ?
						item.articles.map(function(article, i){
							return (
							<CollapsibleCard key={i} title={article.name} iconName="view_stream">
								<div className="row" style={{marginBottom: '0.5rem'}}>
									<ItemProperty name="Cantidad" value={article.quantity} className="col s6"/>
									<ItemProperty name="Precio unitario" value={article.unitPrice} className="col s6"/>
								</div>
								<div className="row" style={{marginBottom: '0.5rem'}}>
									<ItemProperty name="Unidad de medida" value={article.measurement} className="col s6"/>
								</div>
								<div className="row" style={{marginBottom: '0.5rem'}}>
									<ItemProperty name="Observación" value={article.remark} className="col s12"/>
								</div>
							</CollapsibleCard>)
						}) : null
					}
				</Collapsible>
				<MessageModal ref="messageModal"/>
			</Panel>) : (
			<Panel title="Orden de compra" iconName="shopping_cart">
				<p>Seleccione una elemento de la lista de compras</p>
			</Panel>);
		case 'loading':
			return (
			<Panel title="Cargando datos de compra..." iconName="shopping_cart">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);

		case 'error':
			return (
			<Panel title="Orden de compra" iconName="shopping_cart">
				<Alert type="error" text="ERROR: No se pudo cargar los datos"/>
			</Panel>);
		}
	}
}

class PurchaseUpdateStatus extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = PurchaseStore;
	}

	componentDidMount() {
		if(this.state.selectedItem){
			if(this.props.purchaseCode === this.state.selectedItem.code){
				this.onSelectStatus();
			}else{
				PurchaseActions.findOne(this.props.purchaseCode);
			}
		}else{
			PurchaseActions.findOne(this.props.purchaseCode);
		}
	}

	componentDidUpdate() {
		this.onSelectStatus();
	}

	onFormSubmit(form) {
		var data = {
			code: this.state.selectedItem.code,
			status: this.refs.status.value()
		}

		this.refs.messageModal.show('sending');
		PurchaseActions.updateOneStatus(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	onSelectStatus() {
		if(this.state.viewerStatus === 'ready'){
			if(this.state.selectedItem.status === this.refs.status.value()){
				this.refs.submitBtn.disable();
			}else{
				this.refs.submitBtn.enable();
			}
		}
	}

	render() {
		let item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready':
			return item ? (
			<Panel title="Orden de compra" iconName="shopping_cart">
				<div style={{padding: '0rem 1rem'}}>
					<span>Cambiar estado de la orden de compra.</span>
				</div>
				<h6 style={{fontWeight: 'bold', padding: '0.3rem 0.8rem'}}>{item.business}</h6>

				<Form ref="updateStatusForm" onSubmit={this.onFormSubmit.bind(this)}>
					<div className="row no-margin" style={{padding: '0rem 0rem 1rem 1.5rem'}}>
						<h6>{'Estado actual: ' + item.status}</h6>
					</div>
					<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
						<Select ref="status" className="col s12" nameField="name" valueField="value"
							options={[{name:'Creado', value:'created'}, {name:'Aprobado', value:'approved'}, {name:'Entregado', value:'delivered'}, {name:'Cancelado', value:'cancelled'}, {name:'Retrasado', value:'delayed'}]}
							label="Nuevo estado" placeholder="Seleccione un estado" onChange={this.onSelectStatus.bind(this)}/>
					</div>
					<div className="row no-margin" style={{padding: '0rem 0.8rem 1rem 0.8rem'}}>
						<h6 style={{fontWeight: 'bold'}}>Finalizar</h6>
						<Button ref="submitBtn" className="col s12 red darken-2" text="Guardar datos" iconName="send" type="submit"/>
					</div>
				</Form>
				<MessageModal ref="messageModal"/>
			</Panel>) : (
			<Panel title="Orden de compra" iconName="shopping_cart">
				<p>Seleccione un elemento de la lista de compras</p>
			</Panel>);
		case 'loading':
			return (
			<Panel title="Cargando datos de compra..." iconName="shopping_cart">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		case 'error':
			return (
			<Panel title="Orden de compra" iconName="shopping_cart">
				<Alert type="error" text="ERROR: No se pudo cargar los datos"/>
			</Panel>);
		}
	}
}

class PurchasesDatedReport extends Reflux.Component {
	constructor(props){
		super(props);
	}

	componentDidMount() {
		Materialize.updateTextFields();

		let date1 = PretyDate.formated();
		this.refs.startDate.value(date1);
		this.refs.endDate.value(date1);
	}

	onFormSubmit(form) {
		let data = {
			startDate: this.refs.startDate.value(),
			endDate: this.refs.endDate.value()
		}
		var d1 = PretyDate.parse(data.startDate);
		var d2 = PretyDate.parse(data.endDate);

		if(d1 > d2) {
			this.refs.messageModal.show('save_error', 'No permitido: la fecha de inicio debe ser menor a la fecha fin.');
		}else{
			this.refs.messageModal.show('sending');
			PurchaseActions.getDatedReport(data, (err, res)=>{
				if(err){
					this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
				}else{
					this.refs.messageModal.close();
					//console.log('RES', res);
					window.open('data:application/pdf;base64,'+res.pdf);
				}
			});
		}
	}

	render() {
		return (
		<Panel title="Crear reporte de compras" iconName="shopping_cart">
			<div style={{padding: '0rem 1rem'}}>
				<span>Seleccione las fechas para el reporte de compras.</span>
			</div>
			<Form ref="datedReportForm" onSubmit={this.onFormSubmit.bind(this)}>
				<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
					<Input ref="startDate" name="startDate" type="date" className="col s12"
						label="Fecha inicio" placeholder="Seleccione fecha inicio"/>
				</div>
				<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
					<Input ref="endDate" name="endDate" type="date" className="col s12"
						label="Fecha fin" placeholder="Seleccione fecha fin"/>
				</div>
				<div className="row no-margin" style={{padding: '0rem 0.8rem 1rem 0.8rem'}}>
					<h6 style={{fontWeight: 'bold'}}>Crear</h6>
					<Button ref="submitBtn" className="col s12 red darken-2" text="Crear reporte" iconName="send" type="submit"/>
				</div>
			</Form>
			<MessageModal ref="messageModal"/>
		</Panel>)
	}
}

/*****************************************************************************************/

module.exports = class PurchaseManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [CompanyStore, PurchaseStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/empresa/' + this.props.match.params.company + '/adm/inventarios/compras';

		CompanyActions.setCompany(this.props.match.params.company);
		PurchaseActions.setCompany(this.props.match.params.company);
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
		<div className="row no-margin">
			<SectionView className="col s12 m6 l5">
				<Switch match={action}>
					<PurchaseWelcome path="welcome"/>
					<PurchaseViewer path="ver" url={this.url} history={this.props.history}
						purchaseCode={this.props.match.params.purchase}/>
					
					<PurchaseInsert path="insertar" company={company}/>
					{/*<WarehousesUpdate path="editar" company={company}/>*/}
					<PurchaseUpdateStatus path="cambiar-estado" company={company}
						purchaseCode={this.props.match.params.purchase}/>
					
					<PurchasesDatedReport path="reporte-fechas"/>
				</Switch>
			</SectionView>

			<SectionView className="col s12 m6 l7">
				<PurchasesList url={this.url} history={this.props.history}/>
			</SectionView>
		</div>) : null;
	}
}
