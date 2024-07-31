<template>
  <div v-loading="loading" class="order-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <el-select placeholder="请选择归属" size="small" v-model="owner_id">
        <el-option v-for="item in ownerList" :key="item.id" :value="item.id" :label="item.username" />
      </el-select>
      <el-button size="small" @click="search">查 询</el-button>
      <el-button size="small" @click="reset">重 置</el-button>
    </div>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="结算时间" min-width="20%">
          <template slot-scope="scope">
            <div class="item">
              <span>财务单号：{{scope.row.financecode}}</span>
              <span>生成时间：{{scope.row.create_time}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="财务信息" min-width="15%">
          <template slot-scope="scope">
            <div class="item">
              <u>{{ `总金额：${scope.row.set_money || 0}元` }}</u>
              <u>{{ `大件结算金额：${scope.row.set_two_money || 0}元` }}</u>
              <u>{{ `小件结算金额：${scope.row.set_one_money || 0}元` }}</u>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="费用明细" min-width="15%">
          <template slot-scope="scope">
            <div class="item">
              <span>{{ `电费：${scope.row.power_rate || 0}元` }}</span>
              <span>{{ `其他费用：${scope.row.other_money || 0}元` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产量内容" min-width="15%">
          <template slot-scope="scope">
            <div class="item">
              <span>{{ `大件：${scope.row.processed_two || 0}吨` }}</span>
              <span>{{ `小件：${scope.row.processed || 0}吨` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注内容" min-width="20%">
          <template slot-scope="scope">
            <div class="item">
              <span>{{scope.row.remark || '无'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="6%">
          <template slot-scope="scope">
            <div class="item">
              <u>{{scope.row.pay_status === 0 ? '未打款' : '已打款'}}</u>
            </div>
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
import { getSettlementList } from '@/api/finance'
import { getUserByType } from '@/api/public'
export default {
  name: 'OrderList',
  data() {
    return {
      list: [],
      size: 5,
      page: 1,
      total: 0,
      loading: true,
      ownerList: [],
      owner_id: ''
    }
  },
  created(){
    this.getSettlementList()
    this.getUserByType()
  },
  methods: {
    reset(){
      this.loading = true
      this.owner_id = ''
      this.getSettlementList()
    },
    search(){
      this.loading = true
      this.getSettlementList()
    },
    async getUserByType(){
      const {code,data} = await getUserByType({user_type:7})
      if(code===0){
        this.ownerList = data
      }
    },
    async getSettlementList(){
      const filters = {}
      this.owner_id && (filters.owner_id = this.owner_id)
      const params = {
        page:this.page,
        size:this.size,
        sorts:{},
        filters
      }
      const {code,data} = await getSettlementList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getSettlementList()
    }
  }
}
</script>
<style lang="scss" scoped>
.order-list{
  .select {
    margin: 5px 0 40px;
   .el-select{
      width: 224px;
      margin-right: 30px;
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
    margin-bottom: 50px;
     .item{
      color: #333333;
      display: inline-flex;
      flex-direction: column;
      line-height: 28px;
    }
  }
}
</style>
