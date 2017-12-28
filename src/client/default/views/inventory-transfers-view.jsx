
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
import {Button} from '../components/button.jsx';
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
import { TransfersActions, TransfersStore } from '../flux/transfers';

import {PretyDate} from '../tools/prety-date';

/*****************************************************************************************/

class ArticleMutator extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.article.transfer = { quantity: 0, unitPrice: 0, remark: '' }
		this.refs.quantity.value('0');
		this.refs.unitPrice.value('0');
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.article !== this.props.article){
			this.props.article.transfer = { quantity: 0, unitPrice: 0, remark: '' }

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
		
		this.props.article.transfer.quantity = quantity;
	}

	onUnitPriceChange() {
		this.props.article.transfer.unitPrice = parseFloat(this.refs.unitPrice.value());
	}

	onRemarkChange() {
		this.props.article.transfer.remark = this.refs.remark.value;;
	}

	render() {
		return(
		<div>
			<h6 style={{fontWeight: 'bold', padding: '0.5rem 0.5rem'}}>
				{'Artículo: ' + this.props.article.name}
			</h6>
			<div className="row no-margin" >
				<div className="col s8">
					<span>{'Stock actual: ' + this.props.article.stock}</span>
				</div>
			</div>
			<div className="row no-margin" >
				<Input ref="quantity" name={'quantity' + this.props.id} placeholder="Cantidad" label="Cantidad *" className="col s6" type="text"
					onChange={this.onQuantityChange.bind(this)} required={true}/>
				<Input ref="unitPrice" name={'unitPrice' + this.props.id} placeholder="Precio unitario" label="Precio unitario *" className="col s6" type="text"
					onChange={this.onUnitPriceChange.bind(this)} required={true}/>
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

class TransfersWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<Panel title="Bienvenido" iconName="swap_horiz">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de transferencias."/>
			</div>
		</Panel>);
	}
}

