<template>
  <div v-loading="loading" class="main-box journal" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <el-input size="small" placeholder="请输入请求路径" v-model="url" style="margin-right:30px">
        <template slot="prepend">请求路径</template>
      </el-input>
      <el-button size="small" @click="loading=true,getLogList()">查 询</el-button>
      <el-button size="small" @click="url='',loading=true,getLogList()">重 置</el-button>
    </div>
    <div class="list">
      <el-table :data="logList" row-key="id" style="margin-bottom:38px">
        <el-table-column label="操作人" prop="username" min-width="120" />
        <el-table-column label="时间" prop="update_time" min-width="200" />
        <el-table-column label="请求API" prop="ip" min-width="200" />
        <el-table-column label="请求方法" prop="method" min-width="100" />
        <el-table-column label="请求路径" prop="url" min-width="300" />
        <el-table-column label="响应内容" prop="response" min-width="120" />
        <el-table-column label="请求头" min-width="300">
          <template slot-scope="scopes">
            <el-popover placement="left-start" title="请求头">
              <div style="max-height:400px;overflow-y: scroll;width: 800px;">
                <json-viewer :value="scopes.row.header" ></json-viewer>
              </div>
              <el-button slot="reference" class="ellipsis-text" style="max-width: 280px;" type="text">{{scopes.row.header}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="请求参数" min-width="300">
          <template slot-scope="scopes">
            <div v-if="scopes.row.des.length===0">无</div>
            <el-popover v-else placement="left-start" title="请求参数">
              <div style="max-height:500px;overflow-y: scroll;">
                <json-viewer :value="scopes.row.params" ></json-viewer>
              </div>
              <el-button slot="reference" class="ellipsis-text" style="max-width: 280px;" type="text">{{scopes.row.header}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :page-size="size"
      :total="total"
      layout="prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getLogList } from '@/api/authority'
import JsonViewer from 'vue-json-viewer'
export default {
  components:{JsonViewer},
  name: 'Logs',
  data() {
    return {
      logList: [],
      loading: true,
      url:'',
      page: 1,
      size: 10,
      total: 0
    }
  },
  created() {
    this.getLogList()
  },

  methods: {
    async getLogList() {
      const filters = {}
      this.url && (filters.url = this.url)
      const params = {
        filters,
        sorts: {},
        type: 0,
        page: this.page,
        size: this.size
      }
      const res = await getLogList(params)
      if (res.code === 0) {
        this.total = res.data.total
        this.logList = res.data.list
        this.loading = false
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getLogList()
    }
  }
}
</script>
<style lang="scss">
.journal{
  .select {
    display: flex;
    align-items: center;
    .el-input {
      width: 400px;
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
  .list{
    margin-bottom: 60px;
    padding-top: 30px;
  }
  .el-popover{
    height: 500px;
    overflow-y: scroll;
  }
}
</style>
