"use strict";
import _app from './config.js';
const statusObj = {
	getMore: {
		text: '获取更多',
		code: 1
	},
	noMore: {
		text: '没有更多了',
		code: 2
	},
	loading: {
		text: '数据加载中',
		code: 3
	},
	noData: {
		text: '暂无数据',
		code: 4
	},
	errFail: {
		text: '数据错误',
		code: 5
	},
	errCatch: {
		text: '加载数据失败, 点击重试',
		code: 6
	}
}
function doPageDemand(obj) {	//分页加载获取数据方法, 页面使用call绑定this使用
	_app.log('进入getAndSetPageData方法');
	let _this = this;
	let {
		getDataFn,	//获取数据的方法
		success, //接口访问成功回调
		successEnd, //成功回调结束时
		fail,	//接口访问失败回调
		
		sendDataName,	//携带数据字段名称
		
		setName,	//页面中列表数据字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
		statusTextName,	//页面中列表状态字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
		waitingName,	//页面中获取数据等待字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
		
		refresh,	//刷新标识, 若为true则会将携带数据中的页数重置为1
		force,	//强制标识, 若为true则会忽略等待标识为true时的跳过操作
		doEvent,	//进入状态判断标识, 若为true则会进入判断列表status而进行相应操作
		
		noDataText,	//访问接口后若数据长度为0则可自定义为空时文字
		refreshClear	//刷新时是否清空数据
	} = obj;
	waitingName = waitingName || 'getting';
	if (_this[waitingName] && !force) return; //节流
	if (doEvent) {	//判断列表状态
		if(_this[statusTextName].code !== undefined) {
			switch (_this[statusTextName].code) {
				case 1:
					break;
				case 6:
					break;
				default:
					return;
					break;
			}
		}
	} 
	
	//初始化默认值
	sendDataName = sendDataName || 'sendData';
	setName = setName || 'list';
	statusTextName = statusTextName || 'statusText';

	
	if (refresh) {	//刷新, 重置为第一页
		
		if(refreshClear) {	//刷新是否清空数据
			_this[setName] = [];
		}
	}
	
	//浅拷贝携带数据对象
	const sendData = { ..._this[sendDataName]
	};
	_app.log('sendData: ' + JSON.stringify(sendData));
	_app.log('subTypeId: ' + sendData.sub_type_id);
	
	let status;	//声明 列表状态变量
	// 改变状态为 访问接口中
	_this[statusTextName] = getStatus('loading');
	// 等待标识
	_this[waitingName] = true;
	_app.log('准备访问接口:' + JSON.stringify(sendData));
	// 访问接口    ->getTabList
	getDataFn({ ...sendData
	}).then(res => {
		if(success && typeof success == 'function') success(res);
		_app.log('page.js获取数据成功:' + JSON.stringify(res));
		
		if(res.size !== 0){
			const newLists = res.list;
			//根据动作赋值
			if(refresh == undefined){
				//第一次获取
				_app.log("第一次获取");
				_this[setName] = newLists;
			}else if(refresh){
				_app.log("下拉刷新");
				_this[setName] = newLists.concat(_this[setName]);
			}else if(!refresh){
				_app.log("上拉加载");
				_this[setName] = _this[setName].concat(newLists);
			};
			status = getStatus('getMore');
		}else{
			//暂无数据
			status = getStatus('noData', noDataText||'');
			_app.log("暂无数据");
		}
		
		_this[statusTextName] = status;
		// 重置等待标识
		_this[waitingName] = false;
		if(successEnd && typeof successEnd == 'function') successEnd(res);
	}).catch(err => {
		_app.log('pageJS异常:' + JSON.stringify(err));
		// 获取数据异常,可点击重新加载
		_this[statusTextName] = { ...statusObj.errCatch
		};
		console.log(_this[statusTextName])
		// 重置等待标识
		_this[waitingName] = false;
		if (fail && typeof fail === 'function') fail(err);
	})
}

function getStatus(type, text) {
	const obj = {...statusObj[type]};
	obj.text = text||obj.text||'';
	return obj;
}

function getField(data, fields, pattern) { //递归获取指定字段数据
  if (!fields) return data;
	var arr = fields.split('.');
	var key = arr.shift();
	var value = data[key];

	if(value==null){
		return value;
	}else if(arr.length==0){
		if(!pattern)return value;
		var type = Object.prototype.toString.call(value).replace('[object ','').replace(']','');
		if(pattern===true){
			return type;
		}else if(!pattern){
			return value;
		}else{
			return type==pattern;
		}
	}

	var result = getField(value,arr.join('.'),pattern);
	return result;
}

module.exports = {
	doPageDemand
}
