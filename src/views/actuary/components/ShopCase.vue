<template>
  <div class="shop-case">
    <h5 class="shop-title">科沃斯领航专卖店利润提升解决方案</h5>
    <div class="shop-dec">
      通过对行业的数据分析，XX店铺在{{initItemsList}}等模块，存在
      <span>50%</span>的提升空间（对比行业TOP3店铺）。
      <br />本报告计划在一个月内，通过以上办款的优化，实现月利润额从
      <span>1222元</span>提升至
      <span>2555元</span>，支出为
      <span>{{initSpendmore}}万元</span>，投入产出比为
      <span>{{initRoi}}%</span>。
    </div>
    <div class="shop-total">
      <div class="title">时间段：一个月</div>
      <ul>
        <li>
          <i class="first-i">
            <i class="el-icon-s-marketing"></i>
          </i>
          <span>
            <b class="item-title">利润上升：15.5万</b>
            <b class="dec">指目标利润-上月利润</b>
          </span>
        </li>
        <li>
          <i class="first-i sec-i">
            <i class="el-icon-coin"></i>
          </i>
          <span>
            <b class="item-title">新增支出：{{initSpendmore}}万元</b>
            <b class="dec">指为达到目标利润，您需支出的费用（不包含商品成本）</b>
          </span>
        </li>
        <li>
          <i class="first-i thi-i">
            <i class="text-icon">ROI</i>
          </i>
          <span>
            <b class="item-title">ROI：{{initRoi}}%</b>
            <b class="dec">指（目标利润-初始利润）/支出*100%</b>
          </span>
          <b></b>
        </li>
      </ul>
    </div>
    <div class="shop-item">
      <div class="title">板块提升：</div>
      <ul>
        <li v-for="(item,index) in itemsList" :key="index" @click="flow(index+1)">
          <i class="i-wrap">
            <i :class="item.icon"></i>
          </i>
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import initActuary from "@/mixins/initActuary";
export default {
  mixins: [initActuary],
  methods: {
    flow(key) {
      this.$emit("flow-block", key);
    }
  }
};
</script>