
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

/*****************************************************************************************/

class Button extends React.Component {
	constructor(props) {
		super(props);
		
		this.state ={
			disabled: ''
		}
	}

	onClick() {
		if(this.props.onClick){
			this.props.onClick();
		}
	}

	disable() {
		this.setState({disabled: 'disabled'});
	}

	enable() {
		this.setState({disabled: ''});
	}

	render() {
		return(
		<button className={'btn waves-effect waves-light ' + this.state.disabled + ' ' + this.props.className}
			type={this.props.type}
			onClick={this.onClick.bind(this)} style={{textTransform: 'none', fontWeight: 'bold', width: '100%'}}>
			{this.props.text}
			<i className="material-icons right">{this.props.iconName}</i>
		</button>)
	}
}

Button.defaultProps = {
	type: 'button'
};

export { Button }
