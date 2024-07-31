<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="details main-box">
    <div class="header">
      <ul>
        <li><span>厂商名称</span><span>{{ info.factory_name }}</span></li>
        <li><span>大件结算单价</span><span>{{ info.price_two }} (元)</span></li>
        <li><span>小件结算单价</span><span>{{ info.price }} (元)</span></li>
        <li><span>待结算产量</span><span v-convert="info.need_set"></span></li>
      </ul>
      <el-button @click="drawer = true">点 击 结 算</el-button>
    </div>
    <div class="list">
      <el-table :data="info.equipment_list" style="width: 100%">
        <el-table-column prop="number" label="设备编号" />
        <el-table-column label="设备功率">
          <template slot-scope="scope">{{ scope.row.type+'0000W' }}</template>
        </el-table-column>
        <el-table-column label="待结算产量" width="130">
          <template slot-scope="scope">
            <span v-convert="scope.row.need_set"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer class="drawer" :visible.sync="drawer" :with-header="false" size="600px" @open="handleOpenDrawer" @close="handleCloseDrawer">
      <p>结算</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="选择结算月份" prop="month">
          <el-date-picker v-model="form.month" :disabled="showPicker" type="month" placeholder="选择月份" @change="changeDate" />
        </el-form-item>
        <el-form-item label="大件结算单价">
          <span class="right-text">{{ info.price_two }} 元</span>
        </el-form-item>
        <el-form-item label="大件产量">
          <span class="right-text" v-convert="monthDate.processed_two"></span>
        </el-form-item>
        <el-form-item label="结算金额">
          <span class="right-text" style="color:#3954B3">¥{{ ((monthDate.processed_two * 1) * info.price_two) || '0.00' }} 元</span>
        </el-form-item>
        <el-form-item label="小件结算单价">
          <span class="right-text">{{ info.price }} 元</span>
        </el-form-item>
        <el-form-item label="小件产量">
          <span class="right-text" v-convert="monthDate.processed"></span>
        </el-form-item>
        <el-form-item label="结算金额">
          <span class="right-text" style="color:#3954B3">¥{{ ((monthDate.processed * 1) * info.price ) || '0.00' }} 元</span>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="initForm(),drawer = false">取 消</el-button>
        <el-button style="margin-left: 40px" type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { factorySetInfo, getFactoryDataBymonth, setFactory } from '@/api/settlement'
export default {
  data() {
    return {
      drawer: false,
      loading: true,
      showPicker: true,
      monthDate: {},
      list: [],
      factoryId: '',
      info: {},
      form: {
        month: '',
        factory_user_id: '',
        price: '',
        set_price: '',
        set_price_two: '',
        processed: '',
        processed_two: ''
      },
      rules: {
        month: [{ required: true, message: '请选择结算月份', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.factoryId = this.$route.query.info.id
    this.factorySetInfo()
  },
  methods: {
    tofixed(num) {
      return num.toFixed(2)
    },
    initForm() {
      this.$refs['form'].resetFields()
      this.form = {
        month: '',
        factory_user_id: '',
        price: '',
        set_price: '',
        set_price_two: '',
        processed: '',
        processed_two: ''
      }
      this.totalSalary = 0
      this.monthDate = {}
    },
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const params = { ...this.form }
          params.month = params.month.getTime().toString().slice(0, -3)
          params.factory_user_id = this.factoryId
          params.price = ((this.monthDate.processed_two * 1) * this.info.price_two) + ((this.monthDate.processed * 1) * this.info.price)
          params.set_price = this.info.price
          params.set_price_two = this.info.price_two
          params.processed = this.monthDate.processed
          params.processed_two = this.monthDate.processed_two
          const { code } = await setFactory(params)
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
    // 月份选择
    changeDate(time) {
      time && this.getFactoryDataBymonth(time.getTime().toString().slice(0, -3))
    },
    // 月份产量列表
    async getFactoryDataBymonth(time) {
      const { code, data } = await getFactoryDataBymonth({ month: time, id: this.factoryId })
      if (code === 0) {
        if (data.processed === 0 && data.processed_two === 0) {
          const h = this.$createElement
          this.$notify({
            title: '提示',
            duration: 1000,
            message: h('i', { style: 'color: red' }, '当月没有可结算的产量')
          })
          this.initForm()
          return
        }
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
    // 产量列表
    async factorySetInfo() {
      const { code, data } = await factorySetInfo({ id: this.factoryId })
      if (code === 0) {
        this.loading = false
        this.info = data
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
