<template>
  <div>
    <h5>科沃斯领航专卖店30天提升计划书</h5>
    <p class="span-color">
      您店铺
      <span>2018年3月</span>利润额为
      <span>13万元</span>，处于行业中等偏下。经过测算，利润可提升额为
      <span>53万元</span>，支出为
      <span>{{initSpendmore}}万元</span>，利润提升率
      <span>200%</span>，投入产出比
      <span>{{initRoi}}%</span>。
      达成此目标需涉及
      <span>{{initModelNum}}</span>大版块，几千项应对策略，为使操作更具可行性，我们为您选取优先级最高的
      <span>5</span>个版块：{{initItemsList}}，分别给出改进建议，约可达到测算利润的
      <span>76%</span>，详见下表：
    </p>
    <div class="table-p total-table" style="min-height:30px;box-shadow: none;padding-bottom:20px">
      <el-table :data="tableData" border style="width: 100%" @header-click="thClick">
        <el-table-column prop="a" label="模块"></el-table-column>
        <el-table-column v-for="(item,index) in itemsList" :key="index" :prop="item.prop" :label="item.name"></el-table-column>
        <el-table-column prop="g" label="综合"></el-table-column>
      </el-table>
    </div>
    <p class="tip">（说明：所有提升数据为测算值，实际结果会有波动）</p>
  </div>
</template>

<script>
import initActuary from "@/mixins/initActuary";
export default {
  mixins: [initActuary],
  data() {
    return {
      tableData: [
        {
          a: "投入（万元）",
          b: "0",
          c: "5",
          d: "5",
          e: "5",
          f: "5",
          g: "18"
        },
        {
          a: "产出（万元）",
          b: "5",
          c: "5",
          d: "5",
          e: "5",
          f: "5",
          g: "16"
        },
        {
          a: "ROI",
          b: "341%",
          c: "120%",
          d: "180%",
          e: "188%",
          f: "269%",
          g: "250%"
        }
      ]
    };
  },
  methods: {
    thClick({ id }) {
      console.log(id)
      this.$emit(
        "flow-block",
        Number(id.split("_")[id.split("_").length - 1]) - 1
      );
    }
  }
};
</script>