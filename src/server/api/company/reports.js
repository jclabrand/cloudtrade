
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';
import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import pdf from 'html-pdf';
import randomstring from 'randomstring';

import AppDate from '../../common/date';

/****************************************************************************************/

class ReportHeader extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div id="pageHeader" style={{zoom: '0.67'}}>
			<div><span style={{fontSize: '8pt'}}>{this.props.company.name}</span></div>
			<div><span style={{fontSize: '8pt'}}>{'Dirección: ' + this.props.company.address}</span></div>
			<div><span style={{fontSize: '8pt'}}>{'Teléfono: ' + this.props.company.phone}</span></div>

			<div><h6 style={{fontSize: '9pt', margin: '0.5rem 0'}}>{this.props.report.name}</h6></div>

			<img src={this.props.company.logoUrl} style={{position: 'absolute', top: '0', right: '0'}}/>
		</div>);
	}
}

class ReportFooter extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div id="pageFooter" style={{zoom: '0.67'}}>
			<table style={{width: '100%'}}>
				<tbody>
					<tr>
						<td>
			<div><span style={{fontSize: '8pt'}}>{'Reporte No ' + this.props.report.clientCode}</span></div>
			<div><span style={{fontSize: '8pt'}}>{'Procesado: ' + this.props.report.creationDate}</span></div>
						</td>
						<td>
			<div style={{textAlign: 'right'}}><span style={{fontSize: '8pt'}}>{'Página {{page}} de {{pages}}.'}</span></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>)
	}
}

/****************************************************************************************/

class ArticleStock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let rows = [], i=0, totalWarehouses = 0, totalStock = 0, totalEntries = 0, totalOutlets = 0,
			rowCenterStyle = { textAlign: 'center', padding: '0.2rem' },
			rowLeftStyle = { padding: '0.2rem' }
		for (var whs in this.props.warehouses) {
			let rwhs = this.props.warehouses[whs];
			totalWarehouses += 1;
			totalStock += rwhs.stock;
			totalEntries += rwhs.totalEntry;
			totalOutlets += rwhs.totalOutlet;
			rows.push(<tr key={i++}>
				<td style={rowCenterStyle}>{i}</td>
				<td style={rowLeftStyle}>{rwhs.clientCode}</td>
				<td style={rowLeftStyle}>{rwhs.name}</td>
				<td style={rowCenterStyle}>{rwhs.totalEntry}</td>
				<td style={rowCenterStyle}>{rwhs.totalOutlet}</td>
				<td style={rowCenterStyle}>{rwhs.stock}</td>
			</tr>)
		}
		return (
		<html>
			<body >
				<header>
					<ReportHeader company={this.props.company} report={this.props.report}/>
				</header>
				<main>
					<div id="pageContent" style={{zoom: '0.67', padding:'0'}}>

						<h3 style={{textAlign: 'center', fontSize: '12pt'}}>Reporte de existencias en almacenes</h3>
						<h5 style={{fontSize: '9pt', margin: '0.1rem 0'}}>
							Código del artículo: {this.props.article.clientCode}
						</h5>
						<h5 style={{fontSize: '9pt', margin: '0.1rem 0 0.5rem 0'}}>
							Nombre del artículo: {this.props.article.name}
						</h5>

						<table style={{width: '100%', fontSize: '9pt', borderTop: '0.1rem solid gray', borderBottom: '0.1rem solid gray', marginBottom: '1rem'}}>
							<thead>
								<tr>
									<th style={{padding: '0.25rem'}}>No</th>
									<th style={{padding: '0.25rem'}}>Cod.</th>
									<th style={{padding: '0.25rem'}}>Nombre del Almacén</th>
									<th style={{padding: '0.25rem'}}>Entradas</th>
									<th style={{padding: '0.25rem'}}>Salidas</th>
									<th style={{padding: '0.25rem'}}>Stock</th>
								</tr>
							</thead>
							<tbody>
								{ rows }
							</tbody>
						</table>

						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total almacenes: ' + totalWarehouses}</h5></div>
						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total stock: ' + totalStock}</h5></div>
						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total entradas: ' + totalEntries}</h5></div>
						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total salida: ' + totalOutlets}</h5></div>
					</div>
				</main>
				<footer>
					<ReportFooter report={this.props.report}/>
				</footer>
			</body>
		</html>);
	}
}

class WarehouseStock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let rows = [], i=0, totalArticles = 0, totalStock = 0, totalEntries = 0, totalOutlets = 0,
			rowCenterStyle = { textAlign: 'center', padding: '0.2rem' },
			rowLeftStyle = { padding: '0.2rem' }
		for (var art in this.props.articles) {
			let rart = this.props.articles[art];
			totalArticles += 1;
			totalStock += rart.stock;
			totalEntries += rart.totalEntry;
			totalOutlets += rart.totalOutlet;
			rows.push(<tr key={i++}>
				<td style={rowCenterStyle}>{i}</td>
				<td style={rowLeftStyle}>{rart.clientCode}</td>
				<td style={rowLeftStyle}>{rart.name}</td>
				<td style={rowLeftStyle}>{rart.category}</td>
				<td style={rowLeftStyle}>{rart.brand}</td>
				<td style={rowCenterStyle}>{rart.totalEntry}</td>
				<td style={rowCenterStyle}>{rart.totalOutlet}</td>
				<td style={rowCenterStyle}>{rart.stock}</td>
			</tr>)
		}

		return (
		<html>
			<body >
				<header>
					<ReportHeader company={this.props.company} report={this.props.report}/>
				</header>
				<main>
					<div id="pageContent" style={{zoom: '0.67', padding:'0'}}>

						<h3 style={{textAlign: 'center', fontSize: '12pt'}}>Reporte de existencias en almacén</h3>

						<h5 style={{fontSize: '9pt', margin: '0.1rem 0'}}>
							Código del almacén: {this.props.warehouse.clientCode}
						</h5>
						<h5 style={{fontSize: '9pt', margin: '0.1rem 0 0.5rem 0'}}>
							Nombre del almacén: {this.props.warehouse.name}
						</h5>

						<table style={{width: '100%', fontSize: '9pt', borderTop: '0.1rem solid gray', borderBottom: '0.1rem solid gray', marginBottom: '1rem'}}>
							<thead>
								<tr>
									<th style={{padding: '0.25rem'}}>No</th>
									<th style={{padding: '0.25rem'}}>Cod.</th>
									<th style={{padding: '0.25rem'}}>Artículo</th>
									<th style={{padding: '0.25rem'}}>Categoria</th>
									<th style={{padding: '0.25rem'}}>Marca</th>
									<th style={{padding: '0.25rem'}}>Entradas</th>
									<th style={{padding: '0.25rem'}}>Salidas</th>
									<th style={{padding: '0.25rem'}}>Stock</th>
								</tr>
							</thead>
							<tbody>
								{ rows }
							</tbody>
						</table>

						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total artículos: ' + totalArticles}</h5></div>
						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total stock: ' + totalStock}</h5></div>
						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total entradas: ' + totalEntries}</h5></div>
						<div><h5 style={{fontSize: '9pt', margin: '0.2rem'}}>{'Total salida: ' + totalOutlets}</h5></div>
					</div>
				</main>
				<footer>
					<ReportFooter report={this.props.report}/>
				</footer>
			</body>
		</html>);
	}
}

