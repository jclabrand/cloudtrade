
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import Reflux from 'reflux';

import { CommonActions }from './common';
import api from '../../api';

/****************************************************************************************/

var ArticleActions = Reflux.createActions([
	'setCompany', 'findAll', 'findOne', 'insertOne',
	'findAllBrands', 'findAllCategories',
	'getStockReport'
]);

class ArticleStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: '',
			//view: 'welcome', // review, insert, update

			//selectedArticleCode: null,
			selectedItem: null,
            list: { columns: [], rows: [] },

			listStatus: 'loading', // loading, ready, error
			viewerStatus: 'ready', // loading, ready, error
			//insertStatus: 'ready',
			//updateStatus: 'ready', // loading, sending
        }

        this.listenables = ArticleActions;

		/*CommonActions.listen('on-update-article-list', this.onLoadListDone.bind(this));
		CommonActions.listen('on-load-article-list-done', this.onLoadListDone.bind(this));
		CommonActions.listen('on-load-article-list-fail', this.onLoadListFail.bind(this));

		CommonActions.listen('on-load-one-article-done', this.onLoadOneDone.bind(this));
		CommonActions.listen('on-load-one-article-fail', this.onLoadOneFail.bind(this));

		CommonActions.listen('on-insert-one-article-done', this.onInsertOneDone.bind(this));
		CommonActions.listen('on-insert-one-article-fail', this.onInsertOneFail.bind(this));

		console.log('NEW ArticleStore');*/
    }

	// Action Listeners

	/*onSetView(option) {
		switch(option){
		case 'insert':
			this.setState({view: 'insert', articleInsertStatus: 'ready'});
			break;

		case 'update':
			this.setState({view: 'update', updateStatus: 'ready'});
			break;

		case 'updateArticles':
			this.onLoadList();
			break;
		}
	}*/

	onSetCompany(company) {
		this.setState({company});
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.articles.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					this.setState({list: res.articles, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(articleCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.articles.findOne({company: this.state.company, article: articleCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					this.setState({selectedItem: res.article, viewerStatus: 'ready'});
				}
			});
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	onInsertOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.articles.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllBrands(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.articles.findAllBrands({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllCategories(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.articles.findAllCategories({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}



	getStockReport(articleCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.reports.articles.getStockReport({company: this.state.company, article: articleCode}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}
/*
    onLoadList(data) {
		var self = this;
		CommonActions.emit('find-all-articles', {},
		function(){
			self.setState({articleListStatus: 'loading'});
		},
		function(){
			self.setState({articleListStatus: 'error'});
		});
    }

	onInsertOne(data) {
		var self = this;
		CommonActions.emit('insert-one-article', data,
		function(){
			self.setState({articleInsertStatus: 'loading'});
		},
		function(){
			//self.setState({view: 'show', viewerStatus: 'error'});
		});
	}

	// Connection Listeners

	onLoadListDone(data) {
		this.setState({articleList: data, articleListStatus: 'ready'});
	}

	onLoadListFail(e) {
		this.setState({articleListStatus: 'error'});
	}

	onLoadOneDone(data) {
		this.setState({
			selectedItem: data,
			view: 'show',
			articleViewStatus: 'ready'
		});
	}

	onLoadOneFail(e) {
		this.setState({ articleViewStatus: 'error' })
	}

	onInsertOneDone(data) {
		this.setState({articleInsertStatus: 'done'});
	}

	onInsertOneFail(data) {
		this.setState({articleInsertStatus: 'fail'});
	}*/
}

export { ArticleActions, ArticleStore }
