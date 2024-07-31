<template>
  <div v-loading="loading" class="settlement-log main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <el-cascader placeholder="请选择设备归属" size="small" :props="props" v-model="value" style="width:224px;margin-right: 30px"></el-cascader>
      <!-- <span>简称</span>
      <el-input placeholder="请输入简称" v-model="name" style="margin-right:30px"></el-input> -->
      <el-button size="small" @click="search">查 询</el-button>
      <el-button size="small" @click="reset">重 置</el-button>
    </div>
    <div class="list">
      <el-table :data="logs" style="width: 100%">
        <el-table-column label="设备信息" min-width="20%">
          <template slot-scope="scope">
            <div class="item">
              <span>简称：{{scope.row.equipment_name}}</span>
              <!-- <span>编号：{{scope.row.number}}</span> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结算时间" min-width="20%">
          <template slot-scope="scope">
            <div class="item">
              <!-- <span>结算单号：202208011983232</span> -->
              <span>开始：{{handelDate(scope.row.date_begin)}}  结止：{{handelDate(scope.row.date_end)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="设备铺设/权属商家" min-width="18%">
          <template slot-scope="scope">
            <div class="item">
              <span>铺设方：{{scope.row.factory_user_name}}</span>
              <span>购买方：{{scope.row.buy_user_name}}</span>
              <span>业主方：{{scope.row.owner_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产量内容" min-width="32%">
          <template slot-scope="scope">
            <div class="item">
              <span>{{ `大件：${scope.row.processed_two || 0}吨` }}{{ `\xa0\xa0\xa0\xa0单价${scope.row.price_two || 0}元/吨` }}{{ `\xa0\xa0\xa0\xa0金额：${scope.row.processed_two_money}元` }}</span>
              <span>{{ `小件：${scope.row.processed || 0}吨` }}{{ `\xa0\xa0\xa0\xa0单价${scope.row.price || 0}元/吨` }}{{ `\xa0\xa0\xa0\xa0金额：${scope.row.processed_money}元` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产量确认" min-width="10%">
          <template slot-scope="scope">
            <div class="item">
              <u>总金额：{{scope.row.processed_money_count}}元</u>
              <!-- <u style="text-align: center;">状态：未支付</u> -->
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
import { getProductionList } from '@/api/finance'
import { getUserByType } from '@/api/public'
export default {
  name: 'SettlementLog',
  data() {
    let values = [{value:3,label:'铺设方'},{value:4,label:'购买方'},{value:7,label:'业主方'}];
    return {
      logs: [],
      size: 5,
      page: 1,
      total: 0,
      loading: true,
      value: [],
      name: '',
      isCreated: true,
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          const nodes = []
          if(node.level === 0 ){
            resolve(values)
          }else{
            getUserByType({user_type:node.value}).then(res=>{
              if(res.code===0){
                res.data.map(i=>{
                  let obj = {
                    value: i.id,
                    label: i.username,
                    leaf: node.level >= 1
                  }
                  nodes.push(obj)
                })
                resolve(nodes)
              }
            })
          }
        }
      }
    }
  },
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        if(value.oid){
          this.loading = true
          this.isCreated = false
          this.getProductionList()
        }
      }
    }
  },
  created() {
    if(this.isCreated){
      this.getProductionList()
    }
  },
  computed:{
    oid(){return this.$route.query.oid}
  },
  methods: {
    reset(){
      this.$router.push({ query: {} })
      this.loading = true
      this.number=''
      this.value=[]
      this.getProductionList()
    },
    search(){
      this.loading = true
      this.getProductionList()
    },
    handelDate(time){
      var date = new Date(time*1000)
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      return y+'/'+m+'/'+d
    },
    async getProductionList(){
      const filters = {}
      const value = [...this.value]
      if(this.oid) filters.owner_id = this.oid
      if(value.length){
        switch (value[0]) {
          case 3:
            filters.factory_user_id = value[1]
            break;
          case 4:
            filters.buy_user_id = value[1]
            break;
          case 7:
            filters.owner_id = value[1]
            break;
          default:
            break;
        }
      }
      this.name && (filters.name = this.name)
      const params = {
        page: this.page,
        size: this.size,
        filters,
        sorts:{}
      }
      const {code,data} = await getProductionList(params)
      if(code===0){
        this.logs = data.list
        this.total = data.total
        this.loading = false
      }
    },

    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getProductionList()
    }
  }
}
</script>
<style lang="scss" scoped>
.settlement-log{
  .select {
    margin: 5px 0 40px;
    .el-input{
      width: 200px;
      margin-right: 60px;
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
