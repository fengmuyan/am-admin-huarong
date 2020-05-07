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
        <el-table-column label="序号" prop="order" width="100px" />
        <el-table-column label="批次名称" prop="batchName" />
        <el-table-column label="文件名称" prop="originalFilename" />
        <el-table-column label="数据量" prop="flowCardNums" />
        <el-table-column label="导入时间" prop="createtime" width="150px" />
        <el-table-column label="虚量" prop="quantity" width="80px" />
        <el-table-column label="模型计算次数" prop="operationNums" width="120px" />
        <el-table-column label="模型计算状态" prop="quantity" width="120px">
          <template slot-scope="scope">
            <span
              :class="{'doing-color':Number(scope.row.functionState)===1,'done-color':Number(scope.row.functionState)===0 && Number(scope.row.operationNums)!==0}"
            >{{scope.row | initState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              :disabled="Number(scope.row.functionState) === 1"
              v-if="Number(scope.row.operationNums)===0"
              @click="handleCompute(scope.row)"
            >计算</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              :disabled="Number(scope.row.functionState) === 1"
              v-if="Number(scope.row.operationNums)>0"
              @click="handleCompute(scope.row)"
            >重新计算</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              :disabled="Number(scope.row.functionState) === 1 || Number(scope.row.operationNums)===0"
              @click="handleResult(scope.row)"
            >查看结果</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              :disabled="Number(scope.row.functionState) === 1"
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
      <el-form :model="flowForm" ref="flowForm" inline :rules="flowFormRules" label-width="100px">
        <el-form-item label="数据类型" prop="dataType">
          <el-radio-group
            v-model="flowForm.dataType"
            style="width: 160px"
            @change="handelRadioChange"
          >
            <el-radio label="1">套餐</el-radio>
            <el-radio label="2">套餐组</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择套餐组" prop="mealGroupGid" v-if="flowForm.dataType === '2'">
          <el-select
            v-model="flowForm.mealGroupGid"
            placeholder="请选择"
            style="width: 190px"
            @change="handelGroupChange"
          >
            <el-option
              v-for="(item,index) in flowGroupList"
              :key="index"
              :label="item.mealGroupName"
              :value="item.gid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据虚量" prop="quantity">
          <el-input
            v-model="flowForm.quantity"
            placeholder="请输入数据虚量"
            maxlength="8"
            clearable
            style="width: 180px"
          />
        </el-form-item>
      </el-form>
      <div v-loading="loadingFlow" style="padding:0;min-height:500px;" class="table-p model">
        <el-table
          ref="multipleTable"
          :data="flowList"
          tooltip-effect="dark"
          style="width: 100%"
          height="500"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            v-if="flowForm.dataType === '1' || flowForm.mealGroupGid===undefined"
          ></el-table-column>
          <el-table-column label="序号" prop="order" width="80" />
          <el-table-column label="套餐名称" prop="mealName" sortable width="300" show-overflow-tooltip />
          <el-table-column label="流量（MB）" prop="mealFlow" sortable />
          <el-table-column label="价格（元）" prop="mealAmount" sortable />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openFlow = false">取 消</el-button>
        <el-button
          :loading="loadingFlowOperate"
          type="primary"
          @click="operateModel('flowForm')"
        >开始计算</el-button>
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
        <el-form-item label="文件合并" prop="isMerge">
          <el-select v-model="formUpload.isMerge" placeholder="请选择" style="width:350px">
            <el-option label="合并多个文件数据" value="Y" />
            <el-option label="不合并独立计算" value="N" />
          </el-select>
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
  handelDelFileFlow,
  getCardGroupAllList,
  getCardGroupDetail,
  getCardOperateLine
} from "@/api/card";
import minHeightMix from "@/mixins/minHeight";
import UploadFile from "../components/UploadFile";
export default {
  mixins: [minHeightMix],
  components: {
    UploadFile
  },
  data() {
    const validateQuantity = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback("数据虚量不能为空");
      } else {
        if (!/((^[1-9]\d*)|^0)(\.\d{0,3}){0,1}$/.test(value)) {
          callback(new Error("非负整数或至多保留三位小数！"));
        } else if (Number(value) < 1) {
          callback(new Error("模型虚量不小于1！"));
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      loadingUpload: false,
      loadingFlow: false,
      loadingFlowOperate: false,
      formShow: true,
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        batchName: ""
      },
      openFlow: false,
      openUpload: false,
      fileShow: true,
      titleFlow: "资费方案计算",
      titleUpload: "导入流量数据",
      dateRange: [],
      fileFlowList: [], //模型文件列表
      flowList: [], //套餐列表
      flowGroupList: [], //套餐组列表
      multipleSelection: [], //选中套餐列表
      timer: null,
      haveDoing: [],
      lockFile: false,
      isGetLine: false,
      flowForm: {
        gid: undefined,
        flowSize: undefined,
        mealGroupGid: undefined,
        flowMealGids: undefined,
        quantity: "1",
        dataType: "1"
      },
      flowFormRules: {
        quantity: [
          { required: true, validator: validateQuantity, trigger: "blur" }
        ],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "change" }
        ],
        mealGroupGid: [
          { required: true, message: "请选择套餐组", trigger: "change" }
        ]
      },
      formUpload: { batchName: undefined, file: undefined, isMerge: "N" },
      formUploadRules: {
        batchName: [
          { required: true, message: "批次名称不能为空", trigger: "blur" }
        ],
        isMerge: [
          { required: true, message: "请选择是否合并", trigger: "change" }
        ],
        file: [{ required: true, message: "数据文件不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    haveDoing: {
      deep: true,
      handler(nVal, oVal) {
        this._clearTimer();
        if (oVal.length === 0 && nVal.length > 0) {
          this.getFlowLine();
        }
        if (nVal.length === oVal.length) {
          return false;
        }
      }
    }
  },
  filters: {
    initState(val) {
      if (Number(val.functionState) === 0) {
        if (Number(val.operationNums) === 0) {
          return "未计算";
        } else {
          return "已完成";
        }
      } else if (Number(val.functionState) === 1) {
        if (val.percentage === undefined || val.percentage === null) {
          return "加载中...";
        } else {
          if (Number(val.percentage) === 0) {
            return "等待中";
          } else {
            return `计算中：${Number(val.percentage)}%`;
          }
        }
      }
    }
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    this._clearTimer();
  },
  methods: {
    async getList() {
      if (!this.lockFile) {
        this.lockFile = true;
        try {
          this.loading = true;
          const { _initParams, queryForm } = this;
          const {
            code,
            data: {
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
            const isActData = content
              .filter(item => {
                return Number(item.functionState) === 1;
              })
              .map(v => {
                return v.gid;
              });
            this.haveDoing = [...new Set([...this.haveDoing, ...isActData])];
            this.lockFile = false;
          }
        } catch (err) {
          this.loading = false;
          this.lockFile = false;
          console.log(err);
        }
      } else {
        return false;
      }
    },
    async getFlowLine() {
      const timer = setTimeout(this.getFlowLine, 6000);
      try {
        const { data, code } = await getCardOperateLine({
          gids: this.haveDoing.join(",")
        });
        if (code === 200) {
          const newList = this.fileFlowList.map(v => {
            const result = data.find(m => {
              return m.gid === v.gid;
            });
            return Object.assign(v, {
              percentage: result ? result.percentage : null
            });
          });
          this.fileFlowList = newList;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getFlowList() {
      try {
        this.loadingFlow = true;
        const [
          { data: data1, code: code1 },
          { data: data2, code: code2 }
        ] = await Promise.all([getCardGroupAllList(), getSetMealListAll()]);
        this.loadingFlow = false;
        if (code1 === 200 && code2 === 200) {
          this.flowGroupList = data1.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
          this.flowList = data2.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
        }
      } catch (err) {
        this.loadingFlow = false;
        console.log(err);
      }
    },
    async operateModel(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { dataType, quantity, gid, mealGroupGid } = this.flowForm;
          if (dataType === "1") {
            if (this.multipleSelection.length < 2) {
              this.$confirm("至少选择两个套餐。", "系统提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "el-message-box-wran"
              })
                .then(() => {})
                .catch(() => {});
            } else {
              const flowMealGids = this.multipleSelection
                .map(item => {
                  return item.gid;
                })
                .join(",");
              this.operateAction({
                gid,
                quantity,
                flowMealGids
              });
            }
          } else if (dataType === "2") {
            this.operateAction({
              gid,
              quantity,
              mealGroupGid
            });
          }
        }
      });
    },
    async operateAction(dataParams) {
      try {
        this.loadingFlowOperate = true;
        const { gid, flowSize } = this.flowForm;
        const { code } = await handelOperateModel(dataParams);
        if (code === 200) {
          this.msgSuccess("操作成功");
          this.openFlow = false;
          this.loading = true;
          let time = 0;
          if (Number(flowSize) > 400000) {
            time = 6500;
          } else if (Number(flowSize) > 250000) {
            time = 4500;
          } else if (Number(flowSize) > 90000) {
            time = 2500;
          } else if (Number(flowSize) > 25000) {
            time = 1500;
          } else if (Number(flowSize) > 5000) {
            time = 800;
          } else {
            time = 300;
          }
          setTimeout(this.getList, time);
          this.loading = false;
        }
        this.loadingFlowOperate = false;
      } catch (err) {
        this.loadingFlowOperate = false;
        console.log(err);
      }
    },
    clearValidateFlow() {
      this.flowList = [];
      this.flowGroupList = [];
      this.$refs.flowForm.resetFields();
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
    resetFlowForm() {
      Object.assign(this.flowForm, {
        gid: undefined,
        flowSize: undefined,
        mealGroupGid: undefined,
        quantity: "1",
        dataType: "1"
      });
    },
    resetUploadForm() {
      Object.assign(this.formUpload, {
        batchName: undefined,
        file: undefined,
        isMerge: "N"
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
          const fileList = this.$refs.fileItemOne.fileList;
          let formData = new FormData();
          formData.append("batchName", this.formUpload.batchName);
          formData.append("isMerge", this.formUpload.isMerge);
          fileList.forEach((item, index) => {
            formData.append(`file${index + 1}`, item.file);
          });
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
      this.resetFlowForm();
      Object.assign(this.flowForm, {
        gid: item.gid,
        flowSize: item.flowCardNums
      });
      this.getFlowList();
    },
    handleResult(item) {
      this.$router.push({
        path: `/flow-card/result/${item.gid}`
      });
    },
    addItemFir(val) {
      this.formUpload.file = val;
      this.$refs["uploadElement"].clearValidate();
    },
    delItemFir(val) {
      this.formUpload.file = undefined;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async handelGroupChange(val) {
      try {
        this.loadingFlow = true;
        const { code, data } = await getCardGroupDetail({ gid: val });
        this.loadingFlow = false;
        if (code === 200) {
          this.flowList = data.map((item, index) => {
            return Object.assign(item, {
              order: index + 1
            });
          });
        }
      } catch (err) {
        this.loadingFlow = false;
        console.log(err);
      }
    },
    async handelRadioChange(val) {
      if (val === "1") {
        Object.assign(this.flowForm, {
          mealGroupGid: undefined,
          quantity: "1"
        });
        this.getFlowList();
      } else if (val === "2") {
        this.flowList = [];
      }
    },
    _clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
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