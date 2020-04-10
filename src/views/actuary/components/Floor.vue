<template>
  <div class="floor">
    <ul>
      <li
        v-for="(item,index) in itemsList"
        :key="index"
        @click="flow(index+1)"
        :class="{'active':item.active}"
      >
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </li>
      <li class="to-top" @click="flow('6')" v-if="isTopShow">
        <i class="el-icon-arrow-up"></i>
        <span>顶部</span>
      </li>
    </ul>
  </div>
</template>

<script>
import initActuary from "@/mixins/initActuary";
export default {
  mixins: [initActuary],
  data() {
    return {
      isTopShow: false
    };
  },

  methods: {
    flow(key) {
      this.$emit("flow-block", key);
    },
    switchActive({ val, top }) {
      this.isTopShow = top > 500;
      for (let i = 0; i < this.itemsList.length; i++) {
        this.itemsList[i].active = i === Number(val) - 1;
      }
    }
  }
};
</script>