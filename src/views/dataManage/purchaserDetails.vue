<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="details main-box">
    <div class="header">
      <ul>
        <li><span>购买方</span><span>{{ info.username }}</span></li>
        <li><span>20000W设备数量</span><span>{{ info.w2 }} (台)</span></li>
        <li><span>30000W设备数量</span><span>{{ info.w3 }} (台)</span></li>
        <li><span>40000W设备数量</span><span>{{ info.w4 }} (台)</span></li>
        <li><span>待结算产量</span><span v-convert="info.need_set"></span></li>
      </ul>
      <el-button @click="drawer = true">点 击 结 算</el-button>
    </div>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="factory_name" label="铺设方" />
        <el-table-column label="设备数量">
          <template slot-scope="scope">{{ scope.row.equipment_count }}台</template>
        </el-table-column>
        <el-table-column prop="equipment_proportion" label="设备占比" />
        <el-table-column label="小件结算单价">
          <template slot-scope="scope">{{ scope.row.price }}（元）</template>
        </el-table-column>
        <el-table-column label="大件结算单价">
          <template slot-scope="scope">{{ scope.row.price_two }}（元）</template>
        </el-table-column>
        <el-table-column label="小件待结算产量">
          <template slot-scope="scope">
            <span v-convert="scope.row.processed_need"></span>
          </template>
        </el-table-column>
        <el-table-column label="大件待结算产量">
          <template slot-scope="scope">
            <span v-convert="scope.row.processed_two_need"></span>
          </template>
        </el-table-column>
        <el-table-column label="待结算产量" width="130">
          <template slot-scope="scope">
            <span v-convert="scope.row.factory_need_set"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer class="drawer" :visible.sync="drawer" :with-header="false" size="820px" @open="handleOpenDrawer" @close="handleCloseDrawer">
      <p>结算</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="选择结算月份" prop="month">
          <el-date-picker v-model="form.month" :disabled="showPicker" type="month" placeholder="选择月份" @change="changeDate" />
        </el-form-item>
        <el-form-item label="当前产量">
          <span class="right-text" v-convert="all_count"></span>
        </el-form-item>
        <el-form-item label="选择扣除岗位" prop="post_ids">
          <el-select v-model="totalArr" multiple placeholder="选择岗位" @visible-change="visible" @remove-tag="removeTag">
            <el-option v-for="(item, index) in postList" :key="item.id" :value="index" :label="item.post_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="扣除薪资">
          <el-input :value="totalSalary" readonly>
            <span slot="suffix" style="color:#333;padding-right:10px">元</span>
          </el-input>
        </el-form-item>
        <el-form-item label="服务费">
          <span class="right-text">7%</span>
        </el-form-item>
        <el-form-item label="总金额">
          <div class="right-box">
            <span class="right-text">(小件结算产量*设备占比*小件结算单价)+(大件结算产量*设备占比*大件结算单价)</span>
            <div v-for="item in monthDate" :key="item.id" class="price-box">
              <div>
                <span class="right-text">{{ item.processed_count<1000?item.processed_count+'kg':item.processed_count/1000+'吨' }}*{{ item.equipment_proportion }}*{{ item.price }}元</span>
                <span style="padding-left: 20px;color:#3954B3" class="right-text">¥{{ item.total_money }}</span>
              </div>
              +
              <div>
                <span class="right-text">{{ item.processed_two_count<1000?item.processed_two_count+'kg':item.processed_two_count/1000+'吨' }}*{{ item.equipment_proportion }}*{{ item.price_two }}元</span>
                <span style="padding-left: 20px;color:#3954B3" class="right-text">¥{{ item.total_two_money }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="结算金额">
          <div class="right-box">
            <span class="right-text">总金额-（总金额*服务费）-人工费用</span>
            <div>
              <span class="right-text" style="display: block;">¥{{ totalAmount }}-（{{ totalAmount }}*7%）-{{ totalSalary }}</span>
              <span style="color:#3954B3" class="right-text">¥{{ tofixed(totalAmount - (totalAmount * 0.07 ) - totalSalary) }}</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="initForm(), drawer = false">取 消</el-button>
        <el-button style="margin-left: 40px" type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getSettlementInfo, getDataBymonth, setSettlement } from '@/api/settlement'
