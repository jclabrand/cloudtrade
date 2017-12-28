
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in license.txt

****************************************************************************************/

import fs from 'fs';
import path from 'path';
import co from 'co';

//import randomstring from 'randomstring';
import fileType from 'file-type';
import toArray from 'stream-to-array';

/****************************************************************************************/

module.exports = class File{
	constructor(dir, fileName, fullDir) {
		this._fileName = fileName;
		this._fileDir = fullDir ? dir : path.join(__dirname, dir);
		this._filePath = path.join(this._fileDir, this._fileName);

		console.log(this._filePath);
	}

	/*writeBuffer(buf) {
		var self = this;
		return new Promise(function(resolve, reject){
			try{
				if(fs.existsSync(self._fileDir)){
					var wstream = fs.createWriteStream(self._filePath);
					wstream.write(buf);
					wstream.end();

					resolve('Archivo "' + self._fileName + '" guardado correctamente');
				}else{
					reject('No existe el directorio "' + self._fileDir + '"');
				}
			}catch(ex){
				reject(ex);
			}
		});
	}*/

	static readToBuffer(dir, fname) {
		return co(function*(){
			let fileDir = path.join(__dirname, dir),
				filePath = path.join(fileDir, fname);

			if(fs.existsSync(filePath)){
				var strm = fs.createReadStream(filePath);
				return yield toArray(strm).then(function (parts){
					var buffers = [];
					for (var i = 0, l = parts.length; i < l ; ++i){
						var part = parts[i];
						buffers.push((part instanceof Buffer) ? part : new Buffer(part));
					}
					return Buffer.concat(buffers);
				});
			}else{
				throw 'No existe el archivo "' + self._fileName + '"';
			}
		});
	}



	static uploadMW(req, res, next) {
		if(req.files && req.files.file){
			var ftype = fileType(req.files.file.data);/*,
				fname =	randomstring.generate(32) + '_' +
						randomstring.generate(8) + '_' +
						randomstring.generate(32) + '.' + ftype.ext;

			req.files.file.uname = fname;*/
			req.files.file.type = ftype;
			/*req.files.file.save = function(dir){
				return new Promise((resolve, reject)=>{
					try{
						var fileDir = path.join(__dirname, dir),
							filePath = path.join(fileDir, this.uname);

						if(fs.existsSync(fileDir)){
							var wstream = fs.createWriteStream(filePath);
							wstream.write(this.data);
							wstream.end();

							resolve('Archivo "' + this.uname + '" guardado correctamente');
						}else{
							reject('No existe el directorio "' + fileDir + '"');
						}
					}catch(ex){
						reject(ex);
					}
				});
			}*/
		}
		next();
	}
}
