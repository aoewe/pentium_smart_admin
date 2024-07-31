<template>
  <div v-loading="loading" class="generate-order main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="商户信息" min-width="27%">
          <template slot-scope="scope">
            <div class="item">
              <!-- <span>铺设方：{{scope.row.factory_user_name}}</span>
              <span>购买方：{{scope.row.buy_user_name}}</span> -->
              <span>业主方：{{scope.row.owner_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" min-width="27%">
          <template slot-scope="scope">
            <div class="item">
              <u>总金额：{{scope.row.processed_money_count || 0}}元</u>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产量内容" min-width="40%">
          <template slot-scope="scope">
            <div class="item">
              <span>{{ `大件：${scope.row.processed_two<1000?scope.row.processed_two+'kg':scope.row.processed_two/1000+'吨'}` }}{{ `\xa0\xa0\xa0\xa0结算金额：${scope.row.processed_money || 0}元` }}</span>
              <span>{{ `小件：${scope.row.processed<1000?scope.row.processed+'kg':scope.row.processed/1000+'吨'}` }}{{ `\xa0\xa0\xa0\xa0结算金额：${scope.row.processed_two_money || 0}元` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button style="color:#3954B3" type="text" @click="handelRow(scope.row)">生成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`业主方：${ownerName}`" :visible.sync="dialogVisible" :before-close="initForm" width="850px">
      <p>待结算列表</p>
      <div class="table">
        <div class="header"><span>选择</span><span>设备简称</span><span class="data">生产数据</span><span>结算日期</span><span>数据明细</span></div>
        <ul>
          <li v-for="(item,index) in fromData" :key="index">
            <el-checkbox @change="handelCheck(item.id)" />
            <span>{{ item.equipment_name }}</span>
            <span class="data">大件：{{ item.processed_two<1000?item.processed_two+'kg':item.processed_two/1000+'吨\xa0\xa0' }}小件：{{ item.processed<1000?item.processed+'kg':item.processed/1000+'吨\xa0\xa0' }}金额：{{ item.processed_money_count }}元</span>
            <span>{{ handelDate(item.create_time) }}</span>
            <el-popover
              placement="left"
              title="明细"
              trigger="click">
              <ul class="info">
                <li>设备简称：<span>{{item.equipment_name}}</span></li>
                <li>小件产量：<span v-convert="item.processed"></span></li>
                <li>大件产量：<span v-convert="item.processed_two"></span></li>
                <li>小计结算单价：<span>{{item.price}}元</span></li>
                <li>大计结算单价：<span>{{item.price_two}}元</span></li>
                <li>小件结算金额：<span>{{item.processed_money}}元</span></li>
                <li>大件结算金额：<span>{{item.processed_two_money}}元</span></li>
                <li>总结算金额：<span>{{item.processed_money_count}}元</span></li>
              </ul>
              <span slot="reference" class="details">详情</span>
            </el-popover>
          </li>
        </ul>
      </div>
      <span v-if="notIds" style="color:#F56C6C;font-size:12px;">请选择设备</span>
      <p>大件总计：{{ `${processedTowTotal}吨\xa0\xa0` }}小件总计：{{ `${processedTotal}吨\xa0\xa0` }}总金额：{{totalPrice}}元</p>
      <div class="dialog-bottom">
        <el-form ref="form" :model="form" :rules="rules" label-width="95px">
          <div class="row2">
            <el-form-item label="电费：" prop="power_rate">
              <el-input v-model="form.power_rate" type="number" placeholder="请输入电费" />
            </el-form-item>
            <el-form-item label="其他费用：" prop="other_money">
              <el-input v-model="form.other_money" type="number" placeholder="请输入" />
            </el-form-item>
          </div>
          <el-form-item label="备注：">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <el-button @click="generate">生成付款单</el-button>
      </div>
    </el-dialog>
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import {getDataInfo,getDataList,setFactorySettlement} from '@/api/finance'
export default {
  name: 'GenerateOrder',
  data() {
    return {
      dialogVisible: false,
      list: [],
      size: 10,
      page: 1,
      total: 0,
      ownerName: '',
      loading: true,
      notIds: false,
      checkId: [],
      form: {
        owner_id: '',
        power_rate: '',
        other_money: '',
        remark: '',
        ids: ''
      },
      rules: {
        power_rate: [{ required: true, message: '请输入电费', trigger: 'blur' }]
      },
      processedTowTotal:0,
      processedTotal:0,
      totalPrice:0,
      fromData: []
    }
  },
  watch:{
    checkId(val){
      if(val.length) this.notIds = false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    handelRow(row){
      this.ownerName = row.owner_name
      this.form.owner_id = row.owner_id
      this.generateForm(row.owner_id)
    },
    handelDate(time){
      return time.slice(0,-9)
    },
    // 列表
    async getDataList(){
      const params = {
        page: this.page,
        size: this.size,
        filters: {},
        sorts: {}
      }
      const {code,data} = await getDataList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handelCheck(id) {
      if (this.checkId.indexOf(id) === -1) {
        this.checkId.push(id)
      } else {
        var index = this.checkId.indexOf(id)
        this.checkId.splice(index, 1)
      }
    },
    // 付款详情
    async generateForm(id) {
      this.loading = true
      const {code,data} = await getDataInfo({id})
      if(code===0){
        this.fromData = data
        data.forEach(i=>{
          this.processedTowTotal += i.processed_two
          this.processedTotal += i.processed
          this.totalPrice += i.processed_money_count
        })
        this.loading = false
        this.dialogVisible = true
      }
    },
    initForm(){
      this.dialogVisible = false
      this.form = {
        owner_id: '',
        power_rate: '',
        other_money: '',
        remark: '',
        ids: ''
      }
      this.processedTowTotal = 0
      this.processedTotal = 0
      this.totalPrice = 0
      this.checkId = []
      this.ownerName = ''
    },
    generate() {
      if(!this.checkId.length) return this.notIds = true
      this.$refs['form'].validate(async value => {
        if(value){
          this.form.ids = this.checkId.join(',')
          this.form.power_rate = parseInt(this.form.power_rate)
          for(const k in this.form){
            if(!this.form[k]) delete this.form[k]
          }
          const {code} = await setFactorySettlement(this.form)
          if(code===0){
            this.$message({
              type:'success',
              message:'生成付款单成功'
            })
            this.getDataList()
            this.initForm()
          }
        }
      })

    },
    handleCurrentChange(val) {
      this.page = val
    }
  }
}
</script>
<style lang="scss">
.generate-order{
  p{
    font-size: 15px;
  }
  .dialog-bottom{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .el-form{
      width: 67%;
      .el-input__inner{
        height: 35px;
        line-height: 35px;
      }
      .row2{
        display: flex;
        .el-input__inner{
          padding-right: 0;
        }
        .el-form-item:last-child{
          padding-left: 30px;
        }
      }
      .el-form-item{
        margin-bottom: 16px;
      }
      .el-form-item:last-child{
        margin-bottom: 0;
      }
      .el-form-item__label{
        font-size: 14px;
      }
    }
    .el-button{
      width: 204px;
      height: 68px;
      background-color: #3954B3;
      color: #fff;
      font-size: 16px;
      padding: 0;
      box-shadow: 0px 0px 11px 1px rgba(153,153,153,0.2400);
      border-radius: 8px;
    }
  }
  .list{
    padding-top: 10px;
    .item{
      color: #333333;
      display: inline-flex;
      flex-direction: column;
      line-height: 28px;
      .el-button{
        margin: 0;
        color: #3954B3;
        padding: 5px;
      }
    }
  }
  .el-dialog {
    .el-dialog__body{
      padding-top: 0;
    }
  }
  .table{
    background-color: #F5F6FA;
    font-size: 15px;
    border-radius: 4px;
    padding: 10px;
    .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #3954B3;
      border-color: #3954B3;
    }
    .details{
      cursor: pointer;
    }
    ul{
      overflow-y: scroll;
      max-height: 156px;
    }
    li,.header{
      display: flex;
      justify-content: space-between;
      padding-bottom: 15px;
      span:not(:first-child,:last-child,.data){
        flex: 1;
      }
      &>span:first-child,.el-checkbox{
        width: 12%;
        text-align: center;
        padding-right: 20px;
      }
      &>span:last-child{
        width: 10%;
      }
      .data{
        width: 42%;
      }
    }
  }
}
</style>

