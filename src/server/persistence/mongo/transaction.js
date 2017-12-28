
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import co from 'co';

/****************************************************************************************/

module.exports = class Transaction {
	constructor() {
		this._transacts = [];
	}

	static execTimeout(timeout, exec, lastly) {
		return new Promise(function(resolve, reject){
			let pending = true;
			co(function*(){
				var q = exec();
				setTimeout(()=>{
					if(pending){
						if(q.then){
							let last = q.then();
							last.then((res)=>{
								if(lastly){ lastly(res); }
							}).catch(()=>{});
						}
						pending = false;
						reject({message: 'No se pudieron leer los datos, la respuesta tardó demasiado'});
					}
				}, timeout);
				return yield q;
			}).then((res)=>{ pending = false; resolve(res); }).catch((err)=>{ pending = false; reject(err); });
		});
	}

	insert(Model, data) {
		var self = this;
		return co(function*(){
			var newItem = new Model(data);
			//var inserted = yield newItem.save();
			var inserted = yield Transaction.execTimeout(4000, ()=>{ return newItem.save() });
			self._transacts.push({ Model, type: 'insert', doc: newItem });

			return inserted;
		});
	}

	update(Model, q, data) {
		var self = this;
		return co(function*(){
			let item = yield Model.findOne(q);
			if(item){
				var updated = yield Transaction.execTimeout(4000, ()=>{
					return Model.update(q, { $set: data });
				});
				self._transacts.push({ Model, type: 'update', query: q, doc: item });

				return updated;
			}else{
				throw 'Elemento '+JSON.stringify(q)+' no encontrado en base de datos';
			}
		});
	}

	run(generator) {
		var self = this;
		return new Promise(function(resolve, reject){
			co(generator())
			.then(function(r){
				resolve(r);
			})
			.catch(function(e){
				self.rollback();
				reject(e);
			});
		});
	}

	rollback() {
		console.log('ROLLBACK TRANSACTION');
		while(this._transacts.length > 0){
			var tr = this._transacts.pop();
			switch(tr.type){
			case 'insert':
				tr.doc.remove().then(function(r){

				}).catch(function(e){
					console.log('INSERT ROLLBACK ERROR', e)
				});
				break;

			case 'update':
				tr.Model.update(tr.query, { $set: tr.doc })
				.then(function(r){

				}).catch(function(e){
					console.log('UPDATE ROLLBACK ERROR', e)
				});;
			}
		}
	}

}
