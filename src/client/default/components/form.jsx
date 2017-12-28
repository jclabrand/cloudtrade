
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

module.exports = class Form extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._rules = this.props.rules ? this.props.rules : {};

		this._rules.errorElement = 'div',
		this._rules.errorPlacement = function(error, element){
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		},
		this._rules.submitHandler = this.onSubmit.bind(this);

		$(this.refs.form).validate(this._rules);
	}

	valid() {
		return $(this.refs.form).valid();
	}

	revalidate() {
		$(this.refs.form).validate(this._rules);
	}

	onSubmit(f) {
		if(this.props.onSubmit){
			this.props.onSubmit(f);
		}
	}

	render() {
		return(
		<form ref="form" method="post" encType="multipart/form-data">
			{this.props.children}
		</form>)
	}
}
