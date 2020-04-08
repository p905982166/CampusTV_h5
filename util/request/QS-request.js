import _app from '@/util/request/app.js';
import interfaces from '@/util/request/interfaces.js';
import { mock } from './mock.js';

export function QSRequest({
	urlField,
	sendData,
	checkType,
	field,
	check,
	filterFn,
	hasLoading
} = {}) {
	return new Promise((resolve, reject) => {
		if (hasLoading) _app.showLoading('请稍候');
		const hasFilterFn = _app.isFn(filterFn);
		console.log('hasFilterFn ' + hasFilterFn)
		const url = getField(interfaces, urlField);
		console.log('urlField ' + urlField)
		console.log('url ' + url)
		//为了便于示例
		let fn;
		if(!mock) {
			fn = mock;
		}else{
			fn = request;
		}
		_app.log('准备访问接口:' + JSON.stringify(sendData));
		
		
		fn({
			url,
			data: sendData,
			contentType:'json',
			method:'GET',
		}).then(res => {
			_app.log('访问接口成功:' + JSON.stringify(res));
			if (hasLoading) _app.hideLoading();
			let checkResult = true;
			if (check !== false) {
				checkResult = checkRes({
					res,
					type: checkType
				})
			}
			if (checkResult) {
				
				//const data = getField(res, field);
				const data = res.page
				_app.log("data");
				_app.log(data);
				//resolve(hasFilterFn ? filterFn(data) : data);
				resolve(data);
			} else {
				_app.log('reject ' + data);
				reject(res);
			}
		}).catch(err => {
			if (hasLoading) _app.hideLoading();
			reject(err);
		})
	})
}

function checkRes(obj) {	//对于返回数据的健壮性判断
		let {
			res,
			type
		} = obj;
		console.log(res);
		//console.log("type: " + type);
		if (!res) return false;
		type = type !== undefined ? type : 'msgAndCode';
		//console.log("type: " + type);
		switch (type) {
			case 'msgAndCode':
				if (res) {
					console.log(res.msg === 'success' && res.state === '200');
					return (res.msg === 'success' && res.state === '200');
					
				} else {
					return false;
				}
				break;
			default:
				return false;
				break;
		}
	}

export function getField(data, fields, pattern) { //字符串.获取指定字段数据
	console.log("fields");
	console.log(fields);  // page
	if (!fields) return data;
	var arr = fields.split('.');
	var key = arr.shift();
	var value = data[key];

	
	if (value == null) {
		return value;
	} else if (arr.length == 0) {
		if (!pattern) return value;
		var type = Object.prototype.toString.call(value).replace('[object ', '').replace(']', '');
		if (pattern === true) {
			return type;
		} else if (!pattern) {
			return value;
		} else {
			return type == pattern;
		}
	}

	var result = getField(value, arr.join('.'), pattern);
	return result;
}

function request(obj) {
	let _this = this;
	return new Promise((resolve, reject) => {
		try {
			const config = {
				header: {}
			};
			if (obj.contentType === 'json') {
				config.header['Content-type'] = 'application/json'
			} else {
				config.header['Content-type'] = 'application/x-www-form-urlencoded'
			}
			if (!obj.method) {
				obj.method = 'POST'
			}
			_app.log(
				`访问接口 url: ${obj.url}, data: ${JSON.stringify(obj.data)}, method: ${obj.method}, header: ${JSON.stringify(config.header)}`
			);
			uni.request({
				...obj,
				...config,
				success(res) {
					console.log("QS-request 125 " + res.data)
					if (res.statusCode === 200) {
						console.log("QS-request 130 " + res.data)
						resolve(res.data);
					}else{
						console.log("QS-request 133" + res.data)
						reject(res);
					}
				},
				fail(err) {
					console.log("QS-request 133 " + res.data)
					reject(err)
				}
			});
		} catch (e) {
			//TODO handle the exception
			reject(e)
		}
	})
}
