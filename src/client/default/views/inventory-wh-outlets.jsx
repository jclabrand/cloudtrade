
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import Randomstring from "randomstring";

import Alert from '../components/alert.jsx';
import { Button } from '../components/button.jsx';
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import { DataImporter, TransactionMutator } from '../components/data-importer.jsx';
import Form from '../components/form.jsx';
import Input from '../components/input.jsx';
import MessageModal from '../components/modal.jsx';
import Panel from '../components/sectionCard.jsx';
import Progress from'../components/progress.jsx';
import SectionView from '../components/sectionView.jsx';
import Select from '../components/select.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from'../components/table.jsx';

import { InventoryActions } from '../flux/inventory';
import { CompanyActions, CompanyStore } from '../flux/company';
import { WarehouseOutletActions, WarehouseOutletStore } from '../flux/warehouse-outlet';

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

class WarehouseOutletWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<Panel title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página administracion de salidas de almacenes."/>
			</div>
		</Panel>);
	}
}

class WarehouseOutletList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.store = WarehouseOutletStore;

		this.dropdowOptions = [
			{
				text:'Registrar nueva salida',
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
		WarehouseOutletActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate() {
		WarehouseOutletActions.findAll();
	}

	render() {
		return(
		<Panel title="Lista de salidas" iconName="view_list" menuID="warehouseOutletsList" menuItems={this.dropdowOptions}>

			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todas las salidas registradas en los almacenes.
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
						<Alert type="error" text="ERROR: No se pudo cargar la lista de salidas de almacenes"/>
					</Case>
				</Switch>
			</div>
		</Panel>)
	}
}

class WarehouseOutletInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			transactType: 'transfers',
			warehouses: []
		}

		this._formValidationRules = {
		}
	}

	componentWillMount() {
		super.componentWillMount();

		WarehouseOutletActions.findAllWarehouses((err, res)=>{
			if(res && res.warehouses){ this.setState({warehouses: res.warehouses.rows}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onFormSubmit(form) {
		let selectedTransactions = this.refs.transactions.getSelectedTransactions();

		let data = {
			transactionsTypeName: this.state.transactType,
			description: this.refs.outletDescription.value(),
			outletDate: this.refs.outletDate.value(),
			transactions: selectedTransactions.map(tran=>{
				return {
					code: tran.code,
					//warehouseCode: (this.state.transactType === 'transfers') ? tran.originWarehouseCode : this.refs.warehouse.value(),
					articles: tran.articles.map(article=>{
						return {
							code: article.code,
							warehouseCode: (this.state.transactType === 'transfers') ? tran.originWarehouseCode : article.op.warehouseCode,
							quantity: article.op.quantity,
							remark: article.op.remark
						}
					})
				}
			})
		}

		this.refs.messageModal.show('sending');
		WarehouseOutletActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	onRequireTransfers(callback) {
		WarehouseOutletActions.findAllApprovedTransfers((err, res)=>{
			if(res){ callback(null, {data: res.transfers}); }else{ callback(err); }
		});
	}

	onRequireTransferArticles(transfer, callback) {
		WarehouseOutletActions.findAllTransferArticles(transfer.code, (err, res)=>{
			if(err){
				callback(err);
			}else{
				transfer.typeName = 'Transferencia',
				transfer.articles = res.transferArticles;
				callback(null, res.transferArticles);
			}
		});
	}

	onDataImporterChange() {
		Materialize.updateTextFields();
		this.refs.insertForm.revalidate();
	}

	onChangeTransactType(value) {
		this.setState({transactType: value});

		if(value === 'custom'){ this.refs.submitBtn.disable(); }
		else{ this.refs.submitBtn.enable(); }
	}

	render() {
		let transfersColumns = [
			{ name: 'business', text: 'Asunto', visible: true },
			{ name: 'originWarehouseName', text: 'Almacen origen', visible: true },
			{ name: 'destinationWarehouseName', text: 'Almacén destino', visible: true }
		];

		return(
		<Panel title="Insertar nueva salida de almacén" iconName="library_books">
			<div className="row">
				<h6 style={{padding: '0rem 1rem'}}>Introduzca los datos para la nueva salida de almacén.</h6>
			</div>
			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Detalles de la salida</h6>
				<div className="row no-margin">
					<Input ref="outletDescription" name="outletDescription" type="text" className="col s12"
						label="Descripción" placeholder="Descripción" required={true}/>
				</div>
				<div className="row no-margin">
					<Input ref="outletDate" name="outletDate" type="date" className="col s12"
						label="Fecha de realización de la salida" placeholder="Fecha de realización de la salida"/>
				</div>
				<div className="row no-margin">
					<Select ref="transactType" className="col s12" nameField="name" valueField="value"
						options={[{name:'Transferencias',value:'transfers'},{name:'Otros',value:'custom'}]}
						onChange={this.onChangeTransactType.bind(this)} label="Transacción" placeholder="Seleccione el tipo de operación"/>
				</div>
				<Switch match={this.state.transactType}>
					<Case path="transfers">
						<DataImporter ref="transactions" columns={transfersColumns} dataComponent={TransactionMutator} group={true} filterBy="business"
							loadData={this.onRequireTransfers.bind(this)} loadDataSubitem={this.onRequireTransferArticles.bind(this)}
							onChange={this.onDataImporterChange.bind(this)}/>
					</Case>
					<Case path="custom">
						<div>(Esta opción no está habilitada)</div>
					</Case>
				</Switch>
				<div>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Finalizar</h6>
					<div className="row no-margin" style={{padding: '0rem 0.5rem 1rem'}}>
						<Button ref="submitBtn" className="col s12 red darken-2" type="submit" text="Guardar datos" iconName="send"/>
					</div>
				</div>
			</Form>
			<MessageModal ref="messageModal"/>
		</Panel>)
	}
}

class WarehouseOutletViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehouseOutletStore;
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.outletCode){
			WarehouseOutletActions.findOne(this.props.outletCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.outletCode !== nextProps.outletCode){
			if(nextProps.outletCode){
				WarehouseOutletActions.findOne(nextProps.outletCode);
			}
		}
	}

	render(){
		let item = this.state.selectedItem,
			transactionsTypeName;

		switch(this.state.viewerStatus){
		case 'ready': return item ? (
			<Panel title="Salida de almacén" iconName="store">
				
				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>{item.description}</h6>

				<div className="row" style={{marginBottom: '0.5rem'}}>
					<ItemProperty name="Tipo de Operación" value={item.tTransactionsTypeName} className="col s12 m6"/>
					<ItemProperty name="Fecha de salida" value={item.outletDate} className="col s12 m6"/>
				</div>

				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>Información sobre los artículos</h6>
				<Collapsible>
					{
						item.transactions ?
						item.transactions.map(function(tran, i){
							return (
							<CollapsibleCard key={i} title={item.tTransactionsTypeName + ': ' + tran.business} iconName="view_stream">
								{
									tran.articles.map((article, ii)=>{
										return (
										<div key={ii} className="row" style={{marginBottom: '0.5rem'}}>
											<div className="card grey lighten-2">
       											<div className="card-content" style={{padding: '0.5rem'}}>
													<h6 style={{fontWeight: 'bold', padding: '0.5rem'}}>{article.name}</h6>
													<div className="row no-margin">
														<ItemProperty name="Almacén" value={article.warehouseName} className="col s12"/>
													</div>
													<div className="row no-margin">
														<ItemProperty name="Cantidad" value={article.quantity} className="col s4"/>
														<ItemProperty name="Detalle" value={article.remark} className="col s8"/>
													</div>
												</div>
											</div>
										</div>)
									})
								}
							</CollapsibleCard>)
						}) : null
					}
				</Collapsible>
			</Panel>) : (
			<Panel title="Salida de almacén" iconName="store">
				<p>Seleccione una elemento de la lista de salidas de almacén</p>
			</Panel>);
		case 'loading': return (
			<Panel title="Cargando datos..." iconName="store">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		case 'error': return (
			<Panel title="Salida de almacén" iconName="store">
				<Alert type="error" text="ERROR: No se pudo cargar los datos de la salida"/>
			</Panel>);
		}
	}
}

module.exports = class WarehouseOutletsManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [CompanyStore, WarehouseOutletStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/empresa/' + this.props.match.params.company + '/adm/inventarios/almacenes-salidas';

		CompanyActions.setCompany(this.props.match.params.company);
		WarehouseOutletActions.setCompany(this.props.match.params.company);
		CompanyActions.authenticate((err, res)=>{
			if(err){ window.location.replace('/empresa/' + this.props.match.params.company); }
		});
		InventoryActions.loadSideMenuItems(this.props.match.params.company);
	}

	render() {
		let action = this.props.match.params.action ? this.props.match.params.action : 'welcome',
			company = this.props.match.params.company;

		return this.state.user ? (
		<div className="row" style={{backgroundColor: '#eeeeee'}}>
			<SectionView className="col s12 m6 l5">
				<Switch match={action}>
					<WarehouseOutletWelcome path="welcome"/>
					<WarehouseOutletInsert path="insertar"/>
					<WarehouseOutletViewer path="ver" url={this.url} history={this.props.history}
						outletCode={this.props.match.params.outlet}/>
				</Switch>
			</SectionView>

			<SectionView className="col s12 m6 l7">
				<WarehouseOutletList url={this.url} history={this.props.history}/>
			</SectionView>
		</div>) : null;
	}
}
