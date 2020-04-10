<template>
  <div class="upload-file">
    <el-upload
      class="upload-demo"
      action
      :http-request="upload"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="1"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xlsx表格文件，且最大不超过30MB，最多上传一个文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit("del-item", file.uid);
      this.fileList = [];
    },
    handleBeforeUpload(file) {
      const fileExt = file.name.replace(/.+\./, "");
      const isType = ["xlsx"].includes(fileExt);

      const isLt30M = file.size / 1024 / 1024 < 30;
      if (!isType) {
        this.$message.error("请上传后缀名为xlsx的附件！");
      }
      if (!isLt30M) {
        this.$message.error("上传图片大小不能超过 50MB!");
      }
      return isType && isLt30M;
    },
    upload(file) {
      this.fileList[0] = file.file;
      this.$emit("add-item", this.fileList);
    }
  }
};
</script>