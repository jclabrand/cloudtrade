
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import Randomstring from "randomstring";

import { Button } from '../components/button.jsx';
import Form from '../components/form.jsx';
import Input from '../components/input.jsx';
import Select from '../components/select.jsx';
import Table from'../components/table.jsx';
import Progress from'../components/progress.jsx';
import Panel from '../components/sectionCard.jsx';
import { Switch, Case } from '../components/switch.jsx';
import SectionView from '../components/sectionView.jsx';
import Alert from '../components/alert.jsx';
import MessageModal from '../components/modal.jsx';
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import { DataImporter, TransactionMutator } from '../components/data-importer.jsx';

import { InventoryActions } from '../flux/inventory';
import { CompanyActions, CompanyStore } from '../flux/company';
import { WarehousesEntryActions, WarehousesEntryStore } from '../flux/warehouse-entry';

/*****************************************************************************************/

/**
 *	Required props:
 *	props = {
 *		id: ObjectId,
 * 		article: {
 *			description: String,
 *			quantity: Number,
 			entry: {
				 quantity:
				 remark:
			 }
 *		}
 *		quantity: Number
 *	}
 */
/*class ArticleMutator extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.article.entry = { quantity: this.props.article.quantity, remark: '' }
		this.refs.quantity.value(this.props.article.quantity.toString());
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.article !== this.props.article){
			this.props.article.entry = { quantity: this.props.article.quantity, remark: '' }

			this.refs.quantity.value(this.props.article.quantity.toString());
			this.refs.remark.value = '';
		}
	}

	onChange() {
		let quantity = parseInt(this.refs.quantity.value(), 10),
			remark = this.refs.remark.value;

		if(Number.isInteger(quantity)){
			this.refs.quantity.value(quantity.toString()); // This line doesn't trigger a new onChange event
		}else{
			quantity = 0;
			this.refs.quantity.value('0'); // This line doesn't trigger a new onChange event
		}
		
		this.props.article.entry = { quantity, remark }
	}

	render() {
		return(
		<div>
			<h6 style={{fontWeight: 'bold', padding: '0.5rem 0.5rem'}}>
				{'Artículo: ' + this.props.article.name}
			</h6>
			<div className="row no-margin" >
				<div className="col s8">
					<span>{'Cantidad de pedido: ' + this.props.article.quantity}</span>
				</div>
				<Input ref="quantity" name={'quantity' + this.props.id} className="col s4" type="text" required={true}
					placeholder="Cantidad de entrada" label="Cantidad de entrada" onChange={this.onChange.bind(this)}/>
			</div>
			<div className="row no-margin">
				<div className="input-field col s12">
					<textarea ref="remark" id={'remark' + this.props.id} className="materialize-textarea" data-length="1024"
						placeholder="Observación" onChange={this.onChange.bind(this)}/>
					<label htmlFor={'remark' + this.props.id}>Observación</label>
				</div>
			</div>
		</div>)
	}
}*/

/**
 *	Required props:
 *	props = {
 * 		transaction: {
 * 			typeName: String,
 *			business: String,
 *			articles: [{}]
 *		}
 *	}
 */
/*class TransactionMutator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
		<CollapsibleCard title={this.props.transaction.typeName + ': ' + this.props.transaction.business} iconName="shop">
			{
				this.props.transaction.articles ?
				this.props.transaction.articles.map((article, i)=>{
					return (<ArticleMutator key={i} id={i} article={article}/>)
				}) : null
			}
		</CollapsibleCard>)
	}
}*/

/*****************************************************************************************/

class ArticleMutator extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.article.op = {
			quantity: this.props.article.quantity || 0,
			warehouseCode: '',
			remark: '' };
		this.refs.quantity.value(this.props.article.op.quantity.toString());
		this.onChange();
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.article !== this.props.article){
			this.props.article.op = {
				quantity: this.props.article.quantity || 0,
				warehouseCode: '',
				remark: '' };
			this.refs.quantity.value(this.props.article.op.quantity.toString());
			this.refs.remark.value = '';
		}
		this.onChange();
	}

	onChange() {
		let quantity = parseInt(this.refs.quantity.value(), 10),
			remark = this.refs.remark.value,
			warehouseCode = this.refs.warehouse.value();

		if(Number.isInteger(quantity)){
			this.refs.quantity.value(quantity.toString()); // This line doesn't trigger a new onChange event
		}else{
			quantity = 0;
			this.refs.quantity.value('0'); // This line doesn't trigger a new onChange event
		}

		this.props.article.op = { quantity, remark, warehouseCode }
	}

	render() {
		return(
		<div>
			<h6 style={{fontWeight: 'bold', padding: '0.5rem 0.5rem'}}>
				{'Artículo: ' + this.props.article.name}
			</h6>
			<div className="row no-margin" >
				<div className="col s8">
					<span>{'Cantidad solicitada en ' + this.props.transactType + ': ' + this.props.article.quantity}</span>
				</div>
				<Input ref="quantity" name={'quantity' + this.props.id} className="col s4" type="text" required={true}
					placeholder="Cantidad" label="Cantidad" onChange={this.onChange.bind(this)}/>
			</div>

			<div className="row no-margin" >
				<Select ref="warehouse" className="col s12" options={this.props.warehouses} nameField="name" valueField="code"
					label="Almacén" placeholder="Seleccione un almacén" onChange={this.onChange.bind(this)}/>
			</div>
			<div className="row no-margin">
				<div className="input-field col s12">
					<textarea ref="remark" id={'remark' + this.props.id} className="materialize-textarea" data-length="10240"
						placeholder="Observación" onChange={this.onChange.bind(this)}/>
					<label htmlFor={'remark' + this.props.id}>Observación</label>
				</div>
			</div>
		</div>)
	}
}

