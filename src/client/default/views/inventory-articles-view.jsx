
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
import Fileupload from '../components/file-upload.jsx';
const Table = require('../components/table.jsx');
import Progress from'../components/progress.jsx';
const Panel = require('../components/sectionCard.jsx');
const MessageModal = require('../components/modal.jsx');
const SectionView = require('../components/sectionView.jsx');
const CustomInputCollection = require('../components/customInputCollection.jsx');
const PropertySingle = require('../components/property-single.jsx');

import { Switch, Case } from '../components/switch.jsx';
import Alert from '../components/alert.jsx';
import PdfViewerModal from '../components/pdf-viewer-modal.jsx';

import { CommonStore } from '../flux/common';
import { InventoryActions } from '../flux/inventory';
import { CompanyActions, CompanyStore } from '../flux/company';
import { ArticleActions, ArticleStore } from '../flux/articles';

/****************************************************************************************/

class Slider extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		$(this.refs.slider).slider();
	}

	render() {
		return (
		<div ref="slider" className="slider">
			<ul className="slides">
				{
					this.props.images.map((image, i)=>{
						return(
						<li key={i}>
							<div className="center-align">
								<img src={'data:image/png;base64,' + btoa(image)} className="responsive-img"/>
							</div>
						</li>)
					})
				}
			</ul>
		</div>
		)
	}
}

/****************************************************************************************/

class ArticleWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<Panel title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de artículos."/>
			</div>
		</Panel>);
	}
}