import { getPostList } from '@/api/public'
export default {
  data() {
    return {
      drawer: false,
      loading: true,
      totalSalary: 0, // 扣除薪资
      totalArr: [],
      showPicker: true,
      postList: [],
      monthDate: {},
      all_count: '',
      list: [],
      ids: [],
      info: {},
      totalAmount: 0, // 总金额
      settlement_price: 0, // 结算金额
      form: {
        month: '',
        buy_user_id: '',
        price: '',
        settlement_price: '',
        server_price: '',
        labor_price: '',
        post_ids: []
      },
      rules: {
        month: [{ required: true, message: '请选择结算月份', trigger: 'blur' }],
        post_ids: [{ required: true, message: '请选择扣除岗位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.info = this.$route.query.info
    this.getSettlementInfo()
    this.getPostList()
  },
  methods: {
    tofixed(num) {
      return num.toFixed(2)
    },
    initForm() {
      this.$refs['form'].resetFields()
      this.form = {
        month: '',
        buy_user_id: '',
        price: '',
        settlement_price: '',
        server_price: '',
        labor_price: '',
        post_ids: []
      }
      this.totalSalary = 0
      this.totalArr = []
      this.monthDate = {}
      this.totalAmount = 0
      this.all_count = 0
      this.settlement_price = 0
    },
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const params = { ...this.form }
          params.month = params.month.getTime().toString().slice(0, -3)
          params.buy_user_id = this.info.id
          params.price = this.totalAmount
          params.settlement_price = (this.totalAmount - (this.totalAmount * 0.07) - this.totalSalary).toFixed(2)
          params.server_price = (this.totalAmount * 0.07).toFixed(2)
          params.labor_price = this.totalSalary
          const { code } = await setSettlement(params)
          if (code === 0) {
            this.$message({
              type: 'success',
              message: '结算成功'
            })
            this.initForm()
            this.drawer = false
          }
        }
      })
    },
    visible(e) {
      if (e === false && this.totalArr.length) {
        this.totalArr.forEach(i => {
          this.totalSalary += this.postList[i].salary * 1
          this.form.post_ids.push(this.postList[i].id)
        })
      } else {
        this.totalSalary = 0
        this.form.post_ids = []
      }
    },
    removeTag(e) {
      this.totalSalary = (this.totalSalary - this.postList[e].salary * 1).toFixed(2)
      this.form.post_ids.splice(e, 1)
    },
    // 月份选择
    changeDate(time) {
      time && this.getDataBymonth(time.getTime().toString().slice(0, -3))
    },
    // 月份产量列表
    async getDataBymonth(time) {
      const { code, data } = await getDataBymonth({ month: time, ids: this.ids, buy_user_id: this.info.id })
      if (code === 0) {
        if (data.all_count === 0) {
          const h = this.$createElement
          this.$notify({
            title: '提示',
            duration: 1000,
            message: h('i', { style: 'color: red' }, '当月没有可结算的产量')
          })
          this.initForm()
          return
        }
        this.all_count = data.all_count
        delete data.all_count
        let total = 0
        for (const k in data) {
          data[k].total_money = (data[k].processed_count * (data[k].equipment_proportion.slice(0, -1) / 100).toFixed(4) * data[k].price).toFixed(2)
          data[k].total_two_money = (data[k].processed_two_count * (data[k].equipment_proportion.slice(0, -1) / 100).toFixed(4) * data[k].price_two).toFixed(2)
          total += (data[k].total_money * 1) + (data[k].total_two_money * 1)
        }
        this.totalAmount = total.toFixed(2)
        this.monthDate = data
      }
    },
    handleOpenDrawer() {
      this.$nextTick(() => {
        this.showPicker = false
      })
    },
    handleCloseDrawer() {
      this.showPicker = true
    },
    // 岗位列表
    async getPostList() {
      const { code, data } = await getPostList()
      if (code === 0) {
        this.postList = data
      }
    },
    // 产量列表
    async getSettlementInfo() {
      const { code, data } = await getSettlementInfo({ id: this.info.id })
      if (code === 0) {
        this.loading = false
        this.list = data
        const ids = []
        data.forEach(i => {
          ids.push(i.factory_user_id)
        })
        this.ids = ids.toString()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.details {
  .header{
    display: flex;
    margin-bottom: 30px;
    ul{
      width: 80%;
      margin-right: 20px;
      padding: 0 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0px 0px 11px 1px rgba(153, 153, 153, 0.24);
      border-radius: 8px;
      li{
        color: #333;
        display: flex;
        flex-direction: column;
        span+span{
          padding-top: 10px;
        }
      }
      & li:not(:first-child){
        text-align: end;
      }
    }
    .el-button{
      width: 304px;
      height: 98px;
      color: #fff;
      font-size: 24px;
      background: #3954B3;
      box-shadow: 0px 0px 11px 1px rgba(153, 153, 153, 0.24);
      border-radius: 8px;
    }
  }
  .drawer{
    p{
      font-size: 20px;
      padding-bottom: 10px;
    }
  }
  .right-box{
    display: flex;
    flex-direction: column;
    .price-box{
      display: flex;
      & div:last-child{
        margin-left: 20px;
      }
      & div:first-child{
        margin-right: 20px;
      }
    }
  }
  .right-text{
    font-size:15px;
    font-weight:500;
    color: #333;
  }
  .dialog-footer {
    margin-top: 150px;
  }
}
</style>
<style lang="scss">
.drawer{
  .el-drawer__body{
    padding: 0 32px;
  }
  .el-input{
    width: 274px;
  }
  .el-form-item__label{
    padding: 0 20px 0 0;
  }
}
.el-month-table td.today .cell{
    color: #606266;
    font-weight: 400;
}
</style>
