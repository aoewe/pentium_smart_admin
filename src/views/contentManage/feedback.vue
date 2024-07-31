<template>
  <div v-loading="loading" class="feedback main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="user_name" label="用户" min-width="150"/>
        <el-table-column prop="create_time" label="反馈时间" min-width="200"/>
        <el-table-column label="反馈内容" min-width="200">
          <template slot-scope="scope">
            <el-popover trigger="hover" :title="scope.row.content" width="500" placement="left">
              <div style="display: flex;flex-wrap: wrap;">
                <el-image v-for="item in scope.row.img" :key="item" :src="item" :preview-src-list="[item]" style="max-width: 237px;"></el-image>
              </div>
              <u slot="reference" class="ellipsis-text">{{scope.row.content}}</u>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">>
          <template slot-scope="scope">
            <div v-if="scope.row.status===0">
              <el-button type="success" @click="auditing(scope.row)">已处理</el-button>
            </div>
            <span v-else style="font-size: 14px;">已处理</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import {getOpinionList,setOpinionStatus} from '@/api/content'
export default {
  name: 'Feedback',
  data() {
    return {
      loading:true,
      page:1,
      size:10,
      total:0,
      list:[]
    }
  },
  created() {
    this.getOpinionList()
  },
  methods: {
    async getOpinionList(){
      const params = {
        page:this.page,
        size:this.size,
        filters:{},
        sorts:{}
      }
      const {code,data} = await getOpinionList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    async auditing(row){
      const params = {
        status:1,
        id:row.id
      }
      const {code} = await setOpinionStatus(params)
      if(code===0){
        row.status = 1
      }
    },
    handleCurrentChange(val){
      this.loading = true
      this.page = val
      this.getOpinionList()
    }
  }
}
</script>
<style lang="scss">
.feedback{
  .list{
    margin: 20px 0 60px;
    .el-button{
      border-radius: 4px;
      padding: 6px 12px;
    }
  }
}

</style>
