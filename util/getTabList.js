import { QSRequest } from '@/util/request/QS-request.js';
function getTabList(data, pageType, userId) {
	
	if(pageType === 1){
		//从首页进来
		console.log('调用获取首页新闻api')
		return QSRequest({
			urlField: 'newsList.getInitNews',
			sendData: data,
			field: 'page',
			filterFn: filterTabList
		});
	}else if(pageType === 2){
		if(data.type_id === 1){
			//浏览历史
			
			return new Promise((resolve, reject) => {
				//从storage里面拿数据
				let list = uni.getStorageSync("browserHistory");
				
				let tempList = [];
				for (var i = 0; i < list.length; i++) {
					if(list[i].userId === userId){
						tempList = list[i].list;
						break;
					}
				}
				let size = tempList===undefined?0:tempList.length;
				let res = {tag: 1, size: size, list: tempList}
				resolve(res);
				
			})
			
			
		}
		//从我的新闻进来
		console.log('调用我的新闻api')
		return QSRequest({
			urlField: 'myNewsList.getMyNews',
			sendData: data,
			field: 'page',
			filterFn: filterTabList
		});
	}
	
}

function filterTabList(page) {	//过滤数据
	console.log("page");
	console.log(page);
	if(page != null){
		console.log(111111111);
		const list = page.list;
		for(let i = 0; i < list.length; i++) {
			let item = list[i];
			
			item += (' 过滤');
			
			list[i] = item;
		}
		page.list = list;
		
	}else{
		console.log(22222222222);
		page = {"size":10,"lastPage":1,"list":["tab_0 0项 过滤","tab_0 1项 过滤","tab_0 2项 过滤","tab_0 3项 过滤","tab_0 4项 过滤","tab_0 5项 过滤","tab_0 6项 过滤","tab_0 7项 过滤","tab_0 8项 过滤","tab_0 9项 过滤"]};
		
	}
	console.log("page " + page);
	return page;
}

module.exports = {
	getTabList
}