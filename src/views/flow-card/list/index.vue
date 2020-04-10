<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="套餐名称" prop="mealName">
            <el-input
              v-model="queryForm.mealName"
              placeholder="请输入套餐名称"
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
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增套餐</el-button>
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
        <el-table-column label="套餐编号" prop="order" width="100px" show-overflow-tooltip />
        <el-table-column label="套餐名称" prop="mealName" />
        <el-table-column label="流量（MB）" prop="mealFlow" />
        <el-table-column label="价格（元）" prop="mealAmount" />
        <el-table-column label="创建时间" prop="createtime" width="150px" />
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
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

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="550px">
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="110px">
        <el-form-item label="套餐名称" prop="mealName">
          <el-input
            v-model="form.mealName"
            style="width:320px"
            maxlength="30"
            placeholder="请输入套餐名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="套餐流量" prop="mealFlow">
          <el-input
            v-model="form.mealFlow"
            style="width:320px"
            maxlength="12"
            placeholder="请输入套餐流量"
          ></el-input>
        </el-form-item>
        <el-form-item label="套餐价格" prop="mealAmount">
          <el-input
            v-model="form.mealAmount"
            style="width:320px"
            maxlength="12"
            placeholder="请输入套餐价格"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSetMealList,
  handelEditSetMeal,
  handelDelSetMeal
} from "@/api/card";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const validatePrice = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback("套餐价格不能为空");
      } else {
        if (!/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value)) {
          callback(new Error("必须非负整数或至多保留两位小数！"));
        } else if (Number(value) > 99999999.99) {
          callback(new Error("套餐价格超出最大价格"));
        } else {
          callback();
        }
      }
    };
    const validateFlow = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback("套餐流量不能为空");
      } else {
        if (!/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value)) {
          callback(new Error("必须非负整数或至多保留两位小数！"));
        } else if (Number(value) > 999999999.999) {
          callback(new Error("流量超出最大流量"));
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      formShow: true,
      loadingForm: false,
      mealList: [],
      total: 0,
      title: "新增套餐",
      open: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        mealName: undefined
      },
      form: {
        gid: undefined,
        mealName: undefined,
        mealFlow: undefined,
        mealAmount: undefined
      },
      rules: {
        mealName: [
          { required: true, message: "请输入套餐名称", trigger: "blur" }
        ],
        mealAmount: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        mealFlow: [{ required: true, validator: validateFlow, trigger: "blur" }]
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
        } = await getSetMealList(this.queryForm);
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
        mealName: undefined,
        mealFlow: undefined,
        mealAmount: undefined
      });
    },
    async handleAdd() {
      this.resetMealForm();
      this.title = "新增套餐";
      await this.$nextTick();
      this.open = true;
    },
    async handleEdit(item) {
      this.resetMealForm();
      this.title = "修改套餐";
      Object.assign(this.form, {
        gid: item.gid,
        mealName: item.mealName,
        mealFlow: item.mealFlow,
        mealAmount: item.mealAmount
      });
      await this.$nextTick();
      this.open = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingForm = true;
            const { code } = await handelEditSetMeal(this.form);
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
    },
    cancel() {
      this.open = false;
    },
    clearValidate() {
      this.$refs.form.resetFields();
    },
    handleDel(item) {
      this.$confirm("确定要删除吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          try {
            const { code } = await handelDelSetMeal({ gid: item.gid });
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
    }
  }
};
</script>