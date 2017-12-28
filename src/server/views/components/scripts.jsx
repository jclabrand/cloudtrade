
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

module.exports = class Scripts extends React.Component{
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<body>
			{
				this.props.scripts.map(function(filename, i) {
					return <script key={i} src={filename}/>;
				})
			}
			</body>
	)}
};
