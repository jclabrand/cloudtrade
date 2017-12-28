
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

const React = require('react');

/****************************************************************************************/

module.exports = class PropertySingle extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className="row no-margin">
			<div className="col s6" style={{padding: '0rem 0.3rem'}}>
				<h6 style={{fontWeight: 'bold'}}>{ this.props.name + ':'}</h6>
			</div>
			<div className="col s6" style={{padding: '0rem 0.3rem'}}>
				<h6>{ this.props.value }</h6>
			</div>
		</div>)
	}
}
