
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

var React = require('react');

/****************************************************************************************/

class TableRow extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			className: '',
			checked: false
		}
	}

	componentDidMount() {
		let className = '',
			checked = false;

		if(this.props.row.tableSelected){
			className = 'grey lighten-2';
		}

		if(this.props.row._tableChecked){
			checked = true;
		}

		this.setState({className, checked});
	}

	componentWillUnmount() {
	}

	componentWillReceiveProps(nextProps) {
		let className = '',
			checked = false;

		if(nextProps.row.tableSelected){
			className: 'grey lighten-2';
		}

		if(nextProps.row._tableChecked){
			checked = true;
		}

		this.setState({className, checked});
	}

	onCheckBoxChange() {
		if(this.props.row._tableChecked) {
			this.props.row._tableChecked = false;
		} else {
			this.props.row._tableChecked = true;
		}

		this.setState({checked: this.props.row._tableChecked});
	}

	onSelect(e) {
		this.props.onSelect(this.props.row);
	}

	/*onUnselect() {
		if(this._isMounted) {
			this.setState({className: ''});
		}
	}*/

	onCheck() {
		console.log('onCheck RRRRR');
	}

	render() {
		let columns = this.props.columns,
			row = this.props.row,
			rowClassName = this.state.className;

		return(
		<tr className={rowClassName}>
			<td className="center" style={{whiteSpace: 'nowrap', padding: '0.5rem'}}>{this.props.index}</td>
			{
				this.props.check ?
				<td className="center" style={{whiteSpace: 'nowrap', padding: '0.5rem'}} onClick={this.onCheckBoxChange.bind(this)}>
					{
						this.state.checked ?
						 <i className="material-icons green-text ">done</i>:
						 <i className="material-icons ">crop_din</i>
					}
				</td>: null
			}
			{
				columns.map((column, i)=>{
					return column['visible'] ?
					<td key={i} onClick={this.onSelect.bind(this)}
						style={{whiteSpace: 'nowrap', padding: '0.5rem', fontSize: '1rem'}}>
						{row[column['name']]}
					</td>
					: null;
				})
			}
		</tr>)
	}
}

class Pagination extends React.Component {
	constructor(props) {
		super(props);
	}

	onSelectPage(n) {
		if(this.props.onSelectPage){
			this.props.onSelectPage(n);
		}
	}

	render() {
		let apages = [];
		for(var i=0;i<this.props.numPages;i++){ apages.push(i); }
		return (
		<ul className="pagination" style={{margin: '1rem 0rem'}}>
			<li className="disabled"><a><i className="material-icons">chevron_left</i></a></li>
			{
				apages.map((e, i)=>{
					if(e === this.props.selectedIndex){
						return (
						<li key={i} className="active light-blue darken-3">
							<a onClick={this.onSelectPage.bind(this, e)}>{e + 1}</a>
						</li>)
					}else{
						return (
						<li key={i} className="waves-effect">
							<a onClick={this.onSelectPage.bind(this, e)}>{e + 1}</a>
						</li>)
					}
				})
			}
			<li className="disabled"><a><i className="material-icons">chevron_right</i></a></li>
			{/*<li className="waves-effect"><a ><i className="material-icons">chevron_right</i></a></li>*/}
		</ul>)
	}
}