class ArticleList extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.store = ArticleStore;
		this.storeKeys = ['list', 'listStatus'];

		this.dropdowOptions = [
			{
				text:'Insertar nuevo artículo',
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

		ArticleActions.findAll();
	}

	onSelectArticle(article) {
		this.props.history.push(this.props.url + '/ver/' + article.code);
	}

	onDropdowOptionInsert(item) {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate(item) {
		ArticleActions.findAll();
	}

	render() {
		return(
		<Panel title="Lista de artículos" iconName="view_list"
			menuID="articlesList" menuItems={this.dropdowOptions}>

			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos los artículos en la base de datos.
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
						<Table columns={this.state.list.columns} rows={this.state.list.rows} filterBy="name"
							onSelectRow={this.onSelectArticle.bind(this)}/>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de artículos"/>
					</Case>
				</Switch>
			</div>
		</Panel>)
	}
}

class ArticleInsert extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			brands: [],
			categories: []
		}

		this.stores = [ArticleStore];

		this._formValidationRules = {
			rules: {
				articleCode: { required: true, minlength: 4 },
				articleName: { required: true, minlength: 6 },
				articleDescription: { required: true, minlength: 8 }
			},
			messages: {
				articleCode: {
					minlength: 'Debe escribir almenos 4 caracteres para el código de artículo'
				},
				articleName: {
					minlength: 'Debe escribir almenos 6 caracteres para el nombre de artículo'
				},
				articleDescription: {
					minlength: 'Debe escribir almenos 8 caracteres para descripción de artículo'
				}
			}
		}
    }

	componentWillMount() {
		super.componentWillMount();

		ArticleActions.findAllBrands((err, res)=>{
			if(err){} else if(res){ this.setState({brands: res.brands}); }
		});
		ArticleActions.findAllCategories((err, res)=>{
			if(err){} else if(res){ this.setState({categories: res.categories}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();

		this.onReadBarChange();
	}

	onFormSubmit(form) {
		var self = this;

		var data = {
			company: this.props.company,
			clientCode: self.refs.articleCode.value(),
			barCode: self.refs.articleBarCode.value(),
			name: self.refs.articleName.value(),
			brand: self.refs.articleBrand.value(),
			category: self.refs.articleCategory.value(),
			description: self.refs.articleDescription.value,
			//imageNames: self.refs.articleImages.getUniqueNames(),
			images: self.refs.articleImages.getUniqueNames().map(imgname=>{ return {code: imgname} }),
			customFields: self.refs.customFields.values()
		}

		this.refs.messageModal.show('sending');
		ArticleActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	onCustomFieldsChange() {
		this.refs.insertForm.revalidate();
	}

	/*onAutoCodeChange(checked) {
		var s = '';
		if(checked){
			s = Randomstring.generate({length: 8});
			this.refs.articleCode.disable();
		}else{
			this.refs.articleCode.enable();
		}
		this.refs.articleCode.value(s);
	}*/

	onReadBarChange(checked) {
		var s = '';
		if(checked){
			this.refs.articleBarCode.enable();
		}else{
			s = Randomstring.generate({length: 32});
			this.refs.articleBarCode.disable();
		}
		this.refs.articleBarCode.value(s);
	}

	render() {
		let auth = localStorage.getItem('authorization');
		return(
		<Panel title="Insertar nuevo artículo" iconName="library_books">
			<div style={{padding: '0rem 1rem'}}>
				<span>Introduzca los datos para el nuevo artículo.</span>
			</div>

			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

					<div className="row no-margin">
						<Input ref="articleCode" name="articleCode" className="col s6" type="text"
							label="Código *" placeholder="Código del artículo" required={true}/>
						<Input ref="articleBarCode" name="articleBarCode" className="col s6" type="text"
							label="Código de barras *" placeholder="Código de barras del artículo" required={true}/>
					</div>

					{/*<div className="row no-margin">
						<Input ref="autoCode" name="autoCode" className="col s12" type="switch"
							label="Generar código automáticamente" onChange={this.onAutoCodeChange.bind(this)}/>
					</div>*/}
					<div className="row no-margin">
						<Input ref="readBarCode" name="readBarCode" className="col s12" type="switch"
							label="Usar lector de código de barras" onChange={this.onReadBarChange.bind(this)}/>
					</div>

					<div className="row no-margin">
						<Input ref="articleName" name="articleName" type="text" label="Nombre *"
							className="col s12" placeholder="Ingrese el nombre del artículo" required={true}/>
					</div>

					<div className="row no-margin">
						<Input ref="articleBrand" name="articleBrand" className="col s6" type="autocomplete"
							label="Marca *" placeholder="Marca del artículo" required={true} options={{data: this.state.brands, key: 'name', minLength: 1}}/>
						<Input ref="articleCategory" name="articleCategory" className="col s6" type="autocomplete"
							label="Categoria *" placeholder="Categoria del artículo" required={true} options={{data: this.state.categories, key: 'name', minLength: 1}}/>
					</div>

					<div className="row no-margin">
						<div className="input-field col s12">
							<textarea ref="articleDescription" id="articleDescription" className="materialize-textarea" required data-length="10240" placeholder="Detalles de la descripción"/>
							<label htmlFor="articleDescription">{'Detalles de la descripción *'}</label>
						</div>
					</div>
				</div>

				<div>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos opcionales</h6>

					<div style={{padding: '0rem 0.8rem'}}>
						<span>Fotografías del artículo</span>
						<Fileupload ref="articleImages" headers={{'authorization': auth}}
							url={'/api/empresa/' + this.props.company + '/adm/inventarios/articulos/upload-image'}/>

						{/*<Input ref="articleImages" name="articleImages" type="file" fileInputName="imgFiles" className="col s12"
							placeholder="Seleccione una imagen para el artículo" themeColor={this.state.theme.colorName}/>*/}
					</div>

					{/*<div style={{padding: '0.8rem 0.8rem'}}>
						<span>Documentos o fichas técnicas</span>
						<Fileupload ref="articleDocuments" url={'/empresa/' + this.props.company + '/adm/inventarios/articulos/api/upload-file'}/>
					</div>*/}
				</div>

				<div>
					<CustomInputCollection ref="customFields" onInsertOrDeleteField={this.onCustomFieldsChange.bind(this)}>
						<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos personalizados</h6>
					</CustomInputCollection>
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
	}
}

class ArticleUpdate extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.stores = [CommonStore, ArticleStore];
		this.storeKeys = ['theme', 'selectedItem', 'updateStatus'];

		this._formValidationRules = {
			rules: {
				articleDescription: { required: true, minlength: 8 },
			},
			messages: {
				articleDescription: {
					minlength: 'Debe escribir almenos 8 caracteres de descripción'
				},
			},
			submitHandler: this.onFormSubmit.bind(this)
		}
	}

	componentDidMount() {
		Materialize.updateTextFields();

		var article = this.state.selectedItem;

		this.refs.articleDescription.value(article.description);
		this.refs.articleBrand.value(article.brand);
		this.refs.articleCategory.value(article.category);

		article.customFields.forEach((field)=>{
			this.refs.customFields.insert(field);
		})
	}

	onFormSubmit(form) {

	}

	onCustomFieldsChange() {
		this.refs.updateForm.revalidate();
	}

	render() {
		var categorys = [
			{name: "Tabla MDF"},
			{name: "Barniz"}
		]
		var brands = [
			{name: "Trupan"},
			{name: "Haya"},
			{name: "Lamichapa"},
			{name: "Proma"},
			{name: "Finsa"},
			{name: "Monopol"}
		]

		switch(this.state.updateStatus){
		case 'ready':
			return(
			<Panel title="Editar artículo" iconName="library_books">
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>

					<span>Introduzca los datos para el artículo.</span>

					<Form ref="updateForm" rules={this._formValidationRules}>
						<div>
							<h6 style={{fontWeight: 'bold'}}>Campos obligatorios</h6>
							<div className="row no-margin">
								<Input ref="articleBrand" name="articleBrand" className="col s6" type="autocomplete"
									label="Marca" placeholder="Marca del artículo" required={true} options={{data: brands, key: 'name', minLength: 1}}/>
								<Input ref="articleCategory" name="articleCategory" className="col s6" type="autocomplete"
									label="Categoria" placeholder="Categoria del artículo" required={true} options={{data: categorys, key: 'name', minLength: 1}}/>
							</div>
							<div className="row no-margin">
								<Input ref="articleDescription" name="articleDescription" type="text" label="Descripción"
									className="col s12" placeholder="Ingrese la descripción del artículo"/>
							</div>
						</div>
						<CustomInputCollection ref="customFields" onInsertOrDeleteField={this.onCustomFieldsChange.bind(this)}>
							<h6 style={{fontWeight: 'bold'}}>Campos personalizados</h6>
						</CustomInputCollection>
						<div>
							<h6 style={{fontWeight: 'bold'}}>Finalizar</h6>
							<div className="row">
								<button className="btn waves-effect waves-light col s12 red darken-1" type="submit"
									style={{textTransform: 'none', fontWeight: 'bold'}}>
									Guardar datos
									<i className="material-icons right">send</i>
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Panel>);
		case 'loading':
			return (
			<Panel title="Editar artículo" iconName="library_books">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		}
	}
}

class ArticleViewer extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.store = ArticleStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];

		this.dropdowOptions = [
			/*{
				text: 'Editar',
				select: this.onDropdowOptionUpdate.bind(this)
			},
			{
				text: 'Eliminar',
				select: this.onDropdowOptionDelete.bind(this)
			}*/
			{
				text: 'Reporte de existencias',
				select: this.onDropdowOptionStockReport.bind(this)
			}
		];
    }

	componentWillMount() {
		super.componentWillMount();

		if(this.props.articleCode){
			ArticleActions.findOne(this.props.articleCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.articleCode !== nextProps.articleCode){
			if(nextProps.articleCode){
				ArticleActions.findOne(nextProps.articleCode);
			}
		}
	}

	onDropdowOptionUpdate() {
		this.props.history.push(this.props.url + '/editar/' + this.props.articleCode);
	}

	onDropdowOptionDelete() {
	}

	onDropdowOptionStockReport() {
		this.refs.messageModal.show('sending');
		ArticleActions.getStockReport(this.props.articleCode, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.close();

				if(this.refs.pdfViewer.supports()){
					this.refs.pdfViewer.setDoc('data:application/pdf;base64,'+res.pdf);
					this.refs.pdfViewer.open();
				}	else {
					window.open('data:application/pdf;base64,'+res.pdf);
				}
			}
		});
	}

	render() {
		switch(this.state.viewerStatus){
		case 'ready':
			return this.state.selectedItem ? (
			<Panel title="Vista de artículo" iconName="library_books" menuID="articleViewer" menuItems={this.dropdowOptions}>
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<span>{this.state.selectedItem.name}</span>

					<div className="card" style={{paddingTop: '0.5rem'}}>
						{
							this.state.selectedItem.images[0] ?
							<Slider images={this.state.selectedItem.images}/>:
							<div className="center-align">
								<img className="responsive-img" style={{maxHeight: '20rem'}} src={'/images/noimage.png'}/>
							</div>
						}

						{/*<div className="center-align">
							<img className="responsive-img" style={{maxHeight: '20rem'}} src={this.state.selectedItem.images[0] ?
								('data:image/png;base64,' + btoa(this.state.selectedItem.images[0])) : '/images/noimage.png'}/>
						</div>*/}
						<div className="card-content" style={{padding: '1rem'}}>
							<h6 style={{fontWeight: 'bold'}}>{this.state.selectedItem.description}</h6>
						</div>
					</div>

					<PropertySingle name="Código" value={this.state.selectedItem.clientCode}/>
					<PropertySingle name="Nombre" value={this.state.selectedItem.name}/>
					<PropertySingle name="Marca" value={this.state.selectedItem.brand}/>
					<PropertySingle name="Categoría" value={this.state.selectedItem.category}/>
					{
						this.state.selectedItem.customFields ?
						this.state.selectedItem.customFields.map(function(field, i){
							return <PropertySingle key={i} name={field.name} value={field.value}/>
						}) : null
					}
					<PropertySingle name="Fecha de creación" value={this.state.selectedItem.creationDate}/>
					<PropertySingle name="Fecha de modificación" value={this.state.selectedItem.modifiedDate}/>
				</div>
				<MessageModal ref="messageModal"/>
				<PdfViewerModal ref="pdfViewer"/>
			</Panel>) :
			(<Panel title="Vista de artículo" iconName="library_books">
				<p>Seleccione una elemento de la lista de artículos</p>
			</Panel>);

		case 'loading':
			return (
			<Panel title="Vista de artículo" iconName="library_books">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		case 'error':
			return (
			<Panel title="Vista de artículo" iconName="library_books">
				<Alert type="error" text="ERROR: No se pudo cargar los datos del artículo"/>
			</Panel>);
		}
	}
}

class ArticleInWarehouses extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.store = ArticleStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];
    }

	render() {
		switch(this.state.viewerStatus){
		case 'ready':
			return this.state.selectedItem ? (
			<Panel title="Existencia en almacenes" iconName="store"
				menuID="articleInWarehouses" menuItems={[{text: 'Editar'}, {text: 'Eliminar'}]}>
				<p>{this.state.selectedItem.description}</p>
			</Panel>) : (
			<Panel title="Existencia en almacenes" iconName="store">
				<p>Seleccione una elemento de la lista de artículos</p>
			</Panel>);
		case 'loading':
			return (
			<Panel title="Existencia en almacenes" iconName="store">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</Panel>);
		case 'error':
			return (
			<Panel title="Vista de artículo" iconName="store"
				menuID="articleInWarehouses" menuItems={[{text: 'actualizar'}]}>
				<div style={{color: 'red'}}>
					<blockquote>
						<b>ERROR: No se pudo cargar los datos del artículo</b>
					</blockquote>
				</div>
			</Panel>);
		}
	}
}

