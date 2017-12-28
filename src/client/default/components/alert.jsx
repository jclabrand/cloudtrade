
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Victor Bedoya.
	For conditions of distribution and use, see copyright notice in license.txt

/****************************************************************************************/

import React from 'react';

/****************************************************************************************/

module.exports = class Alert extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		switch(this.props.type){
		case 'success': return(
			<div id="card-alert" className="card green">
       			<div className="card-content white-text">
         		 <p>
					  <i className="material-icons" style={{position:'relative',top:'4px',paddingRight:'0.5rem'}}>done</i>
					  {this.props.text}
				</p>
        		</div>     
    		</div>
		);
		case 'info': return(
			<div id="card-alert" className="card cyan lighten-2">
       			<div className="card-content white-text">
					<p>
						<i className="material-icons" style={{position:'relative',top:'4px',paddingRight:'0.5rem'}}>notifications</i>
						{this.props.text}
					</p>
        		</div>     
    		</div>
		);
		case 'warning': return(
			<div id="card-alert" className="card orange">
       			<div className="card-content white-text">
         		 <p><i className="material-icons" style={{position:'relative',top:'4px',paddingRight:'0.5rem'}}>warning</i>{this.props.text}</p>
        		</div>     
    		</div>
		);
		case 'error': return(
			<div id="card-alert" className="card red">
       			<div className="card-content white-text">
         		 <p><i className="material-icons" style={{position:'relative',top:'4px',paddingRight:'0.5rem'}}>info</i>{this.props.text}</p>
        		</div>     
    		</div>
		);
		}
	}
}