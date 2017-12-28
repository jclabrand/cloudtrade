
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import React from 'react';

import Dropdown from '../components/dropdow.jsx';

/****************************************************************************************/

module.exports = class SectionCard extends React.Component {
	constructor(props) {
        super(props);
    }

	componentDidMount() {
	}

	componentDidUpdate(prevProps, prevState) {
	}

	render() {
		return(
		<div className="card-panel" style={{padding: '0rem', margin: '0.5rem 0rem'}}>	
			<div style={{padding: '0.5rem 0.5rem 0rem 0.5rem', display: 'flex', justifyContent: 'space-between'}}>
				<div style={{margin: '0rem 0rem 0.8rem 0rem'}}>
					{
						this.props.iconName ?
						<i className="material-icons" style={{paddingRight: '1rem',position:'relative',top:'0.3rem',display:'inline'}}>
							{this.props.iconName}
						</i> : null
					}
					{
						this.props.title ?
						<h6 style={{display:'inline', fontWeight: 'bold', fontSize: '1.2rem'}}>
							{ this.props.title }
						</h6> : null
					}
				</div>
				{
					this.props.menuID ?
					<Dropdown ref="dropdownMenu" menuID={this.props.menuID} items={this.props.menuItems}/>
					: null
				}
			</div>
			{this.props.children}
		</div>)
	}
}
