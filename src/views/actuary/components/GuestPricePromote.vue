<template>
  <div class="table-p" style="min-height:30px;box-shadow: none;padding-bottom:20px">
    <p class="table-title">
      <span>客单价提升详解：</span>
    </p>
    <el-table :data="tableData" border style="width: 100%" :span-method="objectSpanMethod">
      <el-table-column prop="a" label="项目"></el-table-column>
      <el-table-column prop="b" label="执行点"></el-table-column>
      <el-table-column prop="c" label="应对方案" width="400"></el-table-column>
      <el-table-column prop="d" label="操作周期" width="100"></el-table-column>
      <el-table-column prop="e" label="利润提升额" width="250"></el-table-column>
      <el-table-column prop="f" label="利润（万元）" width="120"></el-table-column>
      <el-table-column prop="g" label="投入费用（万元）" width="120"></el-table-column>
      <el-table-column prop="h" label="销售额（万元）" width="120"></el-table-column>
      <el-table-column prop="i" label="ROI"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          a: "免费流量",
          b: "搜索流量",
          c: "最优销量排名第18名最优销量排名第18名",
          d: "1个月",
          e: "每提升1个单位，利润提升23元",
          f: "12.1",
          g: "27.69",
          h: "35.98",
          i: "129%"
        },
        {
          a: "免费流量",
          b: "手淘营销",
          c: "内容营销投放：头条评测、必买清单",
          d: "1个月",
          e: "每提升1个单位，利润提升23元"
        },
        {
          a: "免费流量",
          b: "其他",
          c: "/",
          d: "1个月",
          e: "每提升1个单位，利润提升23元"
        },
        {
          a: "付费流量",
          b: "钻展",
          c: "定向：品类？、地域？、人群？",
          d: "1个月",
          e: "每提升1个单位，利润提升23元"
        },
        {
          a: "付费流量",
          b: "直通车",
          c: "关键词：燃气灶双灶、燃气灶嵌入式",
          d: "1个月",
          e: "每提升1个单位，利润提升23元"
        },
        {
          a: "付费流量",
          b: "渠道活动",
          c: "活动：淘抢购",
          d: "1个月",
          e: "每提升1个单位，利润提升23元"
        },
        {
          a: "其他流量",
          b: "直通车",
          c: "燃气热水器",
          d: "1个月",
          e: "每提升1个单位，利润提升23元"
        }
      ]
    };
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex === 7 ||
        columnIndex === 8
      ) {
        if (rowIndex % 7 === 0) {
          return {
            rowspan: 7,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>