
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import api from '../../api';

/****************************************************************************************/

var InventoryActions = Reflux.createActions(['setCompany', 'loadSideMenuItems', 'loadWarehouses', 'loadWarehouseArticles']);

class InventoryStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: '',
			sideMenuItems: []
        }

        this.listenables = InventoryActions;
    }

	onSetCompany(company) {
		this.setState({company});
	}

	onLoadSideMenuItems(company) {
		var loadedData = [
			{text: 'Inicio', iconName: 'home', linkTo: '/empresa/' + company + '/adm/inventarios'},
			{text: 'Artículos', iconName: 'library_books', linkTo: '/empresa/' + company + '/adm/inventarios/articulos' },
			{
				text: 'Almacenes',
				iconName: 'store',
				subItems: [
					{
						text: 'Lista',
						iconName: 'view_list',
						linkTo: '/empresa/' + company + '/adm/inventarios/almacenes',
					},
					{
						text: 'Entradas',
						iconName: 'system_update_alt',
						linkTo: '/empresa/' + company + '/adm/inventarios/almacenes-entradas',
					},
					{
						text: 'Salidas',
						iconName: 'keyboard_tab',
						linkTo: '/empresa/' + company + '/adm/inventarios/almacenes-salidas',
					}
				]
			},
			{text: 'Proveedores', iconName: 'business', linkTo: '/empresa/' + company + '/adm/inventarios/proveedores' },
			{text: 'Compras', iconName: 'shopping_cart', linkTo: '/empresa/' +company + '/adm/inventarios/compras' },
			{text: 'Transeferencias', iconName: 'swap_horiz', linkTo: '/empresa/' + company + '/adm/inventarios/transferencias' }
		]

		this.setState({ sideMenuItems: loadedData });
	}

	onLoadWarehouses(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.findAll({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	onLoadWarehouseArticles(warehouseCode,callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.findAllArticlesFor({company:this.state.company, warehouse: warehouseCode} ,auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}
}

export { InventoryActions, InventoryStore }
