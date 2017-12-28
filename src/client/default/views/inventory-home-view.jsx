
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';

import { CompanyActions, CompanyStore } from '../flux/company';
import { InventoryActions } from '../flux/inventory';

import InfoCard from '../components/info-card.jsx';
import Progress from'../components/progress.jsx';

/****************************************************************************************/

module.exports = class InventoryHomeManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			infoStatus: 'loading',
			warehouses: []
		}

		this.stores = [CompanyStore];
	}

	componentWillMount() {
		super.componentWillMount();
		CompanyActions.setCompany(this.props.match.params.company);
		InventoryActions.setCompany(this.props.match.params.company);

		CompanyActions.authenticate((err, res)=>{
			if(err){
				window.location.replace('/empresa/' + this.props.match.params.company);
			}else{
				InventoryActions.loadSideMenuItems(this.props.match.params.company);

				InventoryActions.loadWarehouses((err, res)=>{
					if(err){
						this.setState({infoStatus: 'error'});
					}else{
						this.setState({warehouses: res.warehouses.rows, infoStatus: 'done'});
					}
				});
			}
		});
		
	}

	onInfoCardRequireArticles(warehouse, callback) {
		InventoryActions.loadWarehouseArticles(warehouse.code, callback);
	}

	renderInfo() {
		switch(this.state.infoStatus) {
		case 'done':
			return this.state.warehouses.map((row, i)=>{
				return <InfoCard key={i} iconName="assessment" data={row}
					onRequireArticles={this.onInfoCardRequireArticles.bind(this)}/>
			});
		case 'loading':
			return (
			<div className="row">
				<Progress type="indeterminate"/>
			</div>);
		}
	}

	render() {
		return this.state.user ? (
		<div className="">
			<div className="row">
				<h5 className="center-align" style={{ textShadow:' 1px 1px 1px #999'}}><b>Inventarios</b></h5>
			</div>
			<div className="row">
				{
					this.renderInfo()
					/*<InfoCard href="#" iconName="assessment" text1="titulo" text2="500" text3="xx" themeColor={'grey darken-1'}/>
				<InfoCard href="#" iconName="assessment" text1="titulo" text2="200" text3="xx" themeColor={'grey darken-1'}/>
				<InfoCard href="#" iconName="assessment" text1="titulo" text2="50" text3="xx" themeColor={'grey darken-1'}/>
				<InfoCard href="#" iconName="assessment" text1="titulo" text2="1000" text3="xx" themeColor={'grey darken-1'}/>*/}
			</div>
		</div>) : null;
	}
}