class TransfersList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = TransfersStore;

		this.dropdowOptions = [
			{
				text:'Crear nueva transferencia',
				select: this.onDropdowOptionInsert.bind(this)
			},
			{
				text:'Crear reporte por fechas',
				select: this.onDropdowOptionDatedReport.bind(this)
			},
			{
				text: 'Actualizar lista',
				select: this.onDropdowOptionUpdate.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();
		TransfersActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionDatedReport() {
		this.props.history.push(this.props.url + '/reporte-fechas/' + Randomstring.generate());
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate() {
		TransfersActions.findAll();
	}

	render() {
		return(
		<Panel title="Lista de ordenes de transferencia" iconName="view_list" menuID="shoppingList" menuItems={this.dropdowOptions}>
			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todas las transferencias registradas en la base de datos.
				</span>
			</div>

			<div style={{padding: '0rem 0.5rem'}}>
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
						<Alert type="error" text="ERROR: No se pudo cargar la lista de transferencias"/>
					</Case>
				</Switch>
			</div>

		</Panel>)
	}
}

class TransferInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			originWarehouses: [],
			destinationWarehouses: []
		}

		this.stores = [TransfersStore];

		this._formValidationRules = {
		}
	}

	componentWillMount() {
		super.componentWillMount();

		TransfersActions.findAllWarehouses((err, res)=>{
			if(res && res.warehouses){
				this.setState({originWarehouses: res.warehouses.rows});
			}
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.originWarehouses !== this.state.originWarehouses){
			this.onWarehouseOriginChange();
		}

		this.onWarehouseDestinationChange();
	}

	onFormSubmit(form) {
		let transactions = this.refs.transactions.getSelectedTransactions();

		var data = {
			business: this.refs.transfersBusiness.value(),
			originWarehouseCode: this.refs.origin.value(),
			destinationWarehouseCode: this.refs.destination.value(),
			description: this.refs.transfersDescription.value,
			articles: transactions.map(article=>{
				return {
					code: article.code,
					quantity: article.transfer.quantity,
					unitPrice: article.transfer.unitPrice,
					remark: article.transfer.remark
				}
			})
		}

		let p1 = new Promise((resolve, reject)=>{
			if(data.business.length > 0){ resolve(); }else{ reject({opencard: 0}); }
		});
		let p2 = new Promise((resolve, reject)=>{
			if(data.articles.length > 0){ resolve(); }else{ reject({opencard: 2}); }
		});

		Promise.all([p1, p2]).then(values => {
			this.refs.messageModal.show('sending');
			TransfersActions.insertOne(data, (err, res)=>{
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

	onWarehouseOriginChange() {
		let sow = this.refs.origin.value();
		let sdw = this.refs.destination.value();

		if(!sow || !sdw){ this.refs.submitBtn.disable(); }
		else{ this.refs.submitBtn.enable(); }

		let dws = this.state.originWarehouses.map((w)=>{
			return w.code !== sow ? w : null;
		});
		this.setState({destinationWarehouses: dws});
		this.refs.transactions.clearSelectedTransactions();
	}

	onWarehouseDestinationChange() {
		let sdw = this.refs.destination.value();
		if(!sdw){ this.refs.submitBtn.disable(); }
		else{ this.refs.submitBtn.enable(); }
	}

	onDataImporterChange() {
		Materialize.updateTextFields();
		this.refs.insertForm.revalidate();
	}

	onRequireArticles(callback) {
		TransfersActions.findAllArticlesFor(this.refs.origin.value(), (err, res)=>{
			if(res){ callback(null, {data: res.articles}); }else{ callback(err); }
		});
	}

	render() {
		let articlesColumns = [
			{ name: 'name', text: 'Nombre', visible: true },
			{ name: 'brand', text: 'Marca', visible: true },
			{ name: 'stock', text: 'Stock', visible: true }
		];

		return(
		<Panel title="Crear una orden de transferencia" iconName="swap_horiz" >
			<div style={{padding: '0rem 1rem'}}>
				<span>Introduzca los datos para la orden de transferencia.</span>
			</div>
			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<Collapsible ref="collapsible" defaultActiveIndex={0}>
					<CollapsibleCard title="Información de la orden de transferencia" iconName="switch_camera">
						<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Información de la transferencia</h6>
						<div className="row no-margin">
							<Input ref="transfersBusiness" name="transfersBusiness" type="text" className="col s12"
								label="Asunto *" placeholder="(p. ej. : Equipo de oficina)" required={true}/>
						</div>

						<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Detalles de los almacenes</h6>
						<div className="row no-margin">
							<Select ref="origin" className="col s12" options={this.state.originWarehouses} nameField="name" valueField="code"
								label="Almacén de origen *" placeholder="Seleccione un almacén de origen" onChange={this.onWarehouseOriginChange.bind(this)}/>
						</div>
						<div className="row no-margin">
							<Select ref="destination" className="col s12" options={this.state.destinationWarehouses} nameField="name" valueField="code"
								label="Almacén de destino *" placeholder="Seleccione un almacén de destino" onChange={this.onWarehouseDestinationChange.bind(this)}/>
						</div>
					</CollapsibleCard>
					<CollapsibleCard title="Información adicional" iconName="import_contacts">
						<div className="row no-margin">
							<div className="input-field col s12">
								<textarea ref="transfersDescription" id="textarea1" className="materialize-textarea" data-length="1024" placeholder="Descripción">
								</textarea>
								<label htmlFor="textarea1">{'Detalles de la descripción'}</label>
							</div>
						</div>
					</CollapsibleCard>
					<CollapsibleCard title="Detalles sobre los elementos" iconName="library_books">
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

class TransferViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.stores = [TransfersStore];

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

		if(this.props.transferCode){
			TransfersActions.findOne(this.props.transferCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.transferCode !== nextProps.transferCode){
			if(nextProps.transferCode){
				TransfersActions.findOne(nextProps.transferCode);
			}
		}
	}

	onDropdowOptionUpdateStatus() {
		this.props.history.push(this.props.url + '/cambiar-estado/' + this.props.transferCode);
	}

	onDropdowOptionDetailReport() {
		this.refs.messageModal.show('sending');
		TransfersActions.getDetailReport(this.props.transferCode, (err, res)=>{
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
		case 'ready': return item ? (
			<Panel title="Orden de transferencia" iconName="swap_horiz" menuID="transferViewer" menuItems={this.dropdowOptions}>
				<Collapsible defaultActiveIndex={0}>
					<CollapsibleCard title="Datos de la compra" iconName="assignment_turned_in">
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Asunto" value={item.business} className="col s12"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Número" value={item.seq} className="col s12 m6"/>
							<ItemProperty name="Estado" value={item.status} className="col s12 m6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Almacén origen" value={item.originWarehouse.name} className="col s12"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Almacén destino" value={item.destinationWarehouse.name} className="col s12"/>
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
									<ItemProperty name="Observación" value={article.remark} className="col s12"/>
								</div>
							</CollapsibleCard>)
						}) : null
					}
				</Collapsible>
				<MessageModal ref="messageModal"/>
			</Panel>) : (
			<Panel title="Orden de transferencia" iconName="swap_horiz">
				<p>Seleccione una elemento de la lista de transferencias</p>
			</Panel>);
		case 'loading':
			return (
			<Panel title="Cargando datos de transferencia..." iconName="swap_horiz">
				<div className="row"><Progress type="indeterminate"/></div>
			</Panel>);

		case 'error':
			return (
			<Panel title="Orden de transferencia" iconName="swap_horiz">
				<Alert type="error" text="ERROR: No se pudo cargar los datos"/>
			</Panel>);
		}
	}
}

class TransferUpdateStatus extends Reflux.Component {
	constructor(props){
		super(props);

		this.state = {}

		this.store = TransfersStore;
	}

	componentDidMount() {
		if(this.state.selectedItem){
			if(this.props.transferCode === this.state.selectedItem.code){
				this.onSelectStatus();
			}else{
				TransfersActions.findOne(this.props.transferCode);
			}
		}else{
			TransfersActions.findOne(this.props.transferCode);
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
		TransfersActions.updateOneStatus(data, (err, res)=>{
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
			<Panel title="Orden de transferencia" iconName="swap_horiz">
				<div style={{padding: '0rem 1rem'}}>
					<span>Cambiar estado de la orden de transferencia.</span>
				</div>
				<h6 style={{fontWeight: 'bold', padding: '0.3rem 0.8rem'}}>{item.business}</h6>

				<Form ref="updateStatusForm" onSubmit={this.onFormSubmit.bind(this)}>
					<div className="row no-margin" style={{padding: '0rem 0rem 1rem 1.5rem'}}>
						<h6>{'Estado actual: ' + item.status}</h6>
					</div>
					<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
						<Select ref="status" className="col s12" nameField="name" valueField="value"
							options={[{name:'Creado', value:'created'}, {name:'Aprobado', value:'approved'}, {name:'Cancelado', value:'cancelled'}, {name:'Retrasado', value:'delayed'}]}
							label="Nuevo estado" placeholder="Seleccione un estado" onChange={this.onSelectStatus.bind(this)}/>
					</div>
					<div className="row no-margin" style={{padding: '0rem 0.8rem 1rem 0.8rem'}}>
						<h6 style={{fontWeight: 'bold'}}>Finalizar</h6>
						<Button ref="submitBtn" className="col s12 red darken-2" text="Guardar datos" iconName="send" type="submit"/>
					</div>
				</Form>
				<MessageModal ref="messageModal"/>
			</Panel>) : (
			<Panel title="Orden de transferencia" iconName="swap_horiz">
				<p>Seleccione un elemento de la lista de transferencias</p>
			</Panel>);
		case 'loading':
			return (
			<Panel title="Cargando datos de transferencia..." iconName="swap_horiz">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		case 'error':
			return (
			<Panel title="Orden de transferencia" iconName="swap_horiz">
				<Alert type="error" text="ERROR: No se pudo cargar los datos"/>
			</Panel>);
		}
	}
}

class TransfersDatedReport extends Reflux.Component {
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
			TransfersActions.getDatedReport(data, (err, res)=>{
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
		<Panel title="Crear reporte de transferencias" iconName="swap_horiz">
			<div style={{padding: '0rem 1rem'}}>
				<span>Seleccione las fechas para el reporte de transferencias.</span>
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

/****************************************************************************************/

module.exports = class TransfersManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [CompanyStore, TransfersStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/empresa/' + this.props.match.params.company + '/adm/inventarios/transferencias';

		CompanyActions.setCompany(this.props.match.params.company);
		TransfersActions.setCompany(this.props.match.params.company);
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
		<div className="row" style={{backgroundColor: '#eeeeee'}}>
			<SectionView className="col s12 m6 l4">
				<Switch match={action}>
					<TransfersWelcome path="welcome"/>
					<TransferInsert path="insertar" company={company}/>
					<TransferViewer path="ver" url={this.url} history={this.props.history}
						transferCode={this.props.match.params.transfer}/>

					<TransferUpdateStatus path="cambiar-estado" company={company}
						transferCode={this.props.match.params.transfer}/>

					<TransfersDatedReport path="reporte-fechas"/>
				</Switch>
			</SectionView>

			<SectionView className="col s12 m6 l8">
				<TransfersList url={this.url} history={this.props.history}/>
			</SectionView>
		</div>) : null;
	}
}
