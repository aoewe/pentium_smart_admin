<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="recharge-audit main-box">
    <div class="select">
      <el-input size="small" placeholder="请输入发起人" v-model="applicant" style="margin-right:3px">
        <template slot="prepend">发起人</template>
      </el-input>
      <el-input size="small" placeholder="请输入目标人" v-model="relate_mobile" style="margin-right:30px">
        <template slot="prepend">目标人</template>
      </el-input>
      <el-button size="small" @click="search">查 询</el-button>
      <el-button size="small">重 置</el-button>
    </div>
    <div class="methods">
      <div>
        <span style="padding-right: 50px;">共{{total}}条数据</span>
        <span>余额充值总金额：{{info.count_balance_sh}}（已审核）{{ info.count_balance_wsh }}（未审核）</span>
        <span>积分充值总金额：{{info.count_integral_sh}}（已审核）{{ info.count_integral_wsh }}（未审核）</span>
      </div>
      <div>
        <el-button icon="el-icon-connection" :disabled="!exportList.length" @click="handelExport">导出</el-button>
        <el-button icon="el-icon-receiving" @click="allExport">一键导出</el-button>
      </div>
    </div>
    <div class="list">
      <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="create_time" label="时间" min-width="200" sortable />
        <el-table-column prop="applicant" label="发起人" min-width="200" />
        <el-table-column prop="remark" label="备注" min-width="200" />
        <el-table-column label="充值类型" min-width="200">
          <template slot-scope="scope">{{scope.row.type===1?'余额':'积分'}}</template>
        </el-table-column>
        <el-table-column prop="relate_mobile" label="目标人" min-width="200">
          <template slot-scope="scope">{{scope.row.relate_username}}<br/>{{scope.row.relate_mobile}}</template>
        </el-table-column>
        <el-table-column prop="reduce_balance" label="金额" min-width="200" sortable />
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
import {getRechargeList,auditRecharge} from '@/api/finance'
export default {
  name: 'rechargeAudit',
  data() {
    return {
      loading: true,
      relate_mobile:'',
      applicant:'',
      exportList:[],
      list: [],
      total: 0,
      page: 1,
      info:{}
    }
  },
  created() {
    this.getRechargeList()
  },
  methods: {
    async getRechargeList(filters={}){
      const params={
        page:this.page,
        size:10,
        sorts: {},
        filters
      }
      const {code,data} = await getRechargeList(params)
      if(code===0) {
        this.list = data.list
        this.total = data.total
        this.info = {
          count_balance_sh:data.count_balance_sh,
          count_balance_wsh:data.count_balance_wsh,
          count_integral_sh:data.count_integral_sh,
          count_integral_wsh:data.count_integral_wsh
        }
        this.loading = false
      }
    },
    async auditing(row,type){
      if(type==='AGREE'){
          const {code} = await auditRecharge({id:row.id,status:1})
          if(code===0) row.status = 1
      }else{
        this.$confirm(`是否拒绝${row.relate_username}(${row.relate_mobile})充值`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {code} = await auditRecharge({id:row.id,status:2})
          if(code===0) row.status = 2
        }).catch(()=>{})
      }
    },
    search(){
      const filters = {}
      this.loading = true
      this.relate_mobile && (filters.relate_mobile = this.relate_mobile)
      this.applicant && (filters.applicant = this.applicant)
      this.getRechargeList(filters)
    },
    handelExport(){},
    allExport(){},
    handleSelectionChange(row) {
      this.exportList = row
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page= val
      this.getRechargeList()
    }
  }
}
</script>
<style lang="scss" scoped>
.recharge-audit {
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