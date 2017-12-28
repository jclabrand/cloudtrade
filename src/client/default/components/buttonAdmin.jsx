
/****************************************************************************************

	Copyright (c) 2016-2017, .
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

var React = require('react');

/****************************************************************************************/

module.exports = class ButtonAdm extends React.Component
{
	constructor(props) {
		super(props);
		
	}

	render()
	{
		return(
		

<div className="col s6 m3 l3">
	      <div  className="card " style={{color:'white',borderRadius:'10px 10px 10px 10px' }}>
	      <div className="center aling #37474f blue-grey darken-3 white-text hoverable z-depth-3" style={{borderRadius:'10px 10px 10px 10px'}}>
	        <div className=" waves-effect waves-block waves-light ">
	          <a href={this.props.href}>
	            <i className="large material-icons " style={{color:'white', padding:'1.5rem 0rem 0rem 0rem'}}>{this.props.iconName}</i>
	            <p className="white-text" style={{marginTop:'0rem'}}><b>{this.props.text}</b></p>
	          </a>
	        </div>
	      </div>
	      </div>
	    </div>

	
		)
	}
}