class TransactionMutatorLocal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			warehouses: []
		}
	}

	componentWillMount() {
		WarehousesEntryActions.findAllWarehouses((err, res)=>{
			if(res && res.warehouses){
				this.setState({warehouses: res.warehouses.rows});
			}
		});
	}

	render() {
		return(
		<CollapsibleCard title={this.props.transaction.typeName + ': ' + this.props.transaction.business} iconName="shop">
			{
				this.props.transaction.articles ?
				this.props.transaction.articles.map((article, i)=>{
					return (<ArticleMutator key={i} id={i} article={article} warehouses={this.state.warehouses}
								transactType={this.props.transaction.typeName}/>)
				}) : null
			}
		</CollapsibleCard>)
	}
}

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

class WarehouseEntriesWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<Panel title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administracion de entradas a almacenes."/>
			</div>
		</Panel>);
	}
}

class WarehouseEntriesList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehousesEntryStore;
		this.storeKeys = ['list', 'listStatus'];

		this.dropdowOptions = [
			{
				text:'Registrar nueva entrada',
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
		WarehousesEntryActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate() {
		WarehousesEntryActions.findAll();
	}

	render() {
		return(
		<Panel title="Lista de entradas" iconName="view_list" menuID="warehouseEntriesList" menuItems={this.dropdowOptions}>

			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todas las entradas registradas en los almacenes.
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
						<Alert type="error" text="ERROR: No se pudo cargar la lista de entradas a almacenes"/>
					</Case>
				</Switch>
			</div>
		</Panel>)
	}
}

class WarehousesEntryInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			transactType: 'purchases',
			//warehouses: []
		}

		this.stores = [WarehousesEntryStore];

		this._formValidationRules = {
		}
	}

	/*componentWillMount() {
		super.componentWillMount();

		WarehousesEntryActions.findAllWarehouses((err, res)=>{
			if(res && res.warehouses){
				this.setState({warehouses: res.warehouses.rows});
			}
		});
	}*/

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onFormSubmit(form) {
		let selectedTransactions = this.refs.transactions.getSelectedTransactions();

		let data = {
			transactionsTypeName: this.state.transactType,
			description: this.refs.entryDescription.value(),
			entryDate: this.refs.entryDate.value(),
			transactions: selectedTransactions.map(tran=>{
				return {
					code: tran.code,
					//warehouseCode: (this.state.transactType === 'transfers') ? tran.destinationWarehouseCode : this.refs.warehouse.value(),
					articles: tran.articles.map(article=>{
						return {
							warehouseCode: (this.state.transactType === 'transfers') ? tran.destinationWarehouseCode : article.op.warehouseCode,
							code: article.code,
							quantity: article.op.quantity,
							remark: article.op.remark
						}
					})
				}
			})
 		}

		this.refs.messageModal.show('sending');
		WarehousesEntryActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	onRequirePurchases(callback) {
		WarehousesEntryActions.findAllDeliveredPurchases((err, res)=>{
			if(res){ callback(null, {data: res.purchases}); }else{ callback(err); }
		});
	}

	onRequirePurchaseArticles(purchase, callback) {
		WarehousesEntryActions.findAllPurchaseArticles(purchase.code, (err, res)=>{
			if(err){
				callback(err);
			}else{
				purchase.typeName = 'Compra',
				purchase.articles = res.purchaseArticles;
				callback(null, res.purchaseArticles);
			}
		});
	}

	onRequireTransfers(callback) {
		WarehousesEntryActions.findAllWithdrawnTransfers((err, res)=>{
			if(res){ callback(null, {data: res.transfers}); }else{ callback(err); }
		});
	}

	onRequireTransferArticles(transfer, callback) {
		WarehousesEntryActions.findAllTransferArticles(transfer.code, (err, res)=>{
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
		let purchasesColumns = [
			{ name: 'business', text: 'Asunto', visible: true },
			{ name: 'providerName', text: 'Proveedor', visible: true }
		];

		let transfersColumns = [
			{ name: 'business', text: 'Asunto', visible: true },
			{ name: 'originWarehouseName', text: 'Almacen origen', visible: true },
			{ name: 'destinationWarehouseName', text: 'Almacén destino', visible: true }
		];

		return(
		<Panel title="Insertar nueva entrada a almacén" iconName="library_books">
			<div className="row">
				<h6 style={{padding: '0rem 1rem'}}>Introduzca los datos para la nueva entrada a almacén.</h6>
			</div>
			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Detalles de la entrada</h6>
				<div className="row no-margin">
					<Input ref="entryDescription" name="entryDescription" type="text" className="col s12"
						label="Descripción" placeholder="Descripción" required={true}/>
				</div>
				<div className="row no-margin">
					<Input ref="entryDate" name="entryDate" type="date" className="col s12"
						label="Fecha de realización de la entrada" placeholder="Fecha de realización de la entrada"/>
				</div>
				<div className="row no-margin">
					<Select ref="transactType" className="col s12" nameField="name" valueField="value"
						options={[{name:'Compras',value:'purchases'},{name:'Transferencias',value:'transfers'},{name:'Otros',value:'custom'}]}
						onChange={this.onChangeTransactType.bind(this)} label="Transacción" placeholder="Seleccione el tipo de operación"/>
				</div>
				<div>
					<Switch match={this.state.transactType}>
						<Case path="purchases">
							<DataImporter ref="transactions" columns={purchasesColumns} dataComponent={TransactionMutatorLocal} group={true} filterBy="business"
								loadData={this.onRequirePurchases.bind(this)} loadDataSubitem={this.onRequirePurchaseArticles.bind(this)}
								onChange={this.onDataImporterChange.bind(this)}/>

							{/*<Select ref="warehouse" className="col s12" options={this.state.warehouses} nameField="name" valueField="code"
								label="Almacén" placeholder="Seleccione un almacén"/>*/}
						</Case>
						<Case path="transfers">
							{/*<DataImporter ref="transactions" loadData={this.onUpdateTransfers.bind(this)} columns={transfersColumns}
								onChange={this.onDataImporterChange.bind(this)}/>*/}

							<DataImporter ref="transactions" columns={transfersColumns} dataComponent={TransactionMutator} group={true} filterBy="business"
								loadData={this.onRequireTransfers.bind(this)} loadDataSubitem={this.onRequireTransferArticles.bind(this)}
								onChange={this.onDataImporterChange.bind(this)}/>
						</Case>
						<Case path="custom">
							<div>(Esta opción no está habilitada)</div>
						</Case>
					</Switch>
				</div>
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

class WarehousesEntriesViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehousesEntryStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.entryCode){
			WarehousesEntryActions.findOne(this.props.entryCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.entryCode !== nextProps.entryCode){
			if(nextProps.entryCode){
				WarehousesEntryActions.findOne(nextProps.entryCode);
			}
		}
	}

	render(){
		var item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready': return item ? (
			<Panel title="Entrada a almacén" iconName="store">
				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>{item.description}</h6>


				<div className="row" style={{marginBottom: '0.5rem'}}>
					<ItemProperty name="Tipo de Operación" value={item.tTransactionsTypeName} className="col s12 m6"/>
					<ItemProperty name="Fecha de entrada" value={item.entryDate} className="col s12 m6"/>
				</div>

				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>Información sobre los artículos</h6>
				<Collapsible>
					{
						item.transactions ?
						item.transactions.map(function(tran, i){
							{/*let transactionsTypeName;
							switch(tran.transactionsTypeName){
								case 'purchases': transactionsTypeName = 'Compra: '; break;
								case 'transfers': transactionsTypeName = 'Transferencia: '; break;
								case 'others': transactionsTypeName = 'Entrada: '; break;
							}*/}
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
			<Panel title="Entrada a almacén" iconName="store">
				<p>Seleccione una elemento de la lista de entradas a almacén</p>
			</Panel>);
		case 'loading': return (
			<Panel title="Cargando datos..." iconName="store">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		case 'error': return (
			<Panel title="Entrada a almacén" iconName="store">
				<Alert type="error" text="ERROR: No se pudo cargar los datos de la entrada"/>
			</Panel>);
		}
	}
}

module.exports = class WarehouseEntriesManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [CompanyStore, WarehousesEntryStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/empresa/' + this.props.match.params.company + '/adm/inventarios/almacenes-entradas';
		CompanyActions.setCompany(this.props.match.params.company);
		WarehousesEntryActions.setCompany(this.props.match.params.company);
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
			<SectionView className="col s12 m6 l5">
				<Switch match={action}>
					<WarehouseEntriesWelcome path="welcome"/>
					<WarehousesEntriesViewer path="ver" url={this.url} history={this.props.history}
						entryCode={this.props.match.params.entry}/>
					<WarehousesEntryInsert path="insertar" company={company}/>
					{/*<WarehousesUpdate path="editar" company={company}/>*/}
				</Switch>
			</SectionView>

			<SectionView className="col s12 m6 l7">
				<WarehouseEntriesList url={this.url} history={this.props.history}/>
			</SectionView>
		</div>) : null;
	}
}
