const actuary = {
  state: {
    detailinfo: null,
    itemsList: []
  },

  mutations: {
    SET_DETAIL_INFO: (state, data) => {
      state.detailinfo = data
    },
    SET_ITEMS_LIST: (state, data) => {
      state.itemsList = data
    },
  },

  actions: {
    // 获取方案详情
    getDetailInfo({ commit }, data) {
      commit('SET_DETAIL_INFO', data);
      const { operateIndex, designIndex, productIndex, customerServiceIndex, storageIndex } = data.exeLingoOriginalModelResp;
      const compare = function (property) {
        return function (a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        }
      }
      const itemsData = [
        { name: "运营", max: 20, prop: "b", icon: "el-icon-data-line", active: false, storageIndex: operateIndex },
        { name: "设计", max: 20, prop: "c", icon: "el-icon-edit-outline", active: false, storageIndex: designIndex },
        { name: "产品", max: 20, prop: "d", icon: "el-icon-menu", active: false, storageIndex: productIndex },
        { name: "仓储", max: 20, prop: "e", icon: "el-icon-box", active: false, storageIndex: storageIndex },
        { name: "客服", max: 20, prop: "f", icon: "el-icon-headset", active: false, storageIndex: customerServiceIndex }
      ].sort(compare("storageIndex"))
      commit('SET_ITEMS_LIST', itemsData);
    },

    // 设置模块列表数据
    setItemsList({ commit }, data) {
      commit('SET_ITEMS_LIST', data);
    },
  }
}

export default actuary