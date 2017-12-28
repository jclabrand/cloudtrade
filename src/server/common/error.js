
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

module.exports = class AppError {
	constructor(/*code, status, msg*/) {
		/*this.message = msg ? AppError.getMessage(code) + ': ' + msg : AppError.getMessage(code);
		this.code = code;
		this.responseStatus = status;*/
	}

	static std(err){
		return {
			responseStatus: err.responseStatus || 500,
			statusText: '',
			message: err.message || 'Error: ' + err,
		}
	}
/*
	static getMessage(code) {
		switch(code){

		case 8001: return 'Recaptcha incorrecto. Intente recargar la página';

		case 7002: return 'No se permite el envio de correos electrónicos';
		case 7001: return 'Falló el envío del correo electrónico';

		case 6104: return 'El valor no existe en tabla';
		case 6103: return 'El valor ya existe en tabla';
		case 6102: return 'Error al realizar la transacción en la base de datos';
		case 6101: return 'No se puede guardar registros en la base de datos porque el usuario no ha iniciado sesión';
		
		case 6005: return 'El rol de usuario no tiene asignado una cadena de conexión';
		case 6004: return 'No se pudieron crear roles de usuario para la base de datos';
		case 6003: return 'No se puede conectar con la base de datos';
		case 6002: return 'El usuario no está registrado en la base de datos';
		case 6001: return 'No existe conexión a la base de datos';

		case 5002: return 'La configuración contiene datos de rol de usuario incompatibles';
		case 5001: return 'Los datos de configuración de la aplicación no son aceptables';

		case 3007: return 'La operación tiene datos de usuario incorrectos';
		case 3006: return 'No se puede cerrar sesión de usuario con rol de visitante';
		case 3005: return 'No se puede cerrar sesión de usuario que no ha iniciado sesión';
		case 3004: return 'El rol de usuario no corresponde';
		case 3003: return 'Contraseña de incorrecta';
		case 3002: return 'No se permite realizar tareas de configuración';
		case 3001: return 'Falló la verificación del usuario';

		case 1901: return 'La aplicación ha guardado datos de usuario incorrectos';
		case 1406: return 'La operación tiene datos incorrectos';
		case 1404: return 'Página no encontrada';
		case 1500: return 'Error del servidor';
		case 1000:
		default:
			return 'Error desconocido';
		}
	}
	*/
}
