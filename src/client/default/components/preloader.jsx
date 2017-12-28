
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

const React = require('react');

/****************************************************************************************/

module.exports = class Preloader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			class: 'preloader-wrapper small active'
		}
	}

	show() {
		$(this.refs.wrapper).show();
		this.setState({class: 'preloader-wrapper small active'});
	}

	hide() {
		this.setState({class: 'preloader-wrapper small'});
		$(this.refs.wrapper).hide();
	}

	render() {
		return(
		<div className={this.state.class} ref="wrapper">
			<div className="spinner-layer spinner-red-only">
				<div className="circle-clipper left">
					<div className="circle"></div>
				</div>
				<div className="gap-patch">
					<div className="circle"></div>
				</div>
				<div className="circle-clipper right">
					<div className="circle"></div>
				</div>
			</div>
		</div>)
	}
}
