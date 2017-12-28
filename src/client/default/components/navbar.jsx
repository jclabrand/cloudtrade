
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';
//const Link = require('react-router-dom').Link;

/****************************************************************************************/

module.exports = class Navbar extends React.Component {
	constructor(props) {
		super(props);

		/*this.state = {
			user: this.props.user
		}*/
	}

	componentDidMount() {
		this.updateMaterialComponents();
	}

	componentDidUpdate() {
		this.updateMaterialComponents();
	}

	updateMaterialComponents() {
		if(this.props.useSideMenu){
			$(this.refs.sideBtn).sideNav({
				menuWidth: 250, // Default is 300
				closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
				draggable: true // Choose whether you can drag to open on touch screens
			});
		}

		$(this.refs.userDropdown).dropdown({
			constrainWidth: false,
			alignment: 'right'
		});
	}

	/*onItemSelect(item) {
		if(item.select){
			item.select(item);
		}
		$(this.refs.dropdownMenu).dropdown('close');
	}*/

	onOpenUserDropdown() {
		$(this.refs.userDropdown).dropdown('open');
	}

	onLogout() {
		if(this.props.onLogout){
			this.props.onLogout();
		}
		$(this.refs.userDropdown).dropdown('close');
	}

	render() {
		var primary1Color = (this.props.theme && this.props.theme.palette && this.props.theme.palette.primary1Color)?
			this.props.theme.palette.primary1Color : 'blue-grey darken-3';
		return(
		<div className="navbar-fixed">
			{
				this.props.user ?
				<ul id="navbarUserDropdown" className="dropdown-content">
					<li><a href="/cuenta">Mi cuenta</a></li>
					<li className="divider"></li>
					<li>
						<a onClick={this.onLogout.bind(this)}>Cerrar sesión</a>
					</li>
				</ul> : null
			}

			<nav>
			{/*
				<div className={'nav-wrapper ' + primary1Color}>
					{
						this.props.showSideMenu ?
						<ul className="left">
							<li>
								<a ref="sideBtn" data-activates="nav-mobile">
									<i className="material-icons">menu</i>
								</a>
							</li>
						</ul> : null
					}
					

					

					<ul className="right hide-on-large-only">
						<li><a><i className="material-icons">person</i></a></li>
					</ul>

					<ul className="right hide-on-med-and-down">
					{
						this.props.user ?
						<li>
							<a ref="userDropdown" className="dropdown-button" data-activates="navbarUserDropdown"
								onClick={this.onOpenUserDropdown.bind(this)}>
								{this.props.user.name}
								<i className="material-icons right">arrow_drop_down</i>
							</a>
						</li> :
						<li>
							<Link to="/login">Inicie sesión</Link>
						</li>
					}
					</ul>
				</div>
			*/}
			{
				this.props.user ?
				<div className={'nav-wrapper ' + primary1Color}>
					{
						this.props.useSideMenu ?
						<ul className="left">
							<li>
								<a ref="sideBtn" data-activates="nav-mobile">
									<i className="material-icons">menu</i>
								</a>
							</li>
						</ul> : null
					}

					<ul className="right">
						<li ref="userDropdown" className="dropdown-button" data-activates="navbarUserDropdown"
								onClick={this.onOpenUserDropdown.bind(this)}>
							<a className="hide-on-large-only">
								<i className="material-icons">person</i>
							</a>
							<a className="hide-on-med-and-down">
								{this.props.user.name}
								<i className="material-icons right">arrow_drop_down</i>
							</a>
						</li>
					</ul>
				</div>
				:
				<div className={'nav-wrapper ' + primary1Color}>
					{
						this.props.useSideMenu ?
						<ul className="left">
							<li>
								<a ref="sideBtn" data-activates="nav-mobile">
									<i className="material-icons">menu</i>
								</a>
							</li>
						</ul> : null
					}

					{/*<span className="" style={{paddingLeft: '1rem'}}>Title</span>*/}
					<ul className="right">
						<li>
							<a href="/login">Inicie sesión</a>
						</li>
					</ul>
				</div>
			}
			</nav>
		</div>)
	}
}
