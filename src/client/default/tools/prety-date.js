class PretyDate {
	static pretyfy(d) {
		let date = new Date(d);
		let monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
		return date.getDate() + ' ' + monthNames[date.getMonth()];
	}

	static pretyLong(d) {
		let date = d ? new Date(d) : new Date();
		let monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
		return date.getDate() + ' de ' + monthNames[date.getMonth()] + ', ' + date.getFullYear();
	}

	static formated(d) {
		let date = d ? new Date(d) : new Date();
		let day = date.getDate(), month = (date.getMonth()+1);
		return ((day > 9) ? day : ('0'+day)) + '/' + ((month > 9) ? month : ('0'+month))+ '/' + date.getFullYear();
	}

	static parse(str) {
		var astr = str.split('/');
		return new Date(astr[2]+' '+astr[1]+' '+astr[0]);
	}
}

export { PretyDate }