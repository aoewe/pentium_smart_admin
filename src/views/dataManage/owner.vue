<template>
  <div v-loading="loading" class="owner main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="username" label="业主方" min-width="200" />
        <el-table-column label="总产量" min-width="200" >
          <template slot-scope="scope">
            <span v-convert="scope.row.processed_count"></span>
          </template>
        </el-table-column>
        <el-table-column label="大件产量" min-width="200" >
          <template slot-scope="scope">
            <span v-convert="scope.row.processed_two"></span>
          </template>
        </el-table-column>
        <el-table-column label="小件产量" min-width="200" >
          <template slot-scope="scope">
            <span v-convert="scope.row.processed"></span>
          </template>
        </el-table-column>
        <el-table-column label="待确认产量" min-width="200" >
          <template slot-scope="scope">
            <span v-convert="scope.row.need_check"></span>
          </template>
        </el-table-column>
        <el-table-column label="待结算产量" min-width="200" >
          <template slot-scope="scope">
            <span v-convert="scope.row.need_set"></span>
          </template>
        </el-table-column>
        <el-table-column label="已结算产量" min-width="200">
          <template slot-scope="scope">
            <span v-convert="scope.row.seted"></span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button style="padding:0;" type="text" @click="handelRow(scope.row)">结算</el-button>
            <el-button style="padding:0;" type="text" @click="details(scope.row.id)">结算日志</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- 结算 -->
    <el-drawer class="drawer" :visible.sync="drawer" :with-header="false" size="600px" @open="handleOpenDrawer" @close="handleCloseDrawer">
      <p>结算</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="选择结算时间" prop="date">
           <el-date-picker
            size="small"
            v-model="form.date"
            :disabled="showPicker"
            @change="changeFilterDate"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
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
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { ownerDataList } from '@/api/production'
import { getOwnerDataBydate, ownerSettlement } from '@/api/settlement'
export default {
  name: 'Owner',
  data() {
    return {
      list: [],
      page: 1,
      size: 10,
      total: 0,
      loading: true,
      drawer: false,
      loading: true,
      showPicker: true,
      monthDate: {},
      ownerId: '',
      info: {
        price: '',
        price_two: '',
      },
      form: {
        date: ''
      },
      rules: {
        date: [{ required: true, message: '请选择结算时间', trigger: 'blur' }]
      }
    }
  },
  created(){
    this.getOwnerDataList()
  },
  methods: {
    handleOpenDrawer() {
      this.$nextTick(() => {
        this.showPicker = false
      })
    },
    handleCloseDrawer() {
      this.showPicker = true
    },
    // 月份选择
    changeFilterDate(time) {
      time && this.getOwnerDataBydate([time[0].getTime().toString().slice(0,-3), time[1].getTime().toString().slice(0,-3)])
    },
    // 月份产量列表
    async getOwnerDataBydate(time) {
      const { code, data } = await getOwnerDataBydate({ date_begin: time[0],date_end: time[1], id: this.ownerId })
      if (code === 0) {
        if (data.processed === 0 && data.processed_two === 0) {
          const h = this.$createElement
          this.$notify({
            title: '提示',
            duration: 1000,
            message: h('i', { style: 'color: red' }, '当前时间段没有可结算的产量')
          })
          this.initForm()
          return
        }
        this.monthDate = data
      }
    },
    tofixed(num) {
      return num.toFixed(2)
    },
    initForm() {
      this.$refs['form'].resetFields()
      this.form = {
        date: ''
      }
      this.monthDate = {}
    },
    // 结算
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const params = {}
          params.id = this.ownerId
          params.date_begin = this.form.date[0].getTime().toString().slice(0,-3)
          params.date_end = this.form.date[1].getTime().toString().slice(0,-3)
          const { code } = await ownerSettlement(params)
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
    handelRow(row) {
      if(row.need_set==0){
        const h = this.$createElement
        this.$notify({
          title: '提示',
          duration: 1000,
          message: h('i', { style: 'color: red' }, '暂无可结算产量')
        })
        return
      }
      this.ownerId = row.id
      this.info.price = row.price
      this.info.price_two = row.price_two
      this.drawer = true
      // this.$router.push({ path: './factoryDetails', query: { info: row }})
    },
    details(id) {
      // this.$router.push({ path: './settlementList', query: { id, type: 1 }})
      this.$router.push({ path: '../financeManage/factory/settlementLog', query: { oid:id }})
    },
    // 列表
    async getOwnerDataList(){
      const params = {
        filters: {},
        sorts: {},
        size: this.size,
        page: this.page
      }
      const {code,data} = await ownerDataList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val){
      this.loading = true
      this.page = val
      this.getOwnerDataList()
    }
  }
}
</script>
<style lang="scss">
.owner{
  .list{
    padding-top: 10px;
  }
}
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
  .dialog-footer {
    margin-top: 150px;
  }
}
.el-month-table td.today .cell{
    color: #606266;
    font-weight: 400;
}
</style>