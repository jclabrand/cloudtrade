
/****************************************************************************************/

import React from 'react';

/****************************************************************************************/

module.exports = class Select extends React.Component {
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		$(this.refs.inputField).on('change', ()=>{
			if(this.props.onChange){
				this.props.onChange( $(this.refs.inputField).val() );
			}
		}).material_select();
	}

	componentDidUpdate() {
		let open = $(this.refs.inputField).data('open');
		$(this.refs.inputField).material_select();

		$(this.refs.inputField).data('open', open);
	}

	onFocus() {
		if(this.props.onFocus){
			this.props.onFocus();
		}
	}

	value(v) {
		return v ? $(this.refs.inputField).val(v) : $(this.refs.inputField).val();
		//return $(this.refs.inputField).val();
	}

	render() {
		let nameField = this.props.nameField
		return(
		<div className={'input-field ' + this.props.className} onFocus={this.onFocus.bind(this)}>
			<select ref="inputField">
				<option disabled>{this.props.placeholder}</option>
				{
					this.props.options.map((opt, i)=>{
						return opt ? (<option value={opt[this.props.valueField]} key={i}>{opt[this.props.nameField]}</option>) : null
					})
				}
			</select>
			<label>{this.props.label}</label>
		</div>)
	}
}