class Table extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			filteredRows: [],
			selectedPage: 0,
			selectedRow: null
		}
	}

	componentDidMount() {
		this.setState({filteredRows: this.props.rows});
	}

	/*shouldComponentUpdate(nextProps, nextState) {
		if(this.props.columns !== nextProps.columns){
			return true;
		}
		if(this.props.rows !== nextProps.rows){
			this.refilterRows();
			return true;
		}
		if(this.state.filteredRows !== nextState.filteredRows){
			return true;
		}
		return false;
	}*/

	componentWillReceiveProps(nextProps) {
		if(this.props.rows !== nextProps.rows){
			this.refilterRows(
				this.refs.filter ? this.refs.filter.value : '', nextProps.filterBy, nextProps.rows);
		}
	}

	componentDidUpdate() {
		//this.unselectRow();
	}

	show() {
		$(this.refs.tableWrapper).show();
	}

	hide() {
		$(this.refs.tableWrapper).hide();
	}

	refilterRows(filterText, filterKey, nextRows) {
		let fval = filterText.toUpperCase();

		let frows = filterKey ?
			nextRows.filter((row)=>{
				return (row[filterKey].toUpperCase().indexOf(fval) > -1);
			}) : nextRows;

		this.setState({filteredRows: frows, selectedPage: 0});
	}

	/*unselectRow() {
		if(this.selectedRow){
			this.selectedRow.onUnselect();
			if(this.props.onUnselectRow){
				this.props.onUnselectRow(this.selectedRow);
			}
			this.selectedRow = null;
		}
	}*/

	onSelectRow(row) {
		
		/*this.unselectRow();
		this.selectedRow = rowComp;

		if(this.props.onSelectRow){
			this.props.onSelectRow(rowComp.props.row);
		}*/



		let prevRow = this.state.selectedRow;

		//if(row !== prevRow){
			if(prevRow){
				prevRow.tableSelected = false;
			}
			row.tableSelected = true;
			if(this.props.onSelectRow){
				this.props.onSelectRow(row);
			}
			this.setState({selectedRow: row});
		//}
	}

	onFilterKeyUp() {
		this.refilterRows(this.refs.filter.value, this.props.filterBy, this.props.rows);
	}

	getCheckedRows() {
		return this.props.rows.filter((r)=>{
			return r._tableChecked;
		})
	}

	onSelectPage(pageNum) {
		this.setState({selectedPage: pageNum});
	}

	render() {
		let nFilteredRows = this.state.filteredRows.length,
			npages = Math.ceil(nFilteredRows / this.props.pageLength);

		let startIndex = this.state.selectedPage * this.props.pageLength,
			endIndex = startIndex + this.props.pageLength,
			visibleRows = this.state.filteredRows.slice(startIndex, endIndex),
			columns = this.props.columns;
			
		return(
		<div className="row" ref="tableWrapper" style={{width: '100%', margin: '0rem'}}>
			{this.props.children}
			{
				this.props.filterBy ?
				<div className="input-field"style={{padding: '0'}}>
					<div className="input-field">
						<i className="material-icons prefix">search</i>
						<input ref="filter" id="table-filter" type="text" className="validate" onKeyUp={this.onFilterKeyUp.bind(this)}/>
						<label htmlFor="table-filter">Buscar...</label>
					</div>
				</div>:
				null
			}
			<table className="highlight"
				data-paging="true" data-filtering="true"
				ref="table" style={{margin: '0', display: 'block', width: '100%', overflowX: 'scroll'}}>
				<thead ref="thead" style={{width: '100%'}}>
					<tr style={{backgroundColor: '#b0bec5', width: '100%'}}>
						<th data-field="no" style={{whiteSpace: 'nowrap', padding: '0.5rem'}}>No</th>
						{
							this.props.check ?
							<th data-field="" style={{whiteSpace: 'nowrap', padding: '0.5rem'}} >Seleccionar</th> : null
						}
						{
							columns.map((column, i)=>{
								return column['visible'] ?
								<th key={i} data-field={column['name']} style={{whiteSpace: 'nowrap', padding: '0.5rem'}}>{column['text']}</th>
								: null;
							})
						}
					</tr>
				</thead>
				<tbody ref="tbody" style={{cursor: 'pointer'}}>
				{
					visibleRows && (visibleRows.length > 0) ?
					visibleRows.map((row, i)=>{
						return <TableRow key={i} index={i} columns={columns} row={row} check={this.props.check} onSelect={this.onSelectRow.bind(this)}/>
					}, this)
					: null
				}
				</tbody>
				<tfoot ref="tfoot">
				</tfoot>
			</table>
			{
				visibleRows && (visibleRows.length > 0) ?
				<div className="center">
					<Pagination numPages={npages} selectedIndex={this.state.selectedPage} onSelectPage={this.onSelectPage.bind(this)}/>
				</div> :
				<div className="center" style={{padding: '0.5rem 0rem', margin: '0rem'}}>
					<b>No hay datos que mostrar</b>
				</div>
			}
		</div>)
	}
}

Table.defaultProps = {
	pageLength: 10
};

module.exports = Table;
