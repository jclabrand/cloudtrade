
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

module.exports = class Head extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<head>
			{this.props.children}
			
			{/*<link rel="shortcut icon" href={this.props.iconName}/>*/}

			{
				this.props.styleSheets.map(function(filename, i){
					return <link key={i} rel="stylesheet" type="text/css" href={filename}/>;
				})
			}
			{
				this.props.scripts ?
				this.props.scripts.map(function(filename, i) {
					return <script key={i} src={filename}/>;
				}) : null
			}
			
			<meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1"/>
			<title>{this.props.title}</title>
		</head>
	)}
};
