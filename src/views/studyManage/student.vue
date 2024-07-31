<template>
  <div v-loading="loading" class="student-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <!-- <div class="select">
      <el-select size="small" clearable placeholder="请选择试题类型" v-model="status" style="margin-right: 30px">
        <el-option value="1" label="单选" />
        <el-option value="2" label="多选" />
      </el-select>
      <el-select size="small" clearable placeholder="请选择试题分类" v-model="status" style="margin-right: 30px">
        <el-option value="" label="" />
      </el-select>
      <el-button size="small">查 询</el-button>
      <el-button size="small">重 置</el-button>
    </div> -->
    <router-link to="./editStudent">
      <el-button class="add-video" icon="el-icon-plus">新增</el-button>
    </router-link>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="岗位" prop="name" min-width="250"/>
        <el-table-column label="真实姓名" prop="mobile" min-width="200"/>
        <el-table-column label="观看视频" prop="create_time" min-width="200"/>
        <el-table-column label="参与考试" prop="create_time" min-width="200"/>
        <el-table-column label="考试成绩" prop="create_time" min-width="200"/>
        <el-table-column label="账号" prop="create_time" min-width="200"/>
        <el-table-column label="薪资（元）" prop="create_time" min-width="200"/>
        <el-table-column label="操作" fixed="right" width="200">
          <template>
            <el-button type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination :page-size="size" layout="prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
export default {
  name: 'Subject',
  data() {
    return {
      list: [],
      status: '',
      video_name:'',
      size: 10,
      page: 1,
      total: 0,
      switchId:'',
      loading: false
    }
  },
  created() {
  },
  methods: {
    async changeStatus(val,row) {
      this.switchId = row.id
      const { code } = await setMessageStatus({ id: row.id, status: val })
      if(code===0){
        this.switchId = ''
        row.status = val
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
    }
  }
}
</script>
<style lang="scss">
.student-list {
  .select {
    display: flex;
    align-items: center;
    .el-cascader{
      width: 224px;
      margin-right: 30px;
    }
    .el-input {
      width: 300px;
    }
    .el-button {
      background-color: #3954b3;
      color: #fff;
    }
    .el-button + .el-button {
      background-color: #fff;
      color: #666666;
    }
  }
  .add-video{
    float: right;
    margin: 20px 24px 30px 0;
  }
  .list {
    margin-bottom: 60px;
  }
}
</style>

