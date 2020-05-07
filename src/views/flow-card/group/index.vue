<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="90px">
          <el-form-item label="套餐组名称" prop="mealGroupName">
            <el-input
              v-model="queryForm.mealGroupName"
              placeholder="请输入套餐组名称"
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
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增套餐组</el-button>
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
      <el-table style="width: 100%" v-loading="loading" :data="mealList">
        <el-table-column label="序号" prop="order" width="100px" show-overflow-tooltip />
        <el-table-column label="套餐组名称" prop="mealGroupName" />
        <el-table-column label="创建人" prop="createBy" />
        <el-table-column label="创建时间" prop="createtime" width="150px" />
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
            >查看</el-button>
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

    <!-- 添加或修改套餐组 -->
    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="850px">
      <div v-loading="loadingGroupContent" style="min-height:400px">
        <el-form :model="form" ref="form" :rules="rules" label-width="100px">
          <el-form-item label="套餐组名称" prop="mealGroupName">
            <el-input
              v-model="form.mealGroupName"
              placeholder="请输入套餐组名称"
              clearable
              style="width: 220px"
            />
          </el-form-item>
        </el-form>
        <div class="table-p" style="padding:0;min-height:500px;">
          <el-table
            ref="multipleTable"
            :data="flowCardList"
            tooltip-effect="dark"
            style="width: 100%"
            height="500"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" v-if="form.gid === undefined"></el-table-column>
            <el-table-column label="序号" prop="order" width="80" />
            <el-table-column
              label="套餐名称"
              prop="mealName"
              sortable
              width="300"
              show-overflow-tooltip
            />
            <el-table-column label="流量（MB）" prop="mealFlow" sortable />
            <el-table-column label="价格（元）" prop="mealAmount" sortable />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="套餐组明细" :visible.sync="openDetail" @close="clearValidateDetail" width="850px">
      <div v-loading="loadingGroupContent" style="min-height:400px">
        <div class="table-p" style="padding:0;min-height:500px;">
          <el-table
            :data="flowCardListDetail"
            tooltip-effect="dark"
            style="width: 100%"
            height="500"
          >
            <el-table-column label="序号" prop="order" width="80" />
            <el-table-column
              label="套餐名称"
              prop="mealName"
              sortable
              width="300"
              show-overflow-tooltip
            />
            <el-table-column label="流量（MB）" prop="mealFlow" sortable />
            <el-table-column label="价格（元）" prop="mealAmount" sortable />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDetail = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCardGroupList,
  getFlowCardList,
  handelAddCardGroup,
  handelDelCardGroup,
  getCardGroupDetail
} from "@/api/card";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      loadingForm: false,
      mealList: [],
      flowCardList: [],
      flowCardListDetail: [],
      multipleSelection: [],
      total: 0,
      title: "新增套餐组",
      open: false,
      openDetail: false,
      loadingGroupContent: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        mealGroupName: undefined
      },
      form: {
        gid: undefined,
        mealGroupName: undefined
      },
      rules: {
        mealGroupName: [
          { required: true, message: "请输入套餐组名称", trigger: "blur" }
        ]
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
        const {
          code,
          data: { content, totalSize }
        } = await getCardGroupList(this.queryForm);
        this.loading = false;
        if (code === 200) {
          this.mealList = content.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
          this.total = totalSize;
        }
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
    resetMealForm() {
      Object.assign(this.form, {
        gid: undefined,
        mealGroupName: undefined
      });
    },
    async handleAdd() {
      this.resetMealForm();
      this.title = "新增套餐组";
      this.open = true;
      try {
        this.loadingGroupContent = true;
        const { code, data } = await getFlowCardList();
        this.loadingGroupContent = false;
        if (code === 200) {
          this.flowCardList = data.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
        }
      } catch (err) {
        this.loadingGroupContent = false;
        console.log(err);
      }
    },
    async handleEdit(item) {
      this.resetMealForm();
      this.title = "修改套餐组";
      this.open = true;
      Object.assign(this.form, {
        gid: item.gid,
        mealGroupName: item.mealGroupName
      });
      try {
        this.loadingGroupContent = true;
        const { code, data } = await getFlowCardList({ gid: item.gid });
        this.loadingGroupContent = false;
        if (code === 200) {
          this.flowCardList = data.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
        }
      } catch (err) {
        this.loadingGroupContent = false;
        console.log(err);
      }
    },
    submitForm(formName) {
      if (this.multipleSelection.length > 1 || this.form.gid !== undefined) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            try {
              this.loadingForm = true;
              const { code } = await handelAddCardGroup(
                Object.assign(this.form, {
                  mealGids: this.multipleSelection
                    .map(item => item.mealGid)
                    .join(",")
                })
              );
              this.loadingForm = false;
              this.open = false;
              if (code === 200) {
                this.msgSuccess("操作成功");
                this.getList();
              }
            } catch (err) {
              this.loadingForm = false;
              console.log(err);
            }
          } else {
            return false;
          }
        });
      } else {
        this.$confirm("最少选择两个套餐！", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    clearValidate() {
      this.flowCardList = [];
      this.multipleSelection = [];
      this.$refs.form.resetFields();
    },
    clearValidateDetail() {
      this.flowCardListDetail = [];
    },
    handleDel(item) {
      this.$confirm(`确定要删除 ${item.mealGroupName} 吗？`, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          try {
            const { code } = await handelDelCardGroup({ gid: item.gid });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(err => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async handleDetail(item) {
      this.openDetail = true;
      try {
        this.loadingGroupContent = true;
        const { code, data } = await getCardGroupDetail({ gid: item.gid });
        this.loadingGroupContent = false;
        if (code === 200) {
          this.flowCardListDetail = data.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
        }
      } catch (err) {
        this.loadingGroupContent = false;
        console.log(err);
      }
    }
  }
};
</script>