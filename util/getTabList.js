import { QSRequest } from '@/util/request/QS-request.js';
function getTabList(data) {
	console.log(1221312312)
	return QSRequest({
		urlField: 'newsList.getInitNews',
		sendData: data,
		field: 'page',
		filterFn: filterTabList
	});
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