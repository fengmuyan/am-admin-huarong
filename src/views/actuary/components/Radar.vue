<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import initActuary from "@/mixins/initActuary";
export default {
  mixins: [resize, initActuary],
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
      default: "300px"
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
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions();
    },
    setOptions({ title } = {}) {
      this.chart.setOption({
        title: {
          text: ""
        },
        tooltip: {},
        legend: {
          data: [""]
        },
        radar: {
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#999",
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: "产品", max: 20 },
            { name: "客服", max: 20 },
            { name: "设计", max: 20 },
            { name: "仓储", max: 20 },
            { name: "运营", max: 20 }
          ]
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: [5, 8, 14, 16, 20],
                name: "评分一览"
              }
            ]
          }
        ]
      });
    }
  }
};
</script>
