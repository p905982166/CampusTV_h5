const STATUS = 1; //1-正式域名 2-测试域名
let baseUrl;
switch (STATUS){
	case 1:
		baseUrl = '/controller';	
		break;
	default:
		baseUrl = 'http://www.complicated.top:8888';	
		break;
}

var interfaces = {
	testUrlList: {
		testUrl: `${baseUrl}/sys_user/test`
	},
	newsList: {
		getInitNews: `${baseUrl}/news/getInitNews`
	},
	myNewsList: {
		getMyNews: `${baseUrl}/news/getMyNews`
	},
}

module.exports = interfaces;