class DatedTransfers extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let transfers = [], i=0, totalArticles = 0,
			rowCenterStyle = { textAlign: 'center', padding: '0.2rem' },
			rowLeftStyle = { padding: '0.2rem' };
		for (var trf in this.props.transfers) {
			let rtrf = this.props.transfers[trf];
			totalArticles += rtrf.totalArticles;
			transfers.push(
			<div key={i++}>
				<table style={{width: '100%'}}>
					<tbody>
						<tr>
							<td>
					<h5 style={{margin: '0.1rem 0'}}>{'Número: ' + rtrf.seq}</h5>
					<h5 style={{margin: '0.1rem 0'}}>{'Origen: ' + rtrf.originWarehouse.name + ' - [' + rtrf.originWarehouse.clientCode + ']'}</h5>
					<h5 style={{margin: '0.1rem 0'}}>{'Destino: ' + rtrf.destinationWarehouse.name + ' - [' + rtrf.destinationWarehouse.clientCode + ']'}</h5>
					<p style={{margin: '0.1rem 0', fontSize: '9pt'}}>{'Asunto: ' + rtrf.business}</p>
					<p style={{margin: '0.1rem 0', fontSize: '9pt'}}>{'Descripción: ' + rtrf.description}</p>
							</td>
							<td>
					<p style={{margin: '0.1rem 0', textAlign: 'right', fontSize: '9pt'}}>{'Estado: ' + rtrf.status}</p>
					<p style={{margin: '0.1rem 0', textAlign: 'right', fontSize: '9pt'}}>{'Fecha de creación: ' + rtrf.creationDate}</p>
							</td>
						</tr>
					</tbody>
				</table>
				<table style={{width: '100%', fontSize: '9pt', borderTop: '0.1rem solid gray', borderBottom: '0.1rem solid gray'}}>
					<thead>
						<tr>
							<th style={{padding: '0.25rem'}}>No</th>
							<th style={{padding: '0.25rem'}}>Cod.</th>
							<th style={{padding: '0.25rem'}}>Nombre del artículo</th>
							<th style={{padding: '0.25rem'}}>Observación</th>
							<th style={{padding: '0.25rem'}}>Cantidad</th>
							<th style={{padding: '0.25rem'}}>P. Unit</th>
							<th style={{padding: '0.25rem'}}>Total</th>
						</tr>
					</thead>
					<tbody>
						{
							rtrf.articles.map((article, i)=>{
								return (
								<tr key={i}>
									<td style={rowCenterStyle}>{i}</td>
									<td style={rowLeftStyle}>{article.clientCode}</td>
									<td style={rowLeftStyle}>{article.name}</td>
									<td style={rowLeftStyle}>{article.remark}</td>
									<td style={rowCenterStyle}>{article.quantity}</td>
									<td style={rowCenterStyle}>{article.unitPrice}</td>
									<td style={rowCenterStyle}>{article.total}</td>
								</tr>)
							})
						}
					</tbody>
				</table>

				<h5 style={{margin: '0.5rem 0 1rem 0'}}>{'Subtotal artículos: ' + rtrf.totalArticles}</h5>
			</div>
			);
		}

		return (
		<html>
			<body >
				<header>
					<ReportHeader company={this.props.company} report={this.props.report}/>
				</header>
				<main>
					<div id="pageContent" style={{zoom: '0.67', padding:'0'}}>

						<h3 style={{textAlign: 'center', fontSize: '12pt'}}>Reporte de transferencias</h3>
						<h5 style={{fontSize: '9pt', margin: '1rem 0'}}>
							{'Del '+this.props.startDate+' al '+this.props.endDate}
						</h5>

						{transfers}

						<h4 style={{margin: '1rem 0 0 0'}}>{'Total artículos: ' + totalArticles}</h4>
					</div>
				</main>
				<footer>
					<ReportFooter report={this.props.report}/>
				</footer>
			</body>
		</html>);
	}
}

class TransferDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let rowCenterStyle = { textAlign: 'center', padding: '0.2rem' },
			rowLeftStyle = { padding: '0.2rem' };
		return (
		<html>
			<body >
				<header>
					<ReportHeader company={this.props.company} report={this.props.report}/>
				</header>
				<main>
					<div id="pageContent" style={{zoom: '0.67', padding:'0'}}>

						<h3 style={{textAlign: 'center', fontSize: '12pt'}}>Detalle de la transferencia</h3>

						<table style={{width: '100%'}}>
							<tbody>
								<tr>
									<td>
						<h5 style={{margin: '0.1rem 0'}}>{'Número: ' + this.props.transfer.seq}</h5>
						<h5 style={{margin: '0.1rem 0'}}>{'Origen: ' + this.props.transfer.originWarehouse.name + ' - [' + this.props.transfer.originWarehouse.clientCode + ']'}</h5>
						<h5 style={{margin: '0.1rem 0'}}>{'Destino: ' + this.props.transfer.destinationWarehouse.name + ' - [' + this.props.transfer.destinationWarehouse.clientCode + ']'}</h5>
						<p style={{margin: '0.1rem 0', fontSize: '9pt'}}>{'Asunto: ' + this.props.transfer.business}</p>
						<p style={{margin: '0.1rem 0', fontSize: '9pt'}}>{'Descripción: ' + this.props.transfer.description}</p>
									</td>
									<td>
						<p style={{margin: '0.1rem 0', textAlign: 'right', fontSize: '9pt'}}>{'Estado: ' + this.props.transfer.status}</p>
						<p style={{margin: '0.1rem 0', textAlign: 'right', fontSize: '9pt'}}>{'Fecha de creación: ' + this.props.transfer.creationDate}</p>
									</td>
								</tr>
							</tbody>
						</table>
						<table style={{width: '100%', fontSize: '9pt', borderTop: '0.1rem solid gray', borderBottom: '0.1rem solid gray'}}>
							<thead>
								<tr>
									<th style={{padding: '0.25rem'}}>No</th>
									<th style={{padding: '0.25rem'}}>Cod.</th>
									<th style={{padding: '0.25rem'}}>Nombre del artículo</th>
									<th style={{padding: '0.25rem'}}>Observación</th>
									<th style={{padding: '0.25rem'}}>Cantidad</th>
									<th style={{padding: '0.25rem'}}>P. Unit</th>
									<th style={{padding: '0.25rem'}}>Total</th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.transfer.articles.map((article, i)=>{
										return (
										<tr key={i}>
											<td style={rowCenterStyle}>{i}</td>
											<td style={rowLeftStyle}>{article.clientCode}</td>
											<td style={rowLeftStyle}>{article.name}</td>
											<td style={rowLeftStyle}>{article.remark}</td>
											<td style={rowCenterStyle}>{article.quantity}</td>
											<td style={rowCenterStyle}>{article.unitPrice}</td>
											<td style={rowCenterStyle}>{article.total}</td>
										</tr>)
									})
								}
							</tbody>
						</table>

						<h5 style={{margin: '0.5rem 0 1rem 0'}}>{'Total artículos: ' + this.props.transfer.totalArticles}</h5>

					</div>
				</main>
				<footer>
					<ReportFooter report={this.props.report}/>
				</footer>
			</body>
		</html>);
	}
}

class DatedPurchases extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let purchases = [], i=0, totalArticles = 0, totalPrices = 0,
			rowCenterStyle = { textAlign: 'center', padding: '0.2rem' },
			rowLeftStyle = { padding: '0.2rem' };

		for (var prch in this.props.purchases) {
			let rprch = this.props.purchases[prch];
			totalArticles += rprch.totalArticles;
			totalPrices += rprch.totalPrices;
			purchases.push(
			<div key={i++}>
				<table style={{width: '100%'}}>
					<tbody>
						<tr>
							<td>
								<h5 style={{margin: '0.1rem 0'}}>
									{'Número de guía: ' + rprch.guideNumber}
								</h5>
								<p style={{margin: '0.1rem 0', fontSize: '9pt'}}>
									{'Proveedor: ' + rprch.providerName}
								</p>
								<p style={{margin: '0.1rem 0', fontSize: '9pt'}}>
									{'Asunto: ' + rprch.business}
								</p>
							</td>
							<td>
								<p style={{margin: '0.1rem 0', textAlign: 'right', fontSize: '9pt'}}>
									{'Estado: ' + rprch.status}
								</p>
								<p style={{margin: '0.1rem 0', textAlign: 'right', fontSize: '9pt'}}>
									{'Fecha de creación: ' + rprch.creationDate}
								</p>
							</td>
						</tr>
					</tbody>
				</table>
				<table style={{width: '100%', fontSize: '9pt', borderTop: '0.1rem solid gray', borderBottom: '0.1rem solid gray'}}>
					<thead>
						<tr>
							<th style={{padding: '0.25rem'}}>No</th>
							<th style={{padding: '0.25rem'}}>Cod.</th>
							<th style={{padding: '0.25rem'}}>Nombre del artículo</th>
							<th style={{padding: '0.25rem'}}>Observación</th>
							<th style={{padding: '0.25rem'}}>Unidad</th>
							<th style={{padding: '0.25rem'}}>Cantidad</th>
							<th style={{padding: '0.25rem'}}>P. Unit</th>
							<th style={{padding: '0.25rem'}}>Total</th>
						</tr>
					</thead>
					<tbody>
						{
							rprch.articles.map((article, i)=>{
								return (
								<tr key={i}>
									<td style={rowCenterStyle}>{i}</td>
									<td style={rowLeftStyle}>{article.clientCode}</td>
									<td style={rowLeftStyle}>{article.name}</td>
									<td style={rowLeftStyle}>{article.remark}</td>
									<td style={rowCenterStyle}>{article.measurement}</td>
									<td style={rowCenterStyle}>{article.quantity}</td>
									<td style={rowCenterStyle}>{article.unitPrice}</td>
									<td style={rowCenterStyle}>{article.total}</td>
								</tr>)
							})
						}
					</tbody>
				</table>

				<h5 style={{margin: '0.5rem 0 0.2rem 0'}}>{'Subtotal artículos: ' + rprch.totalArticles}</h5>
				<h5 style={{margin: '0.2rem 0 1rem 0'}}>{'Subtotal precio: ' + rprch.totalPrices + ' $'}</h5>
			</div>);
		}
		return (
		<html>
			<body >
				<header>
					<ReportHeader company={this.props.company} report={this.props.report}/>
				</header>
				<main>
					<div id="pageContent" style={{zoom: '0.67', padding:'0'}}>

						<h3 style={{textAlign: 'center', fontSize: '12pt'}}>Reporte de compras</h3>
						<h5 style={{fontSize: '9pt', margin: '1rem 0'}}>
							{'Del '+this.props.startDate+' al '+this.props.endDate}
						</h5>

						{purchases}

						<h4 style={{margin: '1.5rem 0 0 0'}}>{'Total artículos: ' + totalArticles}</h4>
						<h4 style={{margin: '0.5rem 0 0 0'}}>{'Total precio: ' + totalPrices + ' $'}</h4>
					</div>
				</main>
				<footer>
					<ReportFooter report={this.props.report}/>
				</footer>
			</body>
		</html>);
	}
}

class PurchaseDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let pestyle = {margin: '0.1rem 0', fontSize: '9pt'},
			pestyler = {margin: '0.1rem 0', textAlign: 'right', fontSize: '9pt'},
			rowCenterStyle = { textAlign: 'center', padding: '0.2rem' },
			rowLeftStyle = { padding: '0.2rem' };
		return (
		<html>
			<body >
				<header>
					<ReportHeader company={this.props.company} report={this.props.report}/>
				</header>
				<main>
					<div id="pageContent" style={{zoom: '0.67', padding:'0'}}>

						<h3 style={{textAlign: 'center', fontSize: '12pt'}}>Detalle de la orden de compra</h3>

						<h5 style={{margin: '0.1rem 0'}}>Información de la orden de compra</h5>
						<table style={{width: '100%'}}>
							<tbody>
								<tr>
									<td>
										<p style={pestyle}>{'Número de guía: ' + this.props.purchase.guideNumber}</p>
										<p style={pestyle}>{'Referencia del pedido: ' + this.props.purchase.order}</p>
									</td>
									<td>
										<p style={pestyler}>{'Asunto: ' + this.props.purchase.business}</p>
									</td>
								</tr>
							</tbody>
						</table>

						<h5 style={{margin: '0.2rem 0'}}>Información del proveedor</h5>
						<table style={{width: '100%'}}>
							<tbody>
								<tr>
									<td>
										<p style={pestyle}>{'Nombre del proveedor: ' + this.props.purchase.providerName}</p>
										<p style={pestyle}>{'Nombre de contacto: ' + this.props.purchase.contactName}</p>
									</td>
									<td>
										<p style={pestyler}>{'Fecha de pago: ' + this.props.purchase.payDate}</p>
									</td>
								</tr>
							</tbody>
						</table>

						<h5 style={{margin: '0.2rem 0'}}>Detalles de la dirección de facturación</h5>
						<table style={{width: '100%'}}>
							<tbody>
								<tr>
									<td>
										<p style={pestyle}>{'Dirección de facturación: ' + this.props.purchase.billingDir}</p>
										<p style={pestyle}>{'País de facturación: ' + this.props.purchase.billingCountry}</p>
									</td>
									<td>
										<p style={pestyler}>{'Departamento: ' + this.props.purchase.billingDep}</p>
									</td>
								</tr>
							</tbody>
						</table>

						<h5 style={{margin: '0.2rem 0'}}>Detalles de la dirección de envío</h5>
						<table style={{width: '100%'}}>
							<tbody>
								<tr>
									<td>
										<p style={pestyle}>{'Dirección de envío: ' + this.props.purchase.shippingDir}</p>
										<p style={pestyle}>{'País de envío: ' + this.props.purchase.shippingCountry}</p>
										<p style={pestyle}>{'Departamento: ' + this.props.purchase.shippingDep}</p>
									</td>
									<td>
										<p style={pestyler}>{'Provincia: ' + this.props.purchase.shippingProvince}</p>
										<p style={pestyler}>{'Código postal: ' + this.props.purchase.shippingPostal}</p>
									</td>
								</tr>
							</tbody>
						</table>

						<h5 style={{margin: '0.2rem 0'}}>Descripción</h5>
						<p style={pestyle}>{this.props.purchase.description}</p>

						<h5 style={{margin: '0.2rem 0'}}>Términos y condiciones</h5>
						<p style={pestyle}>{this.props.purchase.terms}</p>

						<h5 style={{margin: '0.2rem 0'}}>Información adicional</h5>
						<p style={pestyle}>{'Estado: ' + this.props.purchase.status}</p>
						<p style={pestyle}>{'Fecha de creación: ' + this.props.purchase.creationDate}</p>

						<h5 style={{margin: '0.2rem 0'}}>Lista de artículos</h5>
						<table style={{width: '100%', fontSize: '9pt', borderTop: '0.1rem solid gray', borderBottom: '0.1rem solid gray'}}>
							<thead>
								<tr>
									<th style={{padding: '0.25rem'}}>No</th>
									<th style={{padding: '0.25rem'}}>Cod.</th>
									<th style={{padding: '0.25rem'}}>Nombre del artículo</th>
									<th style={{padding: '0.25rem'}}>Observación</th>
									<th style={{padding: '0.25rem'}}>Unidad</th>
									<th style={{padding: '0.25rem'}}>Cantidad</th>
									<th style={{padding: '0.25rem'}}>P. Unit</th>
									<th style={{padding: '0.25rem'}}>Total</th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.purchase.articles.map((article, i)=>{
										return (
										<tr key={i}>
											<td style={rowCenterStyle}>{i}</td>
											<td style={rowLeftStyle}>{article.clientCode}</td>
											<td style={rowLeftStyle}>{article.name}</td>
											<td style={rowLeftStyle}>{article.remark}</td>
											<td style={rowCenterStyle}>{article.measurement}</td>
											<td style={rowCenterStyle}>{article.quantity}</td>
											<td style={rowCenterStyle}>{article.unitPrice}</td>
											<td style={rowCenterStyle}>{article.total}</td>
										</tr>)
									})
								}
							</tbody>
						</table>

						<h5 style={{margin: '0.5rem 0 0.2rem 0'}}>{'Total artículos: ' + this.props.purchase.totalArticles}</h5>
						<h5 style={{margin: '0.2rem 0 1rem 0'}}>{'Total precio: ' + this.props.purchase.totalPrices + ' $'}</h5>
					</div>
				</main>
				<footer>
					<ReportFooter report={this.props.report}/>
				</footer>
			</body>
		</html>);
	}
}

