
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'dropzone';

/****************************************************************************************/

class Thumbnail extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			status: 'uploading'
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.file !== this.props.file){
			this.setState({status: nextProps.file.status});
		}
	}

	onMouseOver() {
		this.refs.closeBtn.style.display = '';
		if(this.state.status === 'success'){
			this.refs.successIcon.style.display = '';
			this.refs.image.style.opacity = '0.3';
		}
	}

	onMouseLeave() {
		this.refs.closeBtn.style.display = 'none';
		if(this.state.status === 'success'){
			this.refs.successIcon.style.display = 'none';
			this.refs.image.style.opacity = '1';
		}
	}

	onClose() {
		if(this.props.onClose){
			this.props.onClose(this.props.file);
		}
	}

	setStatus(status) {
		this.setState({status});
	}

	setProgress(value) {
		this.refs.progress.style.width = value;
	}

	render() {
		var tbSRC = null;
		switch(this.props.file.type){
			case 'image/jpeg':
			case 'image/png':
			case 'image/bmp':
				tbSRC = this.props.file.thumbnailSRC;
				break;
			case 'video/mp4':
				tbSRC = '/images/photo-video-film2-icon.png';
				break;
			default:
				tbSRC = '/images/document.png';
				break;
		}

		var extraChildren = [],
			opacity = '0.3';
		switch(this.state.status){
			case 'uploading':
				extraChildren.push(
				<div key={0} className="progress" style={{position:'absolute', margin: '3rem 0.3rem', width:'7.4rem', height:'1.2rem'}}>
					<div ref="progress" className="determinate" style={{width: '0%'}}></div>
				</div>);
				extraChildren.push(
				<i key={1} className="material-icons"
					style={{position:'absolute', fontSize:'2rem', color:'#2196f3'}}>
					cloud_upload
				</i>);
				break;
			case 'success':
				opacity = '1';
				extraChildren.push(
				<i key={0} ref="successIcon" className="material-icons"
					style={{position:'absolute', fontSize:'2rem', color:'#4caf50', display:'none'}}>
					cloud_done
				</i>);
				break;
			case 'error':
				extraChildren.push(
				<i key={0} className="material-icons"
					style={{position:'absolute', fontSize:'2rem', color:'#f44336'}}>
					error
				</i>);
				break;
			default: break;
		}
		return(
		<div className="z-depth-3" style={{width:'8rem', height:'8rem', borderRadius:'0.2rem', margin:'0.5rem', display:'inline-block', position:'relative'}}
			onMouseOver={this.onMouseOver.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>

			<img ref="image" src={tbSRC} style={{width:'8rem', height:'8rem', position:'absolute', opacity:opacity, borderRadius:'0.2rem'}}/>

			<i ref="closeBtn" className="material-icons" onClick={this.onClose.bind(this)}
				style={{position:'absolute', bottom:'80%', left:'80%', fontWeight:'bolder', fontSize:'1.4rem', color:'#607d8b', cursor:'pointer', display:'none'}}>
				close
			</i>

			{ extraChildren }
		</div>
		)
	}
}

class FileUpload extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			files: []
		}
	}

	componentDidMount() {
		var self = this;

		this._dz = new Dropzone(this.refs.dzone, {
			url: /*'http://www.dropzonejs.com/upload',//*/this.props.url,
			method: 'post',
			headers: this.props.headers,
			maxFiles: this.props.maxFiles ? this.props.maxFiles : 1024,
			clickable: this.refs.clickable,

			accept: this.onAccept.bind(this),
			addedfile: this.onAddedfile.bind(this),
			thumbnail: this.onThumbnail.bind(this),
			uploadprogress: this.onUploadProgress.bind(this),
			complete: this.onComplete.bind(this),
			success: this.onSuccess.bind(this)
		});
	}

	onAccept(file, done) {
		done();
	}

	onAddedfile(file) {
		//console.log('onAddedfile');

		if(this._dz.files.length > this._dz.options.maxFiles){
			//console.log('onExced');
			this._dz.removeFile(file);
			this.refs.clickable.style.display = 'none';
		}else {
			if(this._dz.files.length == this._dz.options.maxFiles) {
				this.refs.clickable.style.display = 'none';
			}
			this.setState({ files: this._dz.files });
		}
	}

	onThumbnail(file, dataUrl) {
		//console.log('onThumbnail', file);
		file.thumbnailSRC = dataUrl
		this.setState({ files: this._dz.files });
	}

	onUploadProgress(file, progress, bytesSent) {
		//console.log('progress', file.name, progress);
		this.refs[file.name].setProgress(progress+2);
	}

	onComplete(file) {
		//console.log('COMP', file);
		this.refs[file.name].setStatus(file.status);
	}

	onSuccess(file, resp) {
		//this.refs[file.name].setStatus('complete')
		//console.log('COMP', this.refs[file.name]);
		//console.log('FILE', file, 'RESP', resp);

		file.uname = resp.name;
	}


	onCloseFile(file) {
		//console.log(file);
		this._dz.removeFile(file);
		this.setState({ files: this._dz.files });

		if(this._dz.files.length <= this._dz.options.maxFiles){
			this.refs.clickable.style.display = 'inline-block';
		}
	}

	getUniqueNames() {
		var rv = this._dz.files.map((file)=>{
			return file.uname ? file.uname : null
		});
		return rv;
	}

	render() {
		var thumbnails = this.state.files.map(function(file, i){
			return(<Thumbnail key={i} ref={file.name} file={file} onClose={this.onCloseFile.bind(this)}/>)
		}, this);

		return(
		<div ref="dzone">
			{ thumbnails }
			<div ref="clickable" style={{width:'8rem', height:'8rem', borderRadius:'0.2rem', border: '0.15rem dashed #bdbdbd', margin:'0.5rem', display:'inline-block', position:'relative', cursor:'pointer'}}>
				<i className="material-icons" style={{position:'absolute', bottom:'33%', left:'33%', fontSize:'3rem', color:'#bdbdbd'}}>add</i>
			</div>
		</div>)
	}
}

FileUpload.propTypes = {
  url: PropTypes.oneOfType([
	  PropTypes.string
  ]).isRequired
}

module.exports = FileUpload;
