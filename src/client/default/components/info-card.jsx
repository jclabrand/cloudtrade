var React = require('react');

import Progress from'../components/progress.jsx';


module.exports = class ButtonAdm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			status: 'none',
			articles: []
		}
	}

	componentWillMount() {
	}

	componentDidMount() {
		$('.collapsible').collapsible();
	}
	componentDidUpdate() {
		$('.collapsible').collapsible();
		$(this.refs.wraper).collapsible('open', 0);
	}

	onRequireArticles() {
		if(this.props.onRequireArticles && (this.state.status !== 'done') && (this.state.status !== 'loading')) {
			this.props.onRequireArticles(this.props.data, (err, res)=>{
				if(err) {
					this.setState({status: 'error'});
				}else{
					this.setState({articles: res.articles.rows, status: 'done'});
				}
			});
		}
	}

	renderArticles() {
		switch(this.state.status) {
		case 'done':
			return (
			<div className="collapsible-body" style={{padding:'0px', margin:'0px'}}>
				{
					this.state.articles.map((article, i)=>{
						if(article.stock<=20) {
							return (
							<ul key={i} className="collapsible" data-collapsible="accordion"style={{padding:'0px', margin:'0px'}}>
								<li>
									<div className="collapsible-header" style={{padding:'0px'}}>
										<p style={{margin:'0px',fontSize:'9pt'}}>
											<span style={{margin:'0px'}}><i className="tiny material-icons" 
													style={{color:'red',top:'0px',position:'relative', margin:'0px',fontSize:'10pt' }}>fiber_manual_record</i></span>
											<b>{article.name}</b>
										</p>
									</div>
									<div className="collapsible-body" style={{padding:'0px'}}>
										<p style={{margin:'0.2rem 0rem 0.2rem 2rem',padding:'0px',fontSize:'9pt'}}>
											<b>Cantidad: {article.stock}</b>
										</p>
									</div>
								</li>
							</ul>)
						}else if(article.stock<=50){
							return (
							<ul key={i} className="collapsible" data-collapsible="accordion"style={{padding:'0px', margin:'0px'}}>
								<li>
									<div className="collapsible-header" style={{padding:'0px'}}>
										<p style={{margin:'0px',fontSize:'9pt'}}>
											<span style={{margin:'0px'}}><i className="tiny material-icons" 
													style={{color:'yellow',top:'0px',position:'relative', margin:'0px',fontSize:'10pt' }}>fiber_manual_record</i></span>
											<b>{article.name}</b>
										</p>
									</div>
									<div className="collapsible-body" style={{padding:'0px'}}>
										<p style={{margin:'0.2rem 0rem 0.2rem 2rem',padding:'0px',fontSize:'9pt'}}>
											<b>Cantidad: {article.stock}</b>
										</p>
									</div>
								</li>
							</ul>);
						}else{
							return null;
						}
					})
				}
			</div>);
		case 'loading':
			return (
			<div className="collapsible-body" style={{padding:'0px', margin:'0px'}}>
				<Progress type="indeterminate"/>
			</div>);
		case 'error':
			return (
			<div className="collapsible-body" style={{padding:'0px', margin:'0px'}}>
				<span>ERROR</span>
			</div>);
		default:
			return (
			<div className="collapsible-body" style={{padding:'0px', margin:'0px'}}>
				<Progress type="indeterminate"/>
			</div>);
		}
	}

	render() {	
		return(
			<div className="col s12 m6 l4 ">
				<ul ref="wraper" className="collapsible " data-collapsible="accordion" onClick={this.onRequireArticles.bind(this)}
					style={{
							margin: '0.5rem 0 1rem 0',
						    overflow: 'hidden',
						    position: 'relative',
						    borderRadius:'10px 10px 10px 10px',
				    }}>
				    <li>
						<div className="collapsible-header" style={{ padding:'0px', margin:'0px'}}>
							<div className="row " style={{ margin:'0px', padding:'0px' }}>
								<div className="col s3 blue-grey darken-4" style={{ padding:'1.5rem 0rem 1.5rem 0rem'}}>
									<i className="material-icons valing center" style={{width:'100%', color:'white',fontSize:'45pt'}}>{this.props.iconName}</i>
								</div>
								<div className="col s9 ">
									<h6 style={{color:'black' , margin: '0rem', fontSize:'15pt', position:'relative',top:'0.9rem'}}><b>{this.props.data.name}</b></h6>
									<p style={{color:'black',margin:'0px',position:'relative',top:'0.9rem',lineHeight: '1.5em'}}>{this.props.data.type}</p>
								</div>
							</div>
						</div>
						{this.renderArticles()}
				    </li>
				</ul>
			</div>
		)
	}
}