
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

'use strict';

const React = require('react');
const Link = require('react-router-dom').Link;

/****************************************************************************************/

class SidenavButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			colorClassName: ''
		}
	}

	onSelect() {
		if(this.props.onSelect){
			this.setState({colorClassName: 'active ' + this.props.activeColor});
			this.props.onSelect(this);
		}
	}

	onUnselect() {
		this.setState({colorClassName: ''});
	}

	unselect() {
		this.onUnselect();
	}

	render() {
		return(
		<li className={this.state.colorClassName} onClick={this.onSelect.bind(this)}>
			<Link to={this.props.linkTo} style={this.props.style}>
				<i className="material-icons" style={{marginRight: '1rem'}}>{this.props.iconName}</i>
				{this.props.text}
			</Link>
		</li>)
	}
}

class SidenavSubmenu extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		$(this.refs.sidenavsub).collapsible();
	}

	render() {
		return (
		<ul ref="sidenavsub" className="collapsible collapsible-accordion">
			<li>
				<a className="collapsible-header" style={{paddingLeft: '2rem'}}>
					{this.props.text}
					<i className="material-icons" style={{marginRight: '1rem'}}>{this.props.iconName}</i>
				</a>
				<div className="collapsible-body" style={{padding: '0rem 0rem'}}>
					<ul>
					{
						this.props.subItems ?
						this.props.subItems.map((item, i)=>{
							return (
							<SidenavButton key={i} text={item.text} iconName={item.iconName} activeColor={this.props.activeColor}
								linkTo={item.linkTo} style={{paddingLeft: '3.5rem'}} onSelect={this.props.onSelect.bind(this)}/>)
						}) : null
					}
					</ul>
				</div>
			</li>
		</ul>)
	}
}

module.exports = class Sidenav extends React.Component {
	constructor(props) {
		super(props);

		this._selectedItem = null;
	}

	componentDidMount() {
		$('.collapsible').collapsible();
	}

	componentDidUpdate() {
		$('.collapsible').collapsible();
	}

	onItemSelect(item) {
		if(this._selectedItem) {
			this._selectedItem.unselect()
		}

		this._selectedItem = item;
	}

	render() {
		return(
		<ul id="nav-mobile" className="side-nav">
			<li>
				{
					this.props.user ?
					<div className="userView">
						<div className="background">
							<img src="/images/user5.png"></img>
						</div>
						<a><img className="circle" src="/images/profile-pic.jpg"></img></a>
						<a><span className="white-text name">{this.props.user.name}</span></a>
						<a><span className="white-text email">{this.props.user.email}</span></a>
					</div>
					:
					<div className="userView">
						<div className="background">
							<img src="/images/user5.png"></img>
						</div>
					</div>
				}
		    </li>
			{
				this.props.items.map(function(item, i){
					return item.subItems ?
					(<SidenavSubmenu key={i} text={item.text} iconName={item.iconName} subItems={item.subItems}
						activeColor="blue-grey lighten-4" onSelect={this.onItemSelect.bind(this)}/>)
					:
					(<SidenavButton key={i} text={item.text} iconName={item.iconName} activeColor="blue-grey lighten-4"
						linkTo={item.linkTo} style={{paddingLeft: '2rem'}} onSelect={this.onItemSelect.bind(this)}/>)
				}, this)
			}
			{/*<li><div className="divider"></div></li>*/}
		</ul>)
	}
}
