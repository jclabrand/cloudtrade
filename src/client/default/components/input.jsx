
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

import Progress from '../components/progress.jsx';

/****************************************************************************************/

module.exports = class Input extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			disabled: this.props.disabled || false,
			checked: false
		}

		this._autocompleteResponseData = {}
	}

	componentDidMount() {
		this._init();
	}

	componentDidUpdate(prevProps, prevState) {
		this._restart();
	}

	// Common functions

	disable() {
		this.setState({ disabled: true });
	}

	enable() {
		this.setState({ disabled: false });
	}

	isEnabled() {
		return !this.state.disabled;
	}

	value(v) {
		return v ? $(this.refs.inputField).val(v) : $(this.refs.inputField).val();
	}

	clear() {
		$(this.refs.inputField).val('');
	}

	checked() {
		return this.state.checked;
		///return this.props.type === 'checkbox' ? this.refs.inputField.checked : false
	}

	validateFileFormat(acceptedFormats) {
		var self = this;
		return new Promise(function(resolve, reject){
			if(self.props.type !== 'file'){
				reject();
			}else if(self.refs.fileInputField.files && self.refs.fileInputField.files[0]){
				var file = self.refs.fileInputField.files[0];
				var format = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name) : undefined;

				if(format[0] && (acceptedFormats.indexOf(format[0])>=0)){
					resolve({ file, format: format[0] });
				}else{
					reject();
				}
			}
		});
	}

	onChange(event) {
		switch(this.props.type){
			case 'text':
			case 'autocomplete':
				if(this.props.onChange){
					this.props.onChange(this);
				}
				break;
			case 'checkbox':
				this.setState({ checked: this.refs.inputField.checked });
				break;
			case 'switch':
				var checked = !this.state.checked;
				this.setState({checked});
				if(this.props.onChange){
					this.props.onChange(checked);
				}
				break;
			case 'date':
				if(this.props.onChange){
					this.props.onChange(this);
				}
				break;
		}
	}

	onFocus() {
		if(this.props.onFocus){
			this.props.onFocus();
		}
	}

	onBlur() {
		if(this.props.onBlur){
			this.props.onBlur();
		}
	}

	render() {
		switch(this.props.type){
		case 'text':
			return(
			<div className={'input-field ' + this.props.className}>
				{
					this.props.iconName ? (<i className="material-icons prefix">{this.props.iconName}</i>) : null
				}
				{
					this.state.disabled ?
					<input ref="inputField" className="validate" id={this.props.name} name={this.props.name} type="text"
						placeholder={this.props.placeholder} disabled
						style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
					:
					(
						this.props.required ?
						(
							this.props.readOnly ?
							<input ref="inputField" className="validate" type="text" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}
								required readOnly onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
								style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
							:
							<input ref="inputField" className="validate" type="text" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}
								required onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
								style={{height: '2.6rem', marginBottom: '0.3rem'}}/>
						)
						:
						(
							this.props.readOnly ?
							<input ref="inputField" className="validate" type="text" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}
								readOnly onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
								style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
							:
							<input ref="inputField" className="validate" type="text" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}
								onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
								style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
						)
					)
				}
				<label htmlFor={this.props.name} style={{width: '95%'}}>{this.props.label}</label>
			</div>);

		case 'email':
			return(
			<div className={'input-field ' + this.props.className}>
				{
					this.props.iconName ? (<i className="material-icons prefix">{this.props.iconName}</i>) : null
				}
				{
					this.props.required ?
					<input ref="inputField" className="validate" type="email" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}
						required onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
						style={{height: '2.6rem', marginBottom: '0.3rem'}}/>
					:
					<input ref="inputField" className="validate" type="email" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}
						onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
						style={{height: '2.6rem', marginBottom: '0.3rem'}}/>
				}
				<label htmlFor={this.props.name} style={{width: '95%'}}>{this.props.label}</label>
			</div>);

		case 'password':
			return(
			<div className={'input-field ' + this.props.className}>
				{
					this.props.iconName ? (<i className="material-icons prefix">{this.props.iconName}</i>) : null
				}

					<input ref="inputField" className="validate" type="password" id={this.props.name} name={this.props.name} placeholder={this.props.placeholder}
						required onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
						style={{height: '2.6rem', marginBottom: '0.3rem'}}/>

				<label htmlFor={this.props.name} style={{width: '95%'}}>{this.props.label}</label>
			</div>);

		case 'checkbox':
			return(
			<div className={'input-field ' + this.props.className}>
				{
					this.state.disabled ?
					<input ref="inputField" className="filled-in" id={this.props.name} name={this.props.name}
						type="checkbox" checked={this.state.checked ? 'checked' : ''} disabled onChange={this.onChange.bind(this)}/>
					:
					<input ref="inputField" className="filled-in" id={this.props.name} name={this.props.name}
						type="checkbox" checked={this.state.checked ? 'checked' : ''} onChange={this.onChange.bind(this)}/>
				}
				<label htmlFor={this.props.name}>{this.props.label}</label>
			</div>);
		
		case 'file':
			return(
			<div className={'file-field input-field ' + this.props.className} style={{margin: '1rem 0rem 0.5rem 0rem', padding: '0rem 0.3rem'}}>
				{
					this.state.disabled ?
					<div className={'btn ' + this.props.themeColor} disabled style={{padding: '0rem 0.7rem 0rem 0.7rem'}}>
						<i className="material-icons" style={{height: '2.6rem', marginRight: '0rem'}}>file_upload</i>
						<input ref="fileInputField" name={this.props.fileInputName} type="file" accept="image/*" disabled
							style={{height: '2.6rem'}}/>
					</div>
					:
					<div className={'btn ' + this.props.themeColor} style={{height: '2.6rem', padding: '0rem 0.7rem 0rem 0.7rem'}}>
						<i className="material-icons" style={{height: '2.6rem', marginRight: '0rem'}}>file_upload</i>
						<input ref="fileInputField" name={this.props.fileInputName} type="file" accept="image/*"
							style={{height: '2.6rem'}}/>
					</div>
				}
				<div className="file-path-wrapper">
					{
						this.state.disabled ?
						<input ref="inputField" className="file-path validate" name={this.props.name} type="text"
							placeholder={this.props.placeholder} disabled style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
						:
						<input ref="inputField" className="file-path validate" name={this.props.name} type="text"
							placeholder={this.props.placeholder} required style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
					}
				</div>

				<Progress ref="fileUploadProgress"/>

				<div ref="fileUploadPreview" style={{width: '40%'}}></div>

				<div ref="fileUploadErrorSection" style={{color: 'red'}}>
					<blockquote style={{margin: '0.8rem 0rem 0.6rem 0rem'}}>
						<b>ERROR: No se pudo enviar el archivo</b>
					</blockquote>
				</div>
			</div>);

		case 'autocomplete':
			return(
			<div className={'input-field autocomplete ' + this.props.className}>
				{
					this.state.disabled ?
					<input ref="inputField" className="autocomplete-input" id={this.props.name} name={this.props.name} type="text"
						placeholder={this.props.placeholder} disabled
						style={{height: '2.6rem'}}/>
					:
					(
						this.props.required ?
						<input ref="inputField" className="autocomplete-input" id={this.props.name} name={this.props.name} type="text"
							autoComplete="off" placeholder={this.props.placeholder} required onChange={this.onChange.bind(this)}
							style={{height: '2.6rem'}}/>
						:
						<input ref="inputField" className="autocomplete-input" id={this.props.name} name={this.props.name} type="text"
							autoComplete="off" placeholder={this.props.placeholder} onChange={this.onChange.bind(this)}
							style={{height: '2.6rem'}}/>
					)
				}
				<label htmlFor={this.props.name} style={{width: '95%'}}>{this.props.label}</label>
			</div>);

		case 'switch':
			return(
			<div className={this.props.className}>
				<div className="switch">
					<label style={{display: 'flex', justifyContent: 'space-between'}}>
						<div style={{fontSize: '1rem', padding: '0.5rem 0rem'}}>
							{this.props.label}
						</div>
						<div style={{padding: '0.7rem 0rem'}}>
							<input ref="inputField" type="checkbox" onChange={this.onChange.bind(this)}/>
							<span className="lever"></span>
						</div>
					</label>
				</div>
			</div>);
		case 'date':
			return(
			<div className={'input-field ' + this.props.className}> 
				{ 
					this.state.disabled ?
						<input ref="inputField" type="date" className="datepicker" id={this.props.name} name={this.props.name}
							disabled placeholder={this.props.placeholder} style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
						:
						<input ref="inputField" type="date" className="datepicker" id={this.props.name} name={this.props.name}
							placeholder={this.props.placeholder}
							onChange={this.onChange.bind(this)}
							style={{height: '2.6rem', marginBottom: '0.2rem'}}/>
				}
				<label htmlFor={this.props.name} style={{width: '95%'}}>{this.props.label}</label>
			</div>);
		}
	}

	_init() {
		var self = this;
		switch(this.props.type){
		case 'text':
			break;
		case 'file':
			var fileUploadOptions = {
				url: window.location.href,
				dataType: 'json',
				formData: {
					command: 'UPLOAD_FILE',
					//userID: self.props.user.id
				},
				replaceFileInput: false,

				change: this.onUploadFileChange.bind(this),
				start: this.onUploadFileStart.bind(this),
				progressall: this.onUploadFileProgress.bind(this),
				done: this.onUploadFileDone.bind(this),
				fail: this.onUploadFileFail.bind(this)
			}
			this.refs.fileUploadProgress.hide();
			$(this.refs.fileUploadPreview).hide();
			$(this.refs.fileUploadErrorSection).hide();
			$(this.refs.fileInputField).fileupload(fileUploadOptions);
			break;
		case 'autocomplete':
			this.onAutocompleteRebuild();
			break;
		case 'date':
			$(this.refs.inputField).pickadate({
				//selectMonths: true, // Creates a dropdown to control month
				//selectYears: 15 // Creates a dropdown of 15 years to control year
				format: 'dd/mm/yyyy'
			});
			break;
		}
	}

	_restart() {
		var self = this;
		switch(this.props.type){
		case 'autocomplete':
			this.onAutocompleteRebuild();
			break;
		}
	}

	// File Upload functions

	onUploadFileChange() {
		$(this.refs.fileUploadPreview).html(null);
	}

	onUploadFileStart(e) {
		this.refs.fileUploadProgress.set(0);
		this.refs.fileUploadProgress.show();

		$(this.refs.fileUploadPreview).hide();
		$(this.refs.fileUploadErrorSection).hide();
	}

	onUploadFileProgress(e, data) {
		var progressVal = parseInt(data.loaded / data.total * 100, 10);
		this.refs.fileUploadProgress.set(progressVal);
	}

	onUploadFileDone(e, data) {
		var self = this;

		this.files = data.files;
		this.refs.fileUploadProgress.hide();

		if(data.files && data.files[0]){
			var file = data.files[0];
			var fr = new FileReader();
			fr.onload = function(){
				var img = new Image();
				img.onload = function() {
					file.img = img;
					$(img).addClass('responsive-img z-depth-3');
					$(self.refs.fileUploadPreview).html(img);
				};
				img.src = fr.result;
			};
			fr.readAsDataURL(file);
		}

		$(this.refs.fileUploadPreview).show();
	}

	onUploadFileFail(e) {
		this.refs.fileUploadProgress.hide();
		$(this.refs.fileUploadPreview).hide();
		$(this.refs.fileUploadErrorSection).show();
	}

	// Autocomplete functions

	onAutocompleteRebuild() {
		var dataKey = this.props.options.key;
		var autocompleteData = {}
		var autocompleteRD = {}

		this.props.options.data.forEach(function(obj){
			autocompleteRD[obj[dataKey]] = obj,
			autocompleteData[obj[dataKey]] = null;
		});

		this._autocompleteResponseData = autocompleteRD;

		$(this.refs.inputField).autocomplete({
			data: autocompleteData,
			limit: 10,
			onAutocomplete: this.onAutocomplete.bind(this),
			minLength: this.props.options.minLength
		});
	}

	onAutocomplete(dataKey) {
		//console.log(dataKey, this._autocompleteResponseData[dataKey]);

		if(this.props.onAutocomplete){
			this.props.onAutocomplete(this._autocompleteResponseData[dataKey]);
		}
	}
}
