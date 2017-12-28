
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
			<div className="col s12 m3 l3">
			    <a href={this.props.href} className="card horizontal hoverable" style={{borderRadius:'10px 10px 10px 10px'}}>
			      <div className={'card-image white-text valign-wrapper center-align ' + this.props.themeColor}
							style={{width:'30%', borderRadius:'10px 0px 0px 10px'}}>
			        <i className="medium material-icons   valing center " style={{width:'100%'}}>{this.props.iconName}</i>
			      </div>
			      <div className="card-stacked">
			        <div className="card-content" style={{padding:'0.5rem 0rem 0.5rem 2rem'}}>
			          <spam style={{color:'black'}}><b>{this.props.text1}</b></spam>
			          <h3 style={{color:'black' , margin: '0rem'}}><b>{this.props.text2}</b></h3>
			          <p style={{color:'black'}}>{this.props.text3}</p>
			        </div>
			      </div>
			    </a>
			</div>
		)
	}
}