/****************************************************************************************/

module.exports = class ArticleManager extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.stores = [CompanyStore, ArticleStore];
    }

	componentWillMount() {
		super.componentWillMount();

		this.url = '/empresa/' + this.props.match.params.company + '/adm/inventarios/articulos';

		CompanyActions.setCompany(this.props.match.params.company);
		ArticleActions.setCompany(this.props.match.params.company);
		CompanyActions.authenticate((err, res)=>{
			if(err){
				window.location.replace('/empresa/' + this.props.match.params.company);
			}
		});
		InventoryActions.loadSideMenuItems(this.props.match.params.company);
	}

	render() {
		/*var articleSection = null;
		switch(this.state.view){
			case 'insert': articleSection = (<ArticleInsert/>); break;
			case 'update': articleSection = (<ArticleUpdate/>); break;
			case 'review':
				articleSection = (<ArticleViewer onMenuItemSelect={this.onOptionSelect.bind(this)}/>); break;
			case 'welcome':
			default:
				articleSection = (<ArticleWelcome/>); break;
		}*/
		let action = this.props.match.params.action ? this.props.match.params.action : 'welcome',
			company = this.props.match.params.company;

		return this.state.user ? (
		<div className="row no-margin" style={{backgroundColor: '#eeeeee'}}>
			<SectionView className="col s12 m6 l5"  >
				<Switch match={action}>
					<ArticleWelcome path="welcome"/>
					<ArticleViewer path="ver" url={this.url} history={this.props.history}
						articleCode={this.props.match.params.article}/>
						{/*onMenuItemSelect={this.onOptionSelect.bind(this)}/>*/}
					<ArticleInsert path="insertar" company={company}/>
					<ArticleUpdate path="editar"/>
				</Switch>
			</SectionView>

			<SectionView className="col s12 m6 l7">
				<ArticleList url={this.url} history={this.props.history}/>
			</SectionView>

			{/*<SectionView className="col s12 l3 hide-on-med-only">
				<ArticleInWarehouses/>
			</SectionView>*/}
		</div>) : null;
	}
}
