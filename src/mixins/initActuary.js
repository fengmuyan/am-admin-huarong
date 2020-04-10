import { mapGetters } from "vuex";

const mixin = {
  computed: {
    ...mapGetters(["detailinfo", "itemsList"]),
    initSpendmore() {
      return this.detailinfo.exeLingoOptimalModelResp.spendmore;
    },
    initRoi() {
      return this.detailinfo.exeLingoOptimalModelResp.roi;
    },
    initItemsList(){
      return this.itemsList.map(item=>item.name).join('、')
    },
    initModelNum(){
      return this.detailinfo.exeLingoShopDataResp.totalrs
    }
  },
}

export default mixin