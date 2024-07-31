<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="post-review main-box">
    <!-- <div class="select">
      <el-input size="small" placeholder="请输入发起人" v-model="applicant" style="margin-right:3px">
        <template slot="prepend">发起人</template>
      </el-input>
      <el-input size="small" placeholder="请输入目标人" v-model="relate_mobile" style="margin-right:30px">
        <template slot="prepend">目标人</template>
      </el-input>
      <el-button size="small" @click="search">查 询</el-button>
      <el-button size="small">重 置</el-button>
    </div> -->
    <!-- <div class="methods">
      <span>共{{total}}条数据</span>
      <div>
        <el-button icon="el-icon-connection" :disabled="!exportList.length" @click="handelExport">导出</el-button>
        <el-button icon="el-icon-receiving" @click="allExport">一键导出</el-button>
      </div>
    </div> -->
    <div class="list">
      <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="create_time" label="时间" min-width="200" sortable />
        <el-table-column prop="name" label="提交人" min-width="200" />
        <el-table-column prop="department" label="提交部门" min-width="200" />
        <el-table-column label="提交岗位" min-width="200">
          <template slot-scope="scope">{{ scope.row.member || '- -'}}</template>
        </el-table-column>
        <el-table-column label="审核" width="200" fixed="right">
          <template slot-scope="scope">
            <div class="btns" v-if="scope.row.status===0">
              <el-button @click="auditing(scope.row,'REFUSE')">拒绝</el-button>
              <el-button type="success" @click="auditing(scope.row,'AGREE')">同意</el-button>
            </div>
            <span v-else :style="{'text-decoration':scope.row.status===1?'':'line-through','fontSize':'14px'}">{{scope.row.status===1?'已同意':'已拒绝'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import {getExamineList,editExamineStatus} from '@/api/user'
export default {
  name: 'PostReview',
  data() {
    return {
      loading: true,
      relate_mobile:'',
      applicant:'',
      exportList:[],
      list: [],
      total: 0,
      page: 1,
    }
  },
  created() {
    this.getExamineList()
  },
  methods: {
    async getExamineList(filters={}){
      const params={
        page:this.page,
        size:10,
        sorts: {},
        filters
      }
      const {code,data} = await getExamineList(params)
      if(code===0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    async auditing(row,type){
      if(type==='AGREE'){
          const {code} = await editExamineStatus({id:row.id,status:1})
          if(code===0) row.status = 1
      }else{
        this.$confirm(`是否驳回${row.name}的认证`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {code} = await editExamineStatus({id:row.id,status:2})
          if(code===0) row.status = 2
        }).catch(()=>{})
      }
    },
    search(){
      const filters = {}
      this.loading = true
      this.relate_mobile && (filters.relate_mobile = this.relate_mobile)
      this.applicant && (filters.applicant = this.applicant)
      this.getExamineList(filters)
    },
    handelExport(){},
    allExport(){},
    handleSelectionChange(row) {
      this.exportList = row
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page= val
      this.getExamineList()
    }
  }
}
</script>
<style lang="scss" scoped>
.post-review {
  .select {
    display: flex;
    align-items: center;
    .el-input {
      width: 300px;
    }
    span {
      font-size: 15px;
      color: #333;
      margin-right: 15px;
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
  .methods{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0;
    span{
      color: #666666;
      font-size: 13px;
    }
  }
  .list {
    margin: 20px 0 60px 0;
    .btns{
      .el-button{
        border-radius: 4px;
        padding: 6px 12px;
      }
    }
  }
}
</style>