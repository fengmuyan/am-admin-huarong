<template>
  <div class="app-container actuary">
    <div class="block" id="floor8" style="min-height:260px">
      <div class="promote">
        <el-row>
          <el-col :span="6">
            <div class="grade">
              <div class="title">当前评分</div>
              <div class="number">63分</div>
            </div>
          </el-col>
          <el-col :span="7">
            <el-button @click="promote" class="promote-btn">一键提升</el-button>
          </el-col>
          <el-col :span="6">
            <Radar :chartData="{title:''}" />
          </el-col>
          <el-col :span="5">
            <dl>
              <dt>评分一览</dt>
              <dd>产品：5分</dd>
              <dd>客服：8分</dd>
              <dd>设计：14分</dd>
              <dd>仓储：16分</dd>
              <dd>运营：20分</dd>
            </dl>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="block" id="floor7" v-if="!isShow" v-loading="loading"></div>
    <div v-loading="loading" v-else>
      <div class="block" id="floor6">
        <shop-case @flow-block="flowBlock" />
      </div>
      <div class="block" id="floor0">
        <h4>
          <i class="el-icon-data-analysis"></i>
          <span>总方案</span>
          <el-button size="mini" icon="el-icon-download" style="float:right">下载方案</el-button>
        </h4>
        <total-promote @flow-block="flowBlock" />
      </div>
      <div v-for="(item,index) in itemsList" :key="index" class="block" :id="`floor${index+1}`">
        <h4>
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </h4>
        <div v-if="index === 4">
          <h5>30天{{item.name}}提升方案</h5>
          <p class="span-color" style="margin-bottom:25px">
            {{item.name}}方案我们分为
            <span>5</span>个版块：流量、转化、销量、客单、客单价，分别给出改进建议，预计总支出为
            <span>12万元</span>，总收益为
            <span>38万元</span>，ROI为
            <span>231%</span>，柱形图为各模块预期收益（万元），下方表格为各模块提升详解，详见下图：
          </p>
          <el-row>
            <Column :chartData="{title:''}" />
          </el-row>
          <flow-promote />
          <switch-promote />
          <sale-num-promote />
          <guest-promote />
          <guest-price-promote />
        </div>
      </div>
      <floor @flow-block="flowBlock" ref="floor" />
    </div>
  </div>
</template>

<script>
import Radar from "../components/Radar";
import Column from "../components/Column";
import Pie from "../components/Pie";
import ShopCase from "../components/ShopCase";
import TotalPromote from "../components/TotalPromote";
import FlowPromote from "../components/FlowPromote";
import SwitchPromote from "../components/SwitchPromote";

import SaleNumPromote from "../components/SaleNumPromote";
import GuestPromote from "../components/GuestPromote";
import GuestPricePromote from "../components/GuestPricePromote";

import Floor from "../components/Floor";
import { scrollTo } from "@/utils/scroll-to";
import { getOperationInfos } from "@/api/actuary";
import initActuary from "@/mixins/initActuary";

export default {
  name: "actuary-detail",
  mixins: [initActuary],
  components: {
    Radar,
    Column,
    Pie,
    ShopCase,
    TotalPromote,
    FlowPromote,
    SwitchPromote,
    SaleNumPromote,
    GuestPromote,
    GuestPricePromote,
    Floor
  },
  data() {
    return {
      fnScroll: () => {},
      loading: false,
      shopGid: undefined,
      isShow: false
    };
  },
  created() {
    this.fnScroll = this.fnThrottle(this.scrollHander, 100);
    this.shopGid = this.$route.params.code;
  },
  mounted() {
    window.addEventListener("scroll", this.fnScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.fnScroll);
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const { code, data } = await getOperationInfos({
          shopGid: this.shopGid
        });
        this.loading = false;
        if (code === 200) {
          this.$store
            .dispatch("getDetailInfo", data)
            .then(() => {
              this.isShow = true;
            })
            .catch(() => {});
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    flowBlock(val) {
      console.log(val);
      const anchor = this.$el.querySelector(`#floor${val}`);
      scrollTo(Number(anchor.offsetTop) - 108, 800);
    },
    scrollHander() {
      const top =
        document.body.scrollTop ||
        document.documentElement.scrollTop ||
        window.pageXOffset;
      if (top > this.$el.querySelector("#floor5").offsetTop - 160) {
        this.$refs.floor.switchActive({ val: "5", top });
      } else if (top > this.$el.querySelector("#floor4").offsetTop - 160) {
        this.$refs.floor.switchActive({ val: "4", top });
      } else if (top > this.$el.querySelector("#floor3").offsetTop - 160) {
        this.$refs.floor.switchActive({ val: "3", top });
      } else if (top > this.$el.querySelector("#floor2").offsetTop - 160) {
        this.$refs.floor.switchActive({ val: "2", top });
      } else if (top > this.$el.querySelector("#floor1").offsetTop - 160) {
        this.$refs.floor.switchActive({ val: "1", top });
      } else {
        this.$refs.floor.switchActive({ val: "0", top });
      }
    },
    fnThrottle(fn, delay, atleast) {
      let timer = null;
      let previous = null;
      return function() {
        let now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
          fn();
          previous = now;
          clearTimeout(timer);
        } else {
          clearTimeout(timer);
          timer = setTimeout(function() {
            fn();
            previous = null;
          }, delay);
        }
      };
    },
    promote() {
      this.getDetail();
    }
  }
};
</script>