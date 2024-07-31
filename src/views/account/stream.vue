<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="stream main-box">
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="username" label="用户" min-width="150" />
        <el-table-column prop="stream_sn" label="订单号" min-width="150" />
        <el-table-column prop="create_time" label="时间" min-width="150" />
        <el-table-column label="流水" min-width="120">
          <template slot-scope="scope">
            <span :style="{color:scope.row.reduce_balance*1>0?'#00b91a':'#ff4701'}">{{scope.row.reduce_balance*1>0?'+'+scope.row.reduce_balance:scope.row.reduce_balance}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="params.type==='1'?'余额':'积分'" min-width="160">
          <template slot-scope="scope">
            <div>流水前：{{scope.row.before_balance}}</div>
            <div>流水后：{{scope.row.after_balance}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="explain" label="说明" min-width="220" />
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
import { getStreamList } from '@/api/user'
export default {
  data() {
    return {
      loading: true,
      params:{
        user_id:'',
        type:''
      },
      list: [],
      page: 1,
      size: 10,
      total: 0
    }
  },
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        this.params = {...value}
        this.getStreamList()
      }
    }
  },
  created() {
  },
  methods: {
    async getStreamList(){
      const params = {...this.params}
      params.page=this.page
      params.size=this.size
      const {code,data} = await getStreamList(params)
      if(code===0){
        this.loading = false
        this.list = data.list
        this.total = data.total
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getStreamList()
    }
  }
}
</script>
<style lang="scss" scoped>
.stream {
  .list {
    margin: 20px 0 60px 0;
  }
}
</style>