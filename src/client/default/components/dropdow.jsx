
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

module.exports = class Dropdown extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		$(this.refs.dropdownMenu).dropdown({
			constrainWidth: false,
			alignment: 'right'
		});
	}

	componentDidUpdate(prevProps, prevState) {
	}

	onItemSelect(item) {
		if(item.select){
			item.select(item);
		}
		$(this.refs.dropdownMenu).dropdown('close');
	}

	onOpen() {
		$(this.refs.dropdownMenu).dropdown('open');
	}

	render() {
		return(
		<div className={this.props.className} style={this.props.style}>
			<a ref="dropdownMenu" className="btn-floating btn-flat dropdown-button"
				data-activates={this.props.menuID} onClick={this.onOpen.bind(this)}>
				<i className="material-icons" style={{color: 'black'}}>more_vert</i>
			</a>
			<ul className='dropdown-content' id={this.props.menuID}>
				{
					this.props.items ?
					this.props.items.map(function(item, i){
						return(
						<li key={i}>
							<a onClick={this.onItemSelect.bind(this, item)}>{item.text}</a>
						</li>)
					}, this) : null
				}
			</ul>
		</div>)
	}
}
