<template>
  <div class="app-container">
    <div class="table-p table-result" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <div class="result-title">{{title}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r">
        <el-col :span="1.5">
          <el-button
            type="primary"
            :loading="exportLoading"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
            v-if="canDownload"
          >下载结果</el-button>
        </el-col>
      </el-row>
      <el-table
        style="width: 100%"
        v-if="canDownload"
        v-loading="loading"
        :data="resultList"
        :span-method="objectSpanMethod"
      >
        <el-table-column label="编号" prop="order" width="80" />
        <el-table-column label="套餐名称" prop="flowMealName" width="300" show-overflow-tooltip />
        <el-table-column label="流量（MB）" prop="flowMealFlow" />
        <el-table-column label="价格（元）" prop="flowMealAmount" />
        <el-table-column label="数量" prop="flowNum" />
        <el-table-column label="结算流量（MB）" prop="flowSettlementConsumption" />
        <el-table-column label="实际流量（MB）" prop="flowActualConsumption" />
        <el-table-column label="结果验证"  width="90" prop="examinBool">
          <template slot-scope="scope">
            <span style="color:rgb(131, 212, 150)">{{scope.row.examinBool}}</span>
          </template>
        </el-table-column>
        <el-table-column label="总流量（MB）" prop="consumption" />
        <el-table-column label="总卡数" prop="cardNums" />
        <el-table-column label="结算金额（元）" prop="settlementAmount" />
      </el-table>
    </div>
  </div>
</template>

<script>
import minHeightMix from "@/mixins/minHeight";
import { getFileFlowResult, handelDownloadResult } from "@/api/card";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      exportLoading: false,
      gid: undefined,
      errorCode: undefined,
      title: undefined,
      resultList: [{ a: 10, b: 20, c: 30, d: 40 }]
    };
  },
  computed: {
    canDownload() {
      return (
        Number(this.errorCode) === 0 ||
        Number(this.errorCode) === 4 ||
        Number(this.errorCode) === 6
      );
    }
  },
  created() {
    this.gid = this.$route.params.code;
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const {
          code,
          data: {
            batchName,
            beginTime,
            endTime,
            errorMessage,
            errorCode,
            flowExeDetailResults,
            consumption,
            cardNums,
            quantity,
            settlementAmount
          }
        } = await getFileFlowResult({
          gid: this.gid
        });
        this.loading = false;
        if (code === 200) {
          this.resultList = flowExeDetailResults.map((item, index) => {
            return Object.assign(item, {
              order: index+1,
              consumption,
              cardNums,
              settlementAmount,
              examinBool:
                Number(item.flowSettlementConsumption) <
                Number(item.flowActualConsumption)
                  ? "不可行"
                  : "可行"
            });
          });
          this.errorCode = errorCode;
          this.title = ` [ ${batchName} ] 执行结果，当前虚量：${quantity}，执行时间为${beginTime} 到 ${endTime}，${errorMessage}`;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handleDownload() {
      this.$confirm("是否确认下载数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          try {
            this.exportLoading = true;
            const { msg, code } = await handelDownloadResult({ gid: this.gid });
            this.exportLoading = false;
            if (code === 200) {
              this.download(msg);
              this.msgSuccess("下载成功");
              this.exportLoading = false;
            }
          } catch (err) {
            this.exportLoading = false;
            console.log(err);
          }
        })
        .catch(function() {});
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 8 || columnIndex === 9 || columnIndex === 10) {
        if (rowIndex % 50 === 0) {
          return {
            rowspan: 50,
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