<template>
  <div class="upload-file">
    <el-upload
      class="upload-demo"
      action
      :http-request="upload"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :multiple="true"
      :limit="6"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xlsx表格文件，且最大不超过20MB，最多可上传6个文件。</div>
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
      const idx = this.fileList.findIndex(item => {
        return item.uid === file.uid;
      });
      this.fileList.splice(idx, 1);
    },
    handleBeforeUpload(file) {
      const fileExt = file.name.replace(/.+\./, "");
      const isType = ["xlsx"].includes(fileExt);

      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isType) {
        this.$message.error("请上传后缀名为xlsx的附件！");
      }
      if (!isLt20M) {
        this.$message.error("上传图片大小不能超过 20MB!");
      }
      return isType && isLt20M;
    },
    upload(file) {
      this.$emit("add-item", this.fileList);
      this.fileList.push(file);
    }
  }
};
</script>