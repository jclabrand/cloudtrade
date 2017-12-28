
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

const React = require('react');

/****************************************************************************************/

class Progress extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	hide() {
		$(this.refs.wrapper).hide();
	}

	show() {
		$(this.refs.wrapper).show();
	}

	set(progressVal) {
		if(this.props.type === 'determinate'){
			$(this.refs.progress).css('width', progressVal + '%');
		}
	}

	render() {
		switch(this.props.type){
		case 'determinate':
			return(
			<div ref="wrapper" className="progress col s12" style={{marginBottom: '0rem'}}>
				<div ref="progress" className="determinate" style={{width: '0%'}}></div>
			</div>)
		case 'indeterminate':
			return(
			<div ref="wrapper" className="progress col s12">
				<div ref="progress" className="indeterminate"></div>
			</div>)
		}
	}
}

Progress.defaultProps = {
	type: 'determinate'
};

module.exports = Progress;
