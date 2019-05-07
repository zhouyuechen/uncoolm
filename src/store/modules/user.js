const state = {   //要设置的全局访问的state对象


  is: false,
  userNow: null,
  provinceList: {
    11: '北京市', 43: '湖南省',
    12: '天津市', 44: '广东省',
    13: '河北省', 45: '广西壮族自治区',
    14: '山西省', 46: '海南省',
    15: '内蒙古自治区', 50: '重庆市',
    21: '辽宁省', 51: '四川省',
    22: '吉林省', 52: '贵州省',
    23: '黑龙江省', 53: '云南省',
    31: '上海市', 54: '西藏自治区',
    32: '江苏省', 61: '陕西省',
    33: '浙江省', 62: '甘肃省',
    34: '安徽省', 63: '青海省',
    35: '福建省', 64: '宁夏回族自治区',
    36: '江西省', 65: '新疆维吾尔自治区',
    37: '山东省', 71: '台湾省',
    41: '河南省', 81: '香港特别行政区',
    42: '湖北省', 82: '澳门特别行政区'
  },
  favList:[]

};
const getters = {   //实时监听state值的变化(最新状态)

  check(state) {
    return state.is
  },
  now(state) {
    return state.userNow
  },
  fav(state) {
    return state.favList
  },
};
const mutations = {
  login(state, data) {   //登录
    let str = `login/cellphone?phone=${data.account}&password=${data.pwd}`
    data.http.get(str).then((result) => {
      console.log(result)
      const {nickname, avatarUrl, province, city} = result.data.profile
      state.userNow = {
        id: result.data.account.id,
        nickname,
        avatarUrl,
        province:state.provinceList[province.toString().slice(0,2)],
        city
      };
      state.is = true;

      data.toast({
        message:"登录成功"
      })


    },(err)=>{
      console.log(err)
      data.toast({
        message:"登录失败，看看是不是账号密码错误了"
      })
    })
  },
  logout(state, data) {   //登出
    state.userNow = null;
    state.is = false;
    data.http.get('logout').then((res)=>{
      data.toast({
        message:"退出成功"
      })
    })
  },
  setFav(state, data) {   //设置喜欢列表
    state.favList=data.likeList
  },
  addFav(state, data) {   //添加列表中的项
    state.favList.push(data.mid)
    console.log(state.favList.length)
  },

};
const actions = {
  getLogin(context, data) {   //同上注释，num为要变化的形参
    context.commit('login', data)
  },
  getLogout(context, data) {   //同上注释，num为要变化的形参
    context.commit('logout', data)
  },
  getSetFav(context, data) {   //同上注释，num为要变化的形参
    context.commit('setFav', data)
  },
  getAddFav(context, data) {   //同上注释，num为要变化的形参
    context.commit('addFav', data)
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
