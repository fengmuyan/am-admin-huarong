<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="批次名称" prop="batchName">
            <el-input
              v-model="queryForm.batchName"
              placeholder="请输入批次名称"
              clearable
              size="small"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="导入时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 260px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">导入数据</el-button>
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
      <el-table style="width: 100%" v-loading="loading" :data="fileFlowList">
        <el-table-column label="批次编号" prop="order" width="100px" />
        <el-table-column label="批次名称" prop="batchName" />
        <el-table-column label="数据条数" prop="flowCardNums" />
        <el-table-column label="执行次数" prop="operationNums" />
        <el-table-column label="导入时间" prop="createtime" width="150px" />
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              :disabled="Boolean(exeState)"
              v-if="Number(scope.row.operationNums)===0"
              @click="handleCompute(scope.row)"
            >计算</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              :disabled="Boolean(exeState)"
              v-if="Number(scope.row.operationNums)>0"
              @click="handleCompute(scope.row)"
            >重新计算</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              :disabled="(exeState === scope.row.batchName) || Number(scope.row.operationNums)===0"
              @click="handleResult(scope.row)"
            >查看结果</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              :disabled="exeState === scope.row.batchName"
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

    <el-dialog
      class="flow-dialog"
      :title="titleFlow"
      :visible.sync="openFlow"
      @close="clearValidateFlow"
      width="950px"
    >
      <div v-if="isShowFlow" v-loading="loadingFlow" style="text-align: center;" class="model">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="valueFlow"
          filterable
          :left-default-checked="[]"
          :right-default-checked="[]"
          :titles="['所有套餐', '使用套餐']"
          :button-texts="['到左边', '到右边']"
          :props="{key:'gid',label:'mealName'}"
          :render-content="renderFunc"
          filter-placeholder="请输入套餐名称"
          :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
          @change="handleChange"
          :data="flowList"
        >
          <el-button
            class="transfer-footer"
            slot="left-footer"
            size="small"
            @click="getFlowList"
          >刷新数据</el-button>
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openFlow = false">取 消</el-button>
        <el-button :loading="loadingFlowOperate" type="primary" @click="operateModel">调用模型</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="titleUpload"
      :visible.sync="openUpload"
      @close="clearValidateUpload"
      width="620px"
    >
      <el-form
        ref="formUpload"
        :model="formUpload"
        :rules="formUploadRules"
        :inline="true"
        label-width="110px"
      >
        <el-form-item label="批次名称" prop="batchName">
          <el-input
            v-model="formUpload.batchName"
            maxlength="30"
            style="width:350px"
            placeholder="请输入本批次名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据导入" prop="file" ref="uploadElement" v-if="fileShow">
          <upload-file
            @add-item="addItemFir"
            @del-item="delItemFir"
            ref="fileItemOne"
            v-model="formUpload.file"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openUpload = false">取 消</el-button>
        <el-button :loading="loadingUpload" type="primary" @click="submitForm('formUpload')">导入数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSetMealListAll,
  handelOperateModel,
  getFileFlowList,
  handelUploadFlow,
  handelDelFileFlow
} from "@/api/card";
import minHeightMix from "@/mixins/minHeight";
import UploadFile from "../components/UploadFile";
export default {
  mixins: [minHeightMix],
  components: {
    UploadFile
  },
  data() {
    return {
      loading: false,
      formShow: true,
      fileFlowList: [],
      dateRange: [],
      exeState: undefined,
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        batchName: ""
      },
      openFlow: false,
      titleFlow: "调用模型计算",
      isShowFlow: false,
      loadingFlow: false,
      loadingFlowOperate: false,
      flowList: [],
      valueFlow: [],
      flowId: undefined,
      flowSize: undefined,
      renderFunc(h, option) {
        return (
          <span>
            <b>{option.mealName}</b>
          </span>
        );
      },
      openUpload: false,
      fileShow: true,
      titleUpload: "上传数据",
      loadingUpload: false,
      formUpload: { batchName: undefined, file: undefined },
      formUploadRules: {
        batchName: [
          { required: true, message: "批次名称不能为空", trigger: "blur" }
        ],
        file: [{ required: true, message: "数据文件不能为空", trigger: "blur" }]
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
        const { _initParams, queryForm } = this;
        const {
          code,
          data: {
            batchName,
            pageInfo: { content, totalSize }
          }
        } = await getFileFlowList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.fileFlowList = content.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
          this.total = totalSize;
          this.exeState = batchName;
          if (this.exeState) {
            this.$confirm(
              ` [ ${this.exeState} ] 正在计算中，耐心等候！`,
              "系统提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "el-message-box-wran"
              }
            )
              .then(async () => {})
              .catch(err => {});
          }
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    async getFlowList() {
      try {
        this.loadingFlow = true;
        this.isShowFlow = false;
        const { data, code } = await getSetMealListAll();
        this.loadingFlow = false;
        if (code === 200) {
          this.flowList = data;
          this.isShowFlow = true;
        }
      } catch (err) {
        this.loadingFlow = false;
        console.log(err);
      }
    },
    handleChange(value, direction, movedKeys) {},
    async operateModel() {
      if (this.valueFlow.length < 2) {
        this.$confirm("至少选择两个套餐。", "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        });
      } else {
        try {
          this.loadingFlowOperate = true;
          const { code } = await handelOperateModel({
            gid: this.flowId,
            flowMealGids: this.valueFlow.join(",")
          });
          if (code === 200) {
            this.msgSuccess("操作成功");
            this.openFlow = false;
            this.loading = true;
            let time = 0;
            if (Number(this.flowSize) > 400000) {
              time = 6500;
            } else if (Number(this.flowSize) > 250000) {
              time = 4500;
            } else if (Number(this.flowSize) > 90000) {
              time = 2500;
            } else if (Number(this.flowSize) > 25000) {
              time = 1500;
            } else if (Number(this.flowSize) > 5000) {
              time = 800;
            } else {
              time = 300;
            }
            setTimeout(this.getList, time);
          }
          this.loadingFlowOperate = false;
        } catch (err) {
          this.loadingFlowOperate = false;
          console.log(err);
        }
      }
    },
    clearValidateFlow() {
      this.flowId = undefined;
      this.flowList = [];
      this.valueFlow = [];
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    resetUploadForm() {
      Object.assign(this.formUpload, {
        batchName: undefined,
        file: null
      });
    },
    async handleAdd() {
      this.fileShow = false;
      this.resetUploadForm();
      await this.$nextTick();
      this.openUpload = true;
      this.fileShow = true;
    },
    clearValidateUpload() {
      this.$refs.formUpload.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("batchName", this.formUpload.batchName);
          formData.append("file", this.$refs.fileItemOne.fileList[0]);
          try {
            this.loadingUpload = true;
            const { code } = await handelUploadFlow(formData);
            this.loadingUpload = false;
            this.openUpload = false;
            if (code === 200) {
              this.msgSuccess("操作成功");
              this.getList();
            }
          } catch (err) {
            this.loadingUpload = false;
            console.log(err);
          }
        } else {
          this.loadingFile = false;
          return false;
        }
      });
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
            const { code } = await handelDelFileFlow({ gid: item.gid });
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
    handleCompute(item) {
      this.openFlow = true;
      this.flowId = item.gid;
      this.flowSize = item.flowCardNums;
      this.getFlowList();
    },
    handleResult(item) {
      this.$router.push({
        path: `/flow-card/result/${item.gid}`
      });
    },
    addItemFir(val) {
      this.formUpload.file = val[0];
      this.$refs["uploadElement"].clearValidate();
    },
    delItemFir(val) {
      this.formUpload.file = null;
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        beginDate: dateRange.length > 0 ? dateRange[0] : undefined,
        endDate: dateRange.length > 0 ? dateRange[1] : undefined
      });
      return obj;
    }
  }
};
</script>