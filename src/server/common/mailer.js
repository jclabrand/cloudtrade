
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

//var generatePassword = require('password-generator');
import nodemailer from 'nodemailer';
import React from 'react'
import { renderToString } from 'react-dom/server'

/****************************************************************************************/

class EmailConfirmationMessage extends React.Component {
	constructor(props){
		super(props)
	}

	render() {
		let url = 'http://'+this.props.domainName+'/registro/verificar-email/'+this.props.userHash+'/'+this.props.emailHash,
			company = this.props.companyFrom;
		return(
		<div>
			<img src={this.props.logoSrc}/>
			<b><br/><br/>{company}</b>
			<p>Hola {this.props.userName}</p>
			<p>Haz clic en el siguiente enlace para verificar la dirección de email de tu cuenta de {company}®:</p>
			<a href={url}>{url}</a>
			<p>Verificar tu dirección de email te permitirá usar todas las opciones de tu cuenta de {company}, sin gastos adicionales, en cualquier momento.</p>
			<p>Si deseas más información, <a>haz clic aquí</a> para ver las Preguntas Frecuentes o contacta con el equipo de Asistencia de CloudTrade.</p>
			<p>Atentamente,<br/>Equipo de asistencia de {company}</p>
		</div>)
	}
}

module.exports = class Mailer {
	constructor() {
		this.siteMail = {
			email: 'pao.xaq@gmail.com',
			password: 'pandora132',
			service: 'Gmail'
		}
		this.domainName = 'cloudtrade.ml';//this.domainName = 'localhost:8080';
		//this.isSendingToInstallerEnabled = true;
	}

	/*disableSendingToInstaller(timeout) {
		var mailer = this;
		this.isSendingToInstallerEnabled = false;
		setTimeout(function(){
			mailer.isSendingToInstallerEnabled = true;
		}, timeout);
	}*/

	/*createMessageForInstaller() {
		var mailer = this;
		return new Promise(function(resolve, reject){
			if(mailer.isSendingToInstallerEnabled){
				var pass = generatePassword();
				resolve({
					generatedPassword: pass,
					subject: 'Usfxsac. Tu clave de administrador para configuración',
					html: '<b>Universidad San Francisco Xavier de Chuquisaca</b>'+
								'<p>En respuesta a la solicitud de creación de nuevos datos de configuración, se le ha enviado una clave temporal</p>'+
								'<p>Clave: '+ pass +'</p>'+
								'<p>Esta clave caduca al cerrar la sesión de superusuario</p>'+
								'<p>Gracias,<br>Equipo de asistencia de Usfxsac.com</p>'
				});
			}else{
				reject(new AppError(7002, 503));
			}
		});
	}*/

	verifyEmailMessageFor(user) {
		return {
			subject: 'Correo de verificacion de tu cuenta de CloudTrade - Accion requerida',
			html: renderToString(<EmailConfirmationMessage domainName={this.domainName}
				userHash={user.hashCode} userName={user.name} emailHash={user.emails[0].verificationHash} companyFrom="CloudTrade"
				logoSrc="https://portal.cloud-trade.com/Resources/light_background_logo.png"/>)
		}
	}

	send(msg, receivers, sender) {
		if(!sender){
			sender = this.siteMail
		}
			
		return new Promise(function(resolve, reject){
			var smtpConfig = {
				service: sender.service,
				auth: {
					user: sender.email,
					pass: sender.password
				}
			};
			var transporter = nodemailer.createTransport(smtpConfig);
			var mailOptions = {
				from: sender.email,
				to: receivers, // list of receivers
				subject: msg.subject,
				html: msg.html
			};

			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					reject(error);
				}else{
					resolve(info.response);
				}
			});
		});
	}

};
