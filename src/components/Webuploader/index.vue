<template>
  <div class="page">
    <div id="filePicker">选择文件</div>
    <div class="file-panel">
      <h2>文件列表</h2>
      <div class="file-list">
        <ul
          class="file-item"
          :class="`file-${file.id}`"
          v-for="(file,index) in fileList"
          :key="index"
        >
          <li class="file-type el-icon-document"></li>
          <li class="file-name">{{file.name}}</li>
          <li class="file-size">{{fileSize(file.size)}}</li>
          <li class="file-status">上传中...</li>
          <li class="file-operate">
            <a title="移除" @click="remove(file)">
              <i class="el-icon-circle-close"></i>
            </a>
          </li>
          <li class="progress"></li>
        </ul>
        <div class="no-file" v-if="!fileList.length">
          <i class="iconfont icon-empty-file"></i> 暂无待上传文件
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fileUploadCheck, fileUploadMerge } from "@/api/card";
import { getToken } from "@/utils/auth";
export default {
  name: "vue-upload",
  data() {
    return {
      uploader: null,
      sid: undefined,
      chunkSize: 0.5 * 1024 * 1024,
      fileSingleSizeLimit: 20 * 1024 * 1024,
      fileNumLimit: 5,
      fileList: []
    };
  },
  mounted() {
    this.initUploader();
  },
  methods: {
    initUploader() {
      const that = this;
      this.S4();
      WebUploader.Uploader.register(
        {
          "before-send-file": "beforeSendFile",
          "before-send": "beforeSend",
          "after-send-file": "afterSendFile"
        },
        {
          //所有分块进行上传之前调用此函数
          beforeSendFile: file => {
            //1、计算文件的唯一标记，用于断点续传
            const deferred = WebUploader.Deferred();
            new WebUploader.Uploader().md5File(file).then(val => {
              file.md5 = val;
              file.sid = that.sid;
              deferred.resolve();
            });
            return deferred.promise();
          },
          //上传分块前检查该分块是否存在
          beforeSend: function(block) {
            const {
              file: { name, md5 },
              chunks,
              chunk,
              end,
              start
            } = block;
            const deferred = WebUploader.Deferred();
            fileUploadCheck({
              sid: that.sid,
              name,
              md5,
              chunks,
              chunk,
              chunkSize: end - start
            })
              .then(({ code, data }) => {
                if (code === 200) {
                  if (data === true) {
                    deferred.reject();
                  } else if (data === false) {
                    deferred.resolve();
                  }
                }
              })
              .catch(err => {
                console.log(err);
              });
            this.owner.options.formData.sid = that.sid;
            this.owner.options.formData.md5 = md5;
            this.owner.options.formData.chunk = chunk;
            this.owner.options.formData.chunkSize = Number(end) - Number(start);
            deferred.resolve();
            return deferred.promise();
          },
          //所有分块上传成功后通知服务器合并文件
          afterSendFile: async function({ id, size, name, md5 }) {
            var chunks = 0;
            chunks = Math.ceil(size / that.chunkSize);
            try {
              const { code, data } = await fileUploadMerge({
                sid: that.sid,
                name,
                md5,
                size,
                chunks
              });
            } catch (err) {
              console.log(err);
            }
          }
        }
      );
      this.uploader = WebUploader.create({
        swf: "../../../public/static/utils/Uploader.swf",
        runtimeOrder: "html5,flash",
        server: "http://118.89.63.125:21000/fulcrum/uplaodFile/uploadChunk",
        pick: "#filePicker",
        resize: false,
        fileNumLimit: that.fileNumLimit,
        fileSingleSizeLimit: that.fileSingleSizeLimit,
        auto: true, //开启自动上传
        chunked: true, //开启文件切片上传
        chunkSize: this.chunkSize, //切片大小
        chunkRetry: 3, //如果某个分片由于网络问题出错，允许自动重传多少次
        threads: 1, //上传并发数（同一文件），允许同时最大上传进程数[默认值：3]
        duplicate: false, //是否重复上传（同时选择多个一样的文件），true可以重复上传
        prepareNextFile: true, //上传当前分片时预处理下一分片
        multiple: true, //选择多个文件进行上传
        accept: {
          extensions: "zip,rar,iso,xls,xlsx,lua",
          mimeTypes: ".zip,.rar,.iso,.xls,.xlsx,.lua"
        }
      });
      this.uploader.on("uploadBeforeSend", function(obj, data, headers) {
        $.extend(headers, {
          Authorization: "Bearer " + getToken()
        });
      });
      this.uploader.on("fileQueued", file => {
        this.fileList.push(file);
      });
      this.uploader.on("uploadProgress", (file, percentage) => {
        $(`.file-${file.id} .progress`).css("width", percentage * 100 + "%");
        $(`.file-${file.id} .file-status`).html(
          (percentage * 100).toFixed(2) + "%"
        );
      });
      this.uploader.on("error", type => {
        let errorMessage = "";
        if (type === "F_EXCEED_SIZE") {
          errorMessage = `文件大小不能超过${this.fileSingleSizeLimit /
            (1024 * 1000)}M`;
        } else if (type === "Q_EXCEED_NUM_LIMIT") {
          errorMessage = "文件上传已达到最大上限数 5";
        } else {
          errorMessage = `上传出错！请检查后重新上传！错误代码${type}`;
        }
        this.$confirm(`${errorMessage}`, "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        })
          .then(async () => {})
          .catch(err => {});
      });
    },
    fileSize(size) {
      return WebUploader.Base.formatSize(size);
    },
    remove(file) {
      this.uploader.cancelFile(file);
      this.uploader.removeFile(file, true);
      let index = this.fileList.findIndex(ele => ele.id === file.id);
      this.fileList.splice(index, 1);
    },
    reset() {
      this.uploader.reset();
    },
    S4() {
      this.sid = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
    }
  }
};
</script>