class DatedEntries extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let entries = [], i=0, totalArticles = 0,
		rowCenterStyle = { textAlign: 'center', padding: '0.2rem' },
		rowLeftStyle = { padding: '0.2rem' };

		entries.push(
			<table style={{width: '100%', fontSize: '9pt', borderTop: '0.1rem solid gray', borderBottom: '0.1rem solid gray'}}>
				<thead>
					<tr>
						<th style={{padding: '0.25rem'}}>No</th>
						<th style={{padding: '0.25rem'}}>Cod.</th>
						<th style={{padding: '0.25rem'}}>Concepto</th>
						<th style={{padding: '0.25rem'}}>Descripción</th>
						<th style={{padding: '0.25rem'}}>Fecha de Entrada</th>
						<th style={{padding: '0.25rem'}}>P. Unit</th>
						<th style={{padding: '0.25rem'}}>Total</th>
					</tr>
				</thead>
			</table>
		)
		
		for (var ent in this.props.entries) {
			let rent = this.props.entries[ent];
			//totalArticles += rtrf.totalArticles;
			entries.push(
			<div key={i++}>	
					<tbody>
						<tr key={i}>
							<td style={rowCenterStyle}>{i}</td>
							<td style={rowLeftStyle}>{}</td>
							<td style={rowLeftStyle}>{rent.transactionsTypeName}</td>
							<td style={rowLeftStyle}>{rent.description}</td>
							<td style={rowCenterStyle}>{rent.entryDate}</td>
							<td style={rowCenterStyle}>{}</td>
							<td style={rowCenterStyle}>{}</td>
						</tr>
					</tbody>
			</div>	
			);
		}
		return(
			<html>
			<body >
				<header>
					<ReportHeader company={this.props.company} report={this.props.report}/>
				</header>
				<main>
					<div id="pageContent" style={{zoom: '0.67', padding:'0'}}>

						<h3 style={{textAlign: 'center', fontSize: '12pt'}}>Reporte de Entradas a almacén</h3>
						<h5 style={{fontSize: '9pt', margin: '1rem 0'}}>
							{'Del '+this.props.startDate+' al '+this.props.endDate}
						</h5>
						{entries}
						<h4 style={{margin: '1rem 0 0 0'}}>{'Total artículos: ' + totalArticles}</h4>
					</div>
				</main>
				<footer>
					<ReportFooter report={this.props.report}/>
				</footer>
			</body>
		</html>
		);
	}
}


/****************************************************************************************/

class Reports {
	constructor() {
		this.router = express.Router();

		this.router.get('/articulos/stock/:article', this.articleStock.bind(this));
		this.router.post('/almacenes/stock/:warehouse', this.warehouseStock.bind(this));

		this.router.post('/transferencias/por-fecha', this.datedTransfers.bind(this));
		this.router.get('/transferencias/detalle/:transfer', this.transferDetail.bind(this));

		this.router.post('/compras/por-fecha', this.datedPurchases.bind(this));
		this.router.get('/compras/detalle/:purchase', this.purchaseDetail.bind(this));

		this.router.post('/entries/por-fecha', this.datedEntries.bind(this));
		this.router.post('/outlets/por-fecha', this.datedOutlets.bind(this));
	}

	/************************************************************************************/

