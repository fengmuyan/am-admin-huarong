<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import echartTheme from "@/utils/echart.js";
import resize from "./mixins/resize";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "340px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, echartTheme);
      this.setOptions();
    },
    setOptions({ title } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["免费流量", "付费流量", "其他流量"]
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["流量", "转化", "销量", "客单", "客单价"]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "收益（万元）"
          }
        ],
        /* series: [
          {
            data: [200, 160, 100, 80, 70, 40, 10],
            type: "bar"
          }
        ], */
        series: [
          {
            name: "数量",
            type: "bar",
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#29cf83",
                    "#fe562e",
                    "#ff8647",
                    "#6c68f0",
                    "#0186fe"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            },
            barWidth: "60%",
            data: [200, 160, 100, 80, 70, 40, 10]
          }
        ]
      });
    }
  }
};
</script>
