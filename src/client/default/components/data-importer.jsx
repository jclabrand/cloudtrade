
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

import Alert from './alert.jsx';
import { Button } from './button.jsx';
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import Input from './input.jsx';
import Progress from './progress.jsx';
import { Switch, Case } from './switch.jsx';
import Table from './table.jsx';

/*****************************************************************************************/

class ArticleMutator extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.article.op = { quantity: this.props.article.quantity || 0, remark: '' }
		this.refs.quantity.value(this.props.article.op.quantity.toString());
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.article !== this.props.article){
			this.props.article.op = { quantity: this.props.article.quantity || 0, remark: '' }
			this.refs.quantity.value(this.props.article.op.quantity.toString());
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
		
		this.props.article.op = { quantity, remark }
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

class TransactionMutator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
		<CollapsibleCard title={this.props.transaction.typeName + ': ' + this.props.transaction.business} iconName="shop">
			{
				this.props.transaction.articles ?
				this.props.transaction.articles.map((article, i)=>{
					return (<ArticleMutator key={i} id={i} article={article} transactType={this.props.transaction.typeName}/>)
				}) : null
			}
		</CollapsibleCard>)
	}
}

class DataImporter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectorStatus: 'ready',
			viewerStatus: 'ready',

			columns: this.props.columns,
			rows: [],

			selectedTransactions: [],
		}
	}

	componentDidMount() {
		$(this.refs.selector).hide();
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.columns !== this.props.columns){
			this.setState({columns: this.props.columns, rows: []});
			this.clearSelectedTransactions();
		}
	}

	toggleView() {
		$(this.refs.selected).slideToggle();
		$(this.refs.selector).slideToggle();
	}

	onBeginSelect() {
		this.toggleView();

		this.setState({selectorStatus: 'loading'});
		this.props.loadData((err, res)=>{
			if(err){
				this.setState({selectorStatus: 'error'});
			}else{
				let xrows = res.data.rows;
				this.state.selectedTransactions.forEach(tran=>{
					res.data.rows.find(row=>{
						return (row.code === tran.code) ? row._tableChecked = true : false
					});
				});
				this.setState({selectorStatus: 'ready', rows: res.data.rows});
			}
		});
	}

	onEndSelect() {
		this.toggleView();

		let data = this.refs.articlesTable.getCheckedRows();

		this.setState({viewerStatus: 'loading'});
		let promises = data.map(item=>{
			return new Promise((resolve, reject)=>{
				if(this.props.loadDataSubitem){
					this.props.loadDataSubitem(item, (err, res)=>{
						if(err){ reject(err); }
						else{resolve(res);}
					});
				}else{
					resolve({});
				}
			});
		});

		Promise.all(promises).then(res=>{
			this.setState({viewerStatus: 'ready', selectedTransactions: data});
			this.props.onChange(data);
		}).catch(err=>{
			console.log(err);
			this.setState({viewerStatus: 'error'});
		});
	}

	onCancelSelect() {
		this.toggleView();
	}

	getSelectedTransactions() {
		return this.state.selectedTransactions;
	}

	clearSelectedTransactions() {
		this.setState({selectedTransactions: []});
		$(this.refs.selected).slideDown();
		$(this.refs.selector).slideUp();
	}

	render() {
		let DataComponent = this.props.dataComponent;
		return(
		<div>
			<div ref="selected" className="row no-margin">
				<Switch match={this.state.viewerStatus}>
					<Case path="loading" className="center">
						<div className="row">
							<Progress type="indeterminate"/>
						</div>
					</Case>
					<Case path="ready">
						{
							this.props.group ?
							<Collapsible ref="collapsible">
								{
									this.state.selectedTransactions.map((transaction, i)=>{
										return(<DataComponent key={i} transaction={transaction}/>)
									})
								}
							</Collapsible> :
							<div>
								{
									this.state.selectedTransactions.map((transaction, i)=>{
										return(<DataComponent key={i} transaction={transaction}/>)
									})
								}
							</div>
						}
						<div className="row" style={{margin: '1rem 0.5rem'}}>
							<div className="col s6" style={{padding: '0rem 0.3rem'}}>
								<Button className="light-blue darken-2" text="Agregar elementos" iconName="add"
									onClick={this.onBeginSelect.bind(this)}/>
							</div>
						</div>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar los elementos"/>
					</Case>
				</Switch>
			</div>
			<div ref="selector" className="row no-margin">
				<Switch match={this.state.selectorStatus}>
					<Case path="loading" className="center">
						<div className="row">
							<Progress type="indeterminate"/>
						</div>
					</Case>
					<Case path="ready">
						<h6 style={{padding: '0rem 0.3rem'}}>Seleccione uno o varios elementos</h6>

						<Table ref="articlesTable" columns={this.state.columns} rows={this.state.rows} check={true} filterBy={this.props.filterBy}/>

						<div className="row">
							<div className="col s6" style={{padding: '0rem 0.3rem'}}>
								<Button className="blue-grey darken-1" text="Agregar elementos" iconName="playlist_add_check"
									onClick={this.onEndSelect.bind(this)}/>
							</div>
							<div className="col s6" style={{padding: '0rem 0.3rem'}}>
								<Button className="red" text="Cancelar" iconName="cancel"
									onClick={this.onCancelSelect.bind(this)}/>
							</div>
						</div>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de elementos"/>
						<div className="row">
							<div className="col s6 offset-s6">
								<Button className="red" text="Cancelar" iconName="cancel"
									onClick={this.onCancelSelect.bind(this)}/>
							</div>
						</div>
					</Case>
				</Switch>
			</div>
		</div>)
	}
}

export { DataImporter, TransactionMutator }