	articleStock(req, res) {
		let self = this;
		co(function*(){
			let debugWarehouses = {}

			let art = yield req.app.db.articles.findOne({code: req.params.article});
			let whs = yield req.app.db.warehouses.findAll('code clientCode name articles');
			let whep = yield req.app.db.warehouseEntryPurchases.findAll();
			let whet = yield req.app.db.warehouseEntryTransfers.findAll();
			let whot = yield req.app.db.warehouseOutletTransfers.findAll();

			if(whs.length){
				for(let wh of whs) {
					let fart = wh.articles.find(iart=>{ return iart.code === art.code; });
					if(fart) {
						let totalEntry = 0, totalOutlet = 0;

						if(whep.length){
							for(let purchase of whep) {
								for(let tran of purchase.transactions) {
									for(let iart of tran.articles) {
										if((wh.code === iart.warehouseCode) && (iart.code === art.code)) {
											totalEntry += iart.quantity;
										}
									}
								}
							}
						}
						if(whet.length){
							for(let transfer of whet) {
								for(let tran of transfer.transactions) {
									for(let iart of tran.articles) {
										if((wh.code === iart.warehouseCode) && (iart.code === art.code)) {
											totalEntry += iart.quantity;
										}
									}
								}
							}
						}

						if(whot.length){
							for(let transfer of whot) {
								for(let tran of transfer.transactions) {
									for(let iart of tran.articles) {
										if((wh.code === iart.warehouseCode) && (iart.code === art.code)) {
											totalOutlet += iart.quantity;
										}
									}
								}
							}
						}

						debugWarehouses[wh.code]={
							clientCode: wh.clientCode,
							name: wh.name,
							totalEntry,
							totalOutlet,
							stock: fart.stock,
						}
					}
				}
			}

			let company = {
				name: req.company.name,
				address: 'German Bush N 738',
				phone: '8598565',
				logoUrl: 'http://localhost:2000/images/tabletec-logo-128x68.png'
			}
			let dbreport = yield req.app.db.reports.insertOne({
				name: 'Reporte de existencias en almacenes' + ' - [Artículo: ' + art.clientCode + ']'
			});
			let report = {
				name: dbreport.name,
				clientCode: 'RP-TT-' + dbreport.seq,
				creationDate: dbreport.creationDate
			}

			var html = renderToString(<ArticleStock company={company} report={report} article={art} warehouses={debugWarehouses}/>);

			dbreport.htmlResult = html;
			dbreport.save();

			return yield self.buildPdfReport(html);
		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	__ifMatch(filter, art) {
		switch(filter.option)	{
			case 'code' : 
				return art.clientCode == filter.text; 
			case 'name' :
				return art.name == filter.text;
			case 'brand' :
				return art.brand == filter.text;
			case 'category' :
			    return art.category == filter.text;
			case 'all' :
				return true;
			default : return false;
		} 
	}

	warehouseStock(req, res) {
		let self = this;
		co(function*(){
			let wh = yield req.app.db.warehouses.findOne({code: req.params.warehouse});

			let debugArticles = {}

			let whep = yield req.app.db.warehouseEntryPurchases.findAll();
			let whet = yield req.app.db.warehouseEntryTransfers.findAll();
			let whec = yield req.app.db.warehouseEntryCustom.findAll();

			if(whep.length) {
				for(let purchase of whep) {
					for(let tran of purchase.transactions) {
						for(let art of tran.articles) {
							if(art.warehouseCode === wh.code ) {
								if(typeof debugArticles[art.code] == 'undefined'){
									let farticle = yield req.app.db.articles.findOne({code: art.code}, 'code name brand category clientCode');
									if( (self.__ifMatch(req.body.filter,farticle)) ) {
										debugArticles[art.code] = {
											clientCode: farticle.clientCode,
											name: farticle.name,
											category: farticle.category,
											brand: farticle.brand,
											totalEntry: art.quantity,
											totalOutlet: 0,
										}
									}
								}else{
									if( self.__ifMatch(req.body.filter, debugArticles[art.code]) ) {
										debugArticles[art.code].totalEntry += art.quantity;
									}
								}
							}
						}
					}
				}
			}
			if(whet.length) {
				for(let transfer of whet) {
					for(let tran of transfer.transactions) {
						for(let art of tran.articles) {
							if(art.warehouseCode === wh.code){
								if(typeof debugArticles[art.code] == 'undefined'){
									let farticle = yield req.app.db.articles.findOne({code: art.code}, 'code name brand category clientCode');
									if((self.__ifMatch(req.body.filter,farticle))) {
										debugArticles[art.code] = {
											clientCode: farticle.clientCode,
											name: farticle.name,
											category: farticle.category,
											brand: farticle.brand,
											totalEntry: art.quantity,
											totalOutlet: 0,
										}
									}
								}else{
									if(self.__ifMatch(req.body.filter, debugArticles[art.code])) {
										debugArticles[art.code].totalEntry += art.quantity;
									}
								}
								
							}
						}
					}
				}
			}
			if(whec.length) {
				for(let custom of whec) {
					for(let art of custom.articles) {
						if(art.warehouseCode === wh.code) {
							if(typeof debugArticles[art.code] == 'undefined'){
								let farticle = yield req.app.db.articles.findOne({code: art.code}, 'code name brand category clientCode');
								if((self.__ifMatch(req.body.filter, farticle))) {
									debugArticles[art.code] = {
										clientCode: farticle.clientCode,
										name: farticle.name,
										category: farticle.category,
										brand: farticle.brand,
										totalEntry: art.quantity,
										totalOutlet: 0,
									}
								}
							}else{
								if(self.__ifMatch(req.body.filter, debugArticles[art.code])) {
									debugArticles[art.code].totalEntry += art.quantity;
								}
							}
						}
					}
				}
			}


			let whot = yield req.app.db.warehouseOutletTransfers.findAll();
			let whoc = yield req.app.db.warehouseOutletCustom.findAll();

			if(whot.length) {
				for(let transfer of whot) {
					for(let tran of transfer.transactions) {
						for(let art of tran.articles) {
							if(art.warehouseCode === wh.code){
								if(typeof debugArticles[art.code] == 'undefined'){
									let farticle = yield req.app.db.articles.findOne({code: art.code}, 'code name brand category clientCode');
									if( (self.__ifMatch(req.body.filter,farticle)) ) {
										debugArticles[art.code] = {
											clientCode: farticle.clientCode,
											name: farticle.name,
											category: farticle.category,
											brand: farticle.brand,
											totalEntry: 0,
											totalOutlet: art.quantity,
										}
									}
								} else {
									if( self.__ifMatch(req.body.filter, debugArticles[art.code]) ) {
										debugArticles[art.code].totalOutlet += art.quantity;
									}
								}
							}
						}
					}
				}
			}

			if(whoc.length) {
				for(let custom of whec) {
					for(let art of custom.articles) {
						if(art.warehouseCode === wh.code) {
							if(typeof debugArticles[art.code] == 'undefined'){
								let farticle = yield req.app.db.articles.findOne({code: art.code}, 'code name brand category clientCode');
								if( (self.__ifMatch(req.body.filter,farticle)) ) {
									debugArticles[art.code] = {
										clientCode: farticle.clientCode,
										name: farticle.name,
										category: farticle.category,
										brand: farticle.brand,
										totalEntry: 0,
										totalOutlet: art.quantity,
									}
								}
							} else {
								if( self.__ifMatch(req.body.filter, debugArticles[art.code]) ) {
									debugArticles[art.code].totalOutlet += art.quantity;
								}
							}
						}
					}
				}
			}


			for(let art of wh.articles) {
				if(typeof debugArticles[art.code] === 'undefined'){
					let farticle = yield req.app.db.articles.findOne({code: art.code}, 'code name brand category clientCode');
					if( (self.__ifMatch(req.body.filter, farticle)) ) {
						debugArticles[art.code] = {
							clientCode: farticle.clientCode,
							name: farticle.name,
							category: farticle.category,
							brand: farticle.brand,
							totalEntry: 0,
							totalOutlet: 0,
							stock: art.stock
						}
					}
				}else{
					if( self.__ifMatch(req.body.filter, debugArticles[art.code]) ) {
						debugArticles[art.code].stock = art.stock;
					}
				}
			}

			let company = {
				name: req.company.name,
				address: 'German Bush N 738',
				phone: '8598565',
				logoUrl: 'http://localhost:2000/images/tabletec-logo-128x68.png'
			}
			let dbreport = yield req.app.db.reports.insertOne({
				name: 'Reporte de existencias en almacén' + ' - [' + wh.clientCode + ']'
			});
			let report = {
				name: dbreport.name,
				clientCode: 'RP-TT-' + dbreport.seq,
				creationDate: dbreport.creationDate
			}

			var html = renderToString(<WarehouseStock company={company} report={report} warehouse={wh} articles={debugArticles}/>);

			dbreport.htmlResult = html;
			dbreport.save();
			console.log("FINISH");
			return yield self.buildPdfReport(html);
		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	datedTransfers(req, res) {
		let self = this;
		co(function*(){
			var d1 = AppDate.parse(req.body.startDate);
			var d2 = AppDate.parse(req.body.endDate);

			if(d1 > d2) {
				throw 'No permitido: la fecha de inicio debe ser menor a la fecha fin.';
			}
			let debugTransfers = {}
			let transfers = yield req.app.db.transfers.findAllPlane('code seq business status description articles originWarehouseCode destinationWarehouseCode creationDate');
			if(transfers.length){
				for(let trf of transfers) {
					let trfDate = AppDate.parse(trf.creationDate.split(' ')[0]);
					if((trfDate >= d1) && (trfDate <= d2)){
						let worigin = yield req.app.db.warehouses.findOne({code: trf.originWarehouseCode}, 'clientCode name');
						let wdestination = yield req.app.db.warehouses.findOne({code: trf.destinationWarehouseCode}, 'clientCode name');

						debugTransfers[trf.code] = {
							seq: trf.seq,
							originWarehouse: {clientCode: worigin.clientCode, name: worigin.name},
							destinationWarehouse: {clientCode: wdestination.clientCode, name: wdestination.name},
							business: trf.business,
							description: trf.description,
							status: self.translateTransferStatus(trf.status),
							creationDate: trf.creationDate,
							articles: [],
							totalArticles: 0
						}

						for(let art of trf.articles) {
							let farticle = yield req.app.db.articles.findOne({code: art.code}, 'clientCode name');
							debugTransfers[trf.code].articles.push({
								clientCode: farticle.clientCode,
								name: farticle.name,
								quantity: art.quantity,
								unitPrice: art.unitPrice,
								total: art.quantity * art.unitPrice,
								remark: art.remark
							});

							debugTransfers[trf.code].totalArticles += art.quantity
						}
					}
				}
			}

			let company = {
				name: req.company.name,
				address: 'German Bush N 738',
				phone: '8598565',
				logoUrl: 'http://localhost:2000/images/tabletec-logo-128x68.png'
			}
			let dbreport = yield req.app.db.reports.insertOne({
				name: 'Reporte de transferencias' + ' - [Del '+ req.body.startDate +' al '+ req.body.endDate +']'
			});
			let report = {
				name: dbreport.name,
				clientCode: 'RP-TT-' + dbreport.seq,
				creationDate: dbreport.creationDate
			}

			var html = renderToString(<DatedTransfers company={company} report={report} transfers={debugTransfers}
				startDate={req.body.startDate} endDate={req.body.endDate}/>);

			dbreport.htmlResult = html;
			dbreport.save();

			return yield self.buildPdfReport(html);
		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	transferDetail(req, res) {
		let self = this;
		co(function*(){
			let debugTransfer = {};

			let trf = yield req.app.db.transfers.findOne({code: req.params.transfer});
			if(trf) {
				let worigin = yield req.app.db.warehouses.findOne({code: trf.originWarehouseCode}, 'clientCode name');
				let wdestination = yield req.app.db.warehouses.findOne({code: trf.destinationWarehouseCode}, 'clientCode name');

				debugTransfer = {
					seq: trf.seq,
					originWarehouse: {clientCode: worigin.clientCode, name: worigin.name},
					destinationWarehouse: {clientCode: wdestination.clientCode, name: wdestination.name},
					business: trf.business,
					description: trf.description,
					status: self.translateTransferStatus(trf.status),
					creationDate: trf.creationDate,
					articles: [],
					totalArticles: 0
				}

				for(let art of trf.articles) {
					let farticle = yield req.app.db.articles.findOne({code: art.code}, 'clientCode name');
					debugTransfer.articles.push({
						clientCode: farticle.clientCode,
						name: farticle.name,
						quantity: art.quantity,
						unitPrice: art.unitPrice,
						total: art.quantity * art.unitPrice,
						remark: art.remark
					});

					debugTransfer.totalArticles += art.quantity
				}
			}else{
				throw 'No se encontró la transferencia';
			}
			let company = {
				name: req.company.name,
				address: 'German Bush N 738',
				phone: '8598565',
				logoUrl: 'http://localhost:2000/images/tabletec-logo-128x68.png'
			}
			let dbreport = yield req.app.db.reports.insertOne({
				name: 'Reporte de transferencia' + ' - ['+ debugTransfer.seq +']'
			});
			let report = {
				name: dbreport.name,
				clientCode: 'RP-TT-' + dbreport.seq,
				creationDate: dbreport.creationDate
			}

			var html = renderToString(<TransferDetail company={company} report={report} transfer={debugTransfer}/>);

			dbreport.htmlResult = html;
			dbreport.save();

			return yield self.buildPdfReport(html);
		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	datedPurchases(req, res) {
		let self = this;
		co(function*(){

			var d1 = AppDate.parse(req.body.startDate);
			var d2 = AppDate.parse(req.body.endDate);

			if(d1 > d2) {
				throw 'No permitido: la fecha de inicio debe ser menor a la fecha fin.';
			}
			let debugPurchases = {}
			let purchases = yield req.app.db.purchases.find({}, 'code business guideNumber status providerCode description articles creationDate');
			if(purchases.length){
				for(let prch of purchases){
					let trfDate = AppDate.parse(prch.creationDate.split(' ')[0]);
					if((trfDate >= d1) && (trfDate <= d2)){
						let provider = yield req.app.db.providers.findOne({code: prch.providerCode}, 'name');
						debugPurchases[prch.code] = {
							guideNumber: prch.guideNumber,
							business: prch.business,
							description: prch.description,
							status: self.translatePurchaseStatus(prch.status),
							creationDate: prch.creationDate,
							providerName: provider.name,
							articles: [],
							totalArticles: 0,
							totalPrices: 0
						}

						for(let art of prch.articles){
							let farticle = yield req.app.db.articles.findOne({code: art.code}, 'clientCode name');
							let subtotal = art.quantity * art.unitPrice;
							debugPurchases[prch.code].articles.push({
								clientCode: farticle.clientCode,
								name: farticle.name,
								measurement: art.measurement,
								quantity: art.quantity,
								unitPrice: art.unitPrice,
								total: subtotal,
								remark: art.remark
							});

							debugPurchases[prch.code].totalArticles += art.quantity;
							debugPurchases[prch.code].totalPrices += subtotal;
						}
					}
				}
			}

			let company = {
				name: req.company.name,
				address: 'German Bush N 738',
				phone: '8598565',
				logoUrl: 'http://localhost:2000/images/tabletec-logo-128x68.png'
			}
			let dbreport = yield req.app.db.reports.insertOne({
				name: 'Reporte de compras' + ' - [Del '+ req.body.startDate +' al '+ req.body.endDate +']'
			});
			let report = {
				name: dbreport.name,
				clientCode: 'RP-TT-' + dbreport.seq,
				creationDate: dbreport.creationDate
			}

			var html = renderToString(<DatedPurchases company={company} report={report} purchases={debugPurchases}
				startDate={req.body.startDate} endDate={req.body.endDate}/>);

			dbreport.htmlResult = html;
			dbreport.save();

			return yield self.buildPdfReport(html);
		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	purchaseDetail(req, res) {
		let self = this;
		co(function*(){
			let debugPurchase = {}

			let prch = yield req.app.db.purchases.findOne({code: req.params.purchase});
			if(prch) {
				let provider = yield req.app.db.providers.findOne({code: prch.providerCode}, 'name');
				debugPurchase = {
					guideNumber: prch.guideNumber,
					business: prch.business,
					order: prch.order,

					providerName: provider.name,
					contactName: prch.contactName,
					payDate: prch.payDate,

					billingDir: prch.billingDir,
					billingCountry: prch.billingCountry,
					billingDep: prch.billingDep,

					shippingDir: prch.shippingDir,
					shippingCountry: prch.shippingCountry,
					shippingDep: prch.shippingDep,
					shippingProvince: prch.shippingProvince,
					shippingPostal: prch.shippingPostal,

					terms: prch.terms,
					description: prch.description,
					status: self.translatePurchaseStatus(prch.status),
					creationDate: prch.creationDate,

					articles: [],
					totalArticles: 0,
					totalPrices: 0
				}

				for(let art of prch.articles) {
					let farticle = yield req.app.db.articles.findOne({code: art.code}, 'clientCode name');
					let subtotal = art.quantity * art.unitPrice;
					debugPurchase.articles.push({
						clientCode: farticle.clientCode,
						name: farticle.name,
						measurement: art.measurement,
						quantity: art.quantity,
						unitPrice: art.unitPrice,
						total: subtotal,
						remark: art.remark
					});

					debugPurchase.totalArticles += art.quantity;
					debugPurchase.totalPrices += subtotal;
				}
			}else{
				throw 'No se encontró la orden de compra';
			}

			let company = {
				name: req.company.name,
				address: 'German Bush N 738',
				phone: '8598565',
				logoUrl: 'http://localhost:2000/images/tabletec-logo-128x68.png'
			}
			let dbreport = yield req.app.db.reports.insertOne({
				name: 'Reporte de compra' + ' - ['+ debugPurchase.guideNumber +']'
			});
			let report = {
				name: dbreport.name,
				clientCode: 'RP-TT-' + dbreport.seq,
				creationDate: dbreport.creationDate
			}

			var html = renderToString(<PurchaseDetail company={company} report={report} purchase={debugPurchase}/>);

			dbreport.htmlResult = html;
			dbreport.save();

			return yield self.buildPdfReport(html);
		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	datedEntries(req, res) {
		let self = this;
		co(function*(){
			var d1 = AppDate.parse(req.body.startDate);
			var d2 = AppDate.parse(req.body.endDate);

			if(d1 > d2) {
				throw 'No permitido: la fecha de inicio debe ser menor a la fecha fin.';
			}
			let debugEntries = {}
			let entries = yield req.app.db.warehouseEntries.findAll();
			//console.log("REQ BODY------------",req.body);
			if(entries.length){
				for(let ent of entries) {
					//console.log("ent-------------",ent);
					let entDate = AppDate.parse(ent.entryDate.split(' ')[0]);
					if((entDate >= d1) && (entDate <= d2)){
						
						let entriesPurchases = yield req.app.db.warehouseEntryPurchases.findOne({code: ent.code});
						//let entriesTransfers = yield req.app.db.warehouseEntryTransfers.findOne({code: ent.code});
						console.log("PURCHASES-------",entriesPurchases);
						//console.log("TRANSFERS-------",entriesTransfers);
						debugEntries[ent.code] = {
							transactionsTypeName:ent.transactionsTypeName,
							description:ent.description,
							entryDate:ent.entryDate,
							DatecreationDate:ent.DatecreationDate,
							articles:[]
						}

						/*for(let entpr of entriesPurchases) {
							for (let tran of entpr) {
								for (let art of tran){
									debugEntries[ent.code].articles.push({	
										x:art.quantity
									});
								}
							}
						}*/

					} 
				}
			}

			let company = {
				name: req.company.name,
				address: 'German Bush N 738',
				phone: '8598565',
				logoUrl: 'http://localhost:2000/images/tabletec-logo-128x68.png'
			}

			let report = {
				name: 'NOMBRE',
				clientCode: 'RP-TT-' + 'CLIENT CODE',
				creationDate: 'FECHA CREACION'
			}

			var html = renderToString(<DatedEntries company={company} report={report} entries={debugEntries}
				startDate={req.body.startDate} endDate={req.body.endDate}/>);

			return yield self.buildPdfReport(html);				
		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	datedOutlets(req, res) {
		let self = this;
		co(function*(){
			var d1 = AppDate.parse(req.body.startDate);
			var d2 = AppDate.parse(req.body.endDate);

			if(d1 > d2) {
				throw 'No permitido: la fecha de inicio debe ser menor a la fecha fin.';
			}
			let debugPurchases = {}


		}).then(pdf=>{
			res.json({pdf});
		}).catch(err=>{
			res.sendError(err);
		});
	}

	/************************************************************************************/

	buildPdfReport(html) {
		return new Promise((resolve, reject)=>{
			let config = {
				"type": "pdf",
				"format": "Letter",

				"border": {
					"top": "10mm",
					"right": "10mm",
					"bottom": "10mm",
					"left": "10mm"
				},

				"header": {
					"height": "24mm",
				},

				"footer": {
					"height": "10mm",
				}
			}
			pdf.create(html, config).toBuffer((err, buffer)=>{
				if(err){
					reject('Failed to convert to pdf:');
				}else if(Buffer.isBuffer(buffer)){
					resolve(buffer.toString('base64'));
				}else{
					reject('This is a buffer:', Buffer.isBuffer(buffer));
				}
			});
		});
	}

	translateTransferStatus(value) {
		switch(value) { //created, approved, cancelled, delayed, delivered, joined
			case 'created': return 'Creado';
			case 'approved': return 'Aprobado';
			case 'cancelled': return 'Cancelado';
			case 'withdrawn': return 'Retirado del almacen de origen';
			case 'delayed': return 'Retrasado';
			case 'joined': return 'Depositado en almacén destino';
			default: return 'Desconocido'
		}
	}

	translatePurchaseStatus(value) {
		switch(value) { //created, approved, cancelled, delayed, delivered, joined
			case 'created': return 'Creado';
			case 'approved': return 'Aprobado';
			case 'cancelled': return 'Cancelado';
			case 'delivered': return 'Entregado';
			case 'delayed': return 'Retrasado';
			case 'joined': return 'Depositado en almacén';
			default: return 'Desconocido'
		}
	}
}

module.exports = Reports;
