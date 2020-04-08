import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isLogin: false,
		userId: 0,
		userInfo: {},
		userPermission: {},
		
		isAndroid: false,
		statusBarHeight: "height:0px",
		
		registerCountdown: 60,
		registerCountdownText: '',
		registerTimer: null,
		registerGetBtDisabled: false,
		registerUserAccount:'',
		registerUserPassword:'',
		
		

	},
	mutations: {
		
		changePlatform(state, statusBarHeight){
			state.isAndroid = true;
			state.statusBarHeight = statusBarHeight;
		},
		initUserState(state, userState){
			state.isLogin = userState.isLogin;
			state.userId = userState.userId == 'undefined'?0:userState.userId;
			state.userInfo = userState.userInfo == 'undefined'?{}:userState.userInfo;
			state.userPermission = userState.userPermission == 'undefined'?{}:userState.userPermission;
		},
		changeRegisterState(state, registerState){
			state.registerCountdown = registerState.countdown;
			state.registerCountdownText= registerState.countdownText;
			state.registerTimer = registerState.timer;
			state.registerGetBtDisabled = registerState.getBtDisabled;
		},
		registerToLogin(state, registerInfo){
			state.registerUserAccount = registerInfo.account;
			state.registerUserPassword = registerInfo.password;
		},
		changeUserInfo(state, userInfo){
			state.userInfo = userInfo;
		}
		
	}
})

export default store
