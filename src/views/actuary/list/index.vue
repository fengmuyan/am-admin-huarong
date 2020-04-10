<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="店铺名称" prop="shopName">
            <el-input
              v-model="queryForm.shopName"
              placeholder="请输入店铺名称"
              clearable
              size="small"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加店铺</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="shopList">
        <el-table-column label="店铺编号" prop="order" width="100px" show-overflow-tooltip />
        <el-table-column label="店铺名称" prop="shopName" />
        <el-table-column label="店铺状态" prop="state">
          <template slot-scope="scope">
            <span
              :class="{'warn-color':scope.row.state===2,'suc-color':scope.row.state===1}"
            >{{scope.row.voState}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createtime" width="150px" />
        <el-table-column label="操作" width="500px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-data-analysis"
              v-if="scope.row.state===1"
              @click="handleDetail(scope.row)"
            >查看方案</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-place"
              v-if="scope.row.state===1"
              @click="handleEdit(scope.row)"
            >执行跟踪</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              v-if="scope.row.state !==3"
              @click="handleEdit(scope.row)"
            >合同详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-shopping-bag-1"
              v-if="scope.row.state===3"
              @click="handleEdit(scope.row)"
            >购买</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-shopping-bag-1"
              v-if="scope.row.state===2"
              @click="handleEdit(scope.row)"
            >再次购买</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      loadingForm: false,
      shopList: [
        {
          order: 1,
          shopName: "科沃斯领航专卖店",
          state: 1,
          voState: "已购买",
          createtime: "2020-03-31 20:13:22"
        },
        {
          order: 2,
          shopName: "模拟店铺03",
          state: 2,
          voState: "已过期",
          createtime: "2020-03-31 20:13:22"
        },
        {
          order: 3,
          shopName: "模拟店铺04",
          state: 3,
          voState: "未购买",
          createtime: "2020-03-31 20:13:22"
        }
      ],
      total: 4,
      open: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        shopName: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleStatusChange() {},
    handleAdd() {},
    handleDetail(){
      this.$router.push({
        path: `/actuary/detail/${10}`
      });
    }
  }
};
</script>