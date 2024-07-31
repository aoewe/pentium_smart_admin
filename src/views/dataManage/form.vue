<template>
  <div v-loading="loading" class="production-data-form main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <el-date-picker size="small" v-model="date" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-right: 3px" @change="changeFilterDate" />
      <el-select size="small" v-model="equipment_type" style="margin-right: 3px">
        <el-option value="2" label="20000W" />
        <el-option value="3" label="30000W" />
        <el-option value="4" label="40000W" />
      </el-select>
      <el-select size="small" v-model="check_status" style="margin-right: 30px">
        <el-option value="0" label="待确认" />
        <el-option value="1" label="已确认" />
        <el-option value="2" label="待修改" />
      </el-select>
      <el-button size="small" @click="handelQuery()">查 询</el-button>
      <el-button size="small" @click="reset()">重 置</el-button>
    </div>
    <div class="list">
      <!-- <el-table :data="list" style="width: 100%">
        <el-table-column prop="factory_user_name" label="铺设方" />
        <el-table-column prop="date" label="日期">
          <template slot-scope="props">
            <span>{{ formatDate(props.row.date) }}</span>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="20">
          <template slot-scope="props">
            <div class="expand-box">
              <span v-for="item in props.row.info" :key="item.id">{{ item.equipment_nub }}：小件产量{{ item.processed }}(吨)，大件产量{{ item.processed_two }}(吨)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="各设备产量">
          <template slot-scope="props">
            <span>{{ props.row.processed_count }}（吨）</span>
          </template>
        </el-table-column>
        <el-table-column label="总原材料">
          <template slot-scope="props">
            <span>{{ props.row.raw_count }}（吨）</span>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" width="150px">
          <template slot-scope="props">
            <el-button v-if="props.row.status === 2" icon="el-icon-edit" style="padding:0;font-size:15px;font-weight:bold" type="text" @click="editRow(props.row)">待修改</el-button>
            <span v-else :style="{'color':props.row.status === 0 ? '#EC2C26' :props.row.status === 1 ? '#67c23a':'#ddbb7c'}">{{ props.row.status === 0?'待确认':props.row.status === 1 ? '已确认' : '其他' }}</span>
          </template>
        </el-table-column>
      </el-table> -->
      <el-table :data="list" style="width: 100%">
        <el-table-column label="设备信息" min-width="200">
          <template slot-scope="props">
            <div class="item">
              <span>简称：{{props.row.equipment_name}}</span>
              <span>编号：{{props.row.equipment_nub}}</span>
              <span>功率：{{props.row.equipment_type}}0000W</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参数" min-width="250">
          <template slot-scope="props">
            <span>生产时间：{{ props.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备铺设/权属商家" min-width="320">
          <template slot-scope="props">
            <div class="item">
              <span>铺设方：{{props.row.factory_user_name}}</span>
              <span>权属方：{{props.row.buy_user_name}}</span>
              <span>业主方：{{props.row.owner_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="各设备产量" min-width="320">
          <template slot-scope="props">
            <div class="item">
              <span>{{`总原料:${props.row.raw<1000?props.row.raw+'kg':props.row.raw/1000+'吨'}\xa0\xa0\xa0余料:${props.row.wasted<1000?props.row.wasted+'kg':props.row.wasted/1000+'吨'}\xa0\xa0\xa0废料:${props.row.remain<1000?props.row.remain+'kg':props.row.remain/1000+'吨'}`}}</span>
              <span>{{`板材:${props.row.board_nub}张\xa0\xa0\xa0大件:${props.row.processed_two<1000?props.row.processed_two+'kg':props.row.processed_two/1000+'吨'}\xa0\xa0\xa0小件:${props.row.processed<1000?props.row.processed+'kg':props.row.processed/1000+'吨'}`}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="delRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="产量确认" min-width="200">
          <template slot-scope="props">
            <div class="item">
              <u>数据状态:
                <span v-if="props.row.check_status === 2" style="color: #3954B3;cursor: pointer;" @click="editRow(props.row)">待修改</span>
                <span v-else :style="{'color':props.row.check_status === 0 ? '#EC2C26' :props.row.check_status === 1 ? '#67c23a':'#ddbb7c'}">{{ props.row.check_status === 0?'待确认':props.row.check_status === 1 ? '已确认' : '其他' }}</span>
              </u>
              <u>结算状态:
                <span :style="{'color':props.row.set_status === 0 ? '#EC2C26' :props.row.set_status === 1 ? '#67c23a':''}">{{ props.row.set_status === 0?'未结算':props.row.set_status === 1 ? '已结算' : '其他' }}</span>
              </u>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- 修改弹框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px">
        <el-form-item label="选择日期" prop="date">
          <el-date-picker
            :value="editForm.date"
            :readonly="true"
            type="date"
            placeholder="选择日期"
            @change="changeDate"
          />
        </el-form-item>
        <el-form-item label="选择设备企业" prop="factory_user_id">
          <el-input :value="factoryName" :readonly="true" />
        </el-form-item>
        <el-form-item label="生产数据" prop="data">
          <ul class="table">
            <li><span>设备编号</span><span>原料重量</span><span>成品重量</span><span>板材数量</span></li>
            <li v-for="item in editForm.data" :key="item.id">
              <div>{{ item.equipment_nub }}</div>
              <el-input v-model="item.raw" type="number" style="margin-right:20px;padding-right: 0;" />
              <el-input v-model="item.processed" type="number" style="margin-right:20px" />
              <el-input v-model="item.board_nub" type="number" />
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #3954b3; color: #fff" @click="submitEdit">确 定</el-button>
      </span>
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
import { getProductionList,delProduction } from '@/api/production'
import { editProductionData } from '@/api/equipment'
export default {
  name: 'Form',
  data() {
    return {
      dialogVisible: false,
      loading: true,
      editForm: {
        factory_user_id: '',
        date: '',
        data: []
      },
      factoryName: '',
      rules: {
        factory_user_id: [{ required: true, message: '请选择选择设备企业', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        data: [{ required: true, message: '请添加数据', trigger: 'blur' }]
      },
      date: '',
      check_status: '',
      equipment_type: '',
      total: 0,
      size: 5,
      page: 1,
      list: [],
      isCreated:true
    }
  },
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        if(value.eid){
          this.loading = true
          this.isCreated = false
          this.getProductionList()
        }
      }
    }
  },
  computed:{
    eid(){return this.$route.query.eid}
  },
  created() {
    if(this.isCreated){
      this.getProductionList()
    }
  },
  methods: {
    delRow(id){
      // const index =  this.list.findIndex(i=>i.id===id)
      this.$confirm('是否删除改条生产数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code} = await delProduction({id})
          if(code===0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // this.list.splice(index,1)
            this.getProductionList()
          }
        })
    },
    handelQuery(){
      this.loading=true
      this.getProductionList()
    },
    changeFilterDate(time) {
      time && (this.date = [time[0].getTime(), time[1].getTime()])
    },
    formatDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return y + '/' + m + '/' + d
    },
    initForm() {
      this.$refs['editForm'].resetFields()
      this.dialogVisible = false
      this.editForm = {
        factory_user_id: '',
        date: '',
        data: []
      }
    },
    submitEdit() {
      this.$refs['editForm'].validate(async value => {
        const params = { ...this.editForm }
        params.date = params.date.toString().slice(0, -3)
        params.data.forEach(i => {
          i.board_nub = parseInt(i.board_nub)
          delete i.create_time
          delete i.update_time
          delete i.date
          delete i.equipment_type
        })
        if (value) {
          const res = await editProductionData(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.initForm()
          }
        }
      })
    },
    changeDate() {},
    editRow(row) {
      this.dialogVisible = true
      this.editForm.date = row.date
      this.editForm.id = row.id
      this.editForm.factory_user_id = row.factory_user_id
      this.editForm.data = row.info
      this.factoryName = row.factory_user_name
    },
    reset() {
      this.$router.push({ query: {} })
      this.loading = true
      this.date = ''
      this.check_status = ''
      this.equipment_type = ''
      this.getProductionList()
    },
    async getProductionList() {
      const filters = {}
      if(this.eid){
        filters.equipment_id = parseInt(this.eid)
      }
      let date = JSON.parse(JSON.stringify(this.date))
      date && (filters.date=[date[0].toString().slice(0,-3),date[1].toString().slice(0,-3)])
      const check_status = this.check_status
      check_status && (filters.check_status = check_status)
      const equipment_type = this.equipment_type
      equipment_type && (filters.equipment_type = equipment_type)
      const res = await getProductionList({
        filters,
        sorts: {},
        page: this.page,
        size: this.size
      })
      if (res.code === 0) {
        this.list = res.data.list
        this.total = res.data.total
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
.production-data-form {
  .select {
    margin: 5px 0 40px;
    .el-select{
      width: 224px;
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
  .list {
    margin-bottom: 60px;
  }
  .expand-box{
    font-weight: initial;
    font-size: 14px;
    margin: -22px -40px 0;
    background-color: #f5f6fa;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 15px 36px 10px;
    position: relative;
    overflow: hidden;
    &::before{
      content: '';
      z-index: 999;
      top: 5px;
      left: 36px;
      right: 36px;
      position: absolute;
      height: 2px;
      background-color: #fff;
    }
    span{
      display: inline-block;
      padding-right:30px;
      line-height: 30px;
    }
  }
   .table{
    width: 550px;
    li{
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      padding: 10px 40px 10px 24px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      .el-input{
        width: 160px;
        flex: 1;
      }
      div{
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    & li:nth-child(odd){
      background-color: #F3F5F7;
    }
    & li:last-child{
      border-bottom: 1px solid #ccc;
    }
    & li:first-child{
      border: 0;
      background-color: #F3F5F7;
      padding: 0 0 0 24px;
      span{
        flex: 1;
        font-size: 15px;
      }
    }
  }
}
</style>
<style lang="scss">
// element ui
.production-data-form {
  .list{
    .item{
      color: #333333;
      display: inline-flex;
      flex-direction: column;
      line-height: 28px;
    }
  }
  .el-dialog__header{
    display: none;
  }
  .el-table__fixed::before{
    display: none;
  }
  .el-table {
    .el-table__expand-column{
      z-index: 99;
    }
    th,td{
      & .cell{
        padding-left: 40px;
      }
      & .cell:last-child{
        padding-right: 40px;
      }
    }
    .el-table__expanded-cell{
      padding: 0 40px;
    }
    tr{
      margin: 0 40px;
    }
    // tr.el-table__row:hover {
    //   background-color: #f5f6fa;
    //   border-radius: 10px !important;
    //   td {
    //     background-color: #f5f6fa;
    //   }
    // }
  }
  .el-dialog__footer{
    display: flex;
    justify-content: center;
  }
  .el-form{
    .el-input,
    .el-select {
      width: 250px;
    }
  }
  .table{
    .el-input__inner{
      padding-right: 0;
    }
  }
  .el-table_1_column_3 .cell{
    padding-right: 0;
    .el-table__expand-icon{
      color: #000;
    }
  }
}
</style>
