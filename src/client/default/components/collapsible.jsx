
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

const React = require('react');

/****************************************************************************************/

export class CollapsibleCard extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
		<li>
			<div className="collapsible-header ">
				<i className="material-icons">{this.props.iconName}</i>
				{this.props.title}
			</div>
			<div className="collapsible-body" style={{padding: '0.2rem'}}>
				{this.props.children}
			</div>
		</li>)
	}
}

export class Collapsible extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		$(this.refs.collapsible).collapsible();

		if(typeof this.props.defaultActiveIndex === 'number'){
			$(this.refs.collapsible).collapsible('open', this.props.defaultActiveIndex);
		}
		//$(this.refs.collapsible).collapsible('open', 0);
	}

	openCard(index) {
		$(this.refs.collapsible).collapsible('open', index);
	}

	closeCard(index) {
		$(this.refs.collapsible).collapsible('close', index);
	}

	render() {
		return(
		<ul ref="collapsible" className="collapsible" data-collapsible="accordion">
			{this.props.children}
		</ul>)
	}
}
