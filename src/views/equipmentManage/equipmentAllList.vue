<template>
  <div
    v-loading="loading"
    class="all-list main-box"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="select">
      <el-input size="small" placeholder="请输入设备简称" v-model="name" style="margin-right:3px">
        <template slot="prepend">简称</template>
      </el-input>
      <el-input size="small" placeholder="请输入设备编号" v-model="number" style="margin-right:3px">
        <template slot="prepend">编号</template>
      </el-input>
      <el-select size="small" clearable placeholder="请选择设备铺设方" v-model="factory_user_id" style="margin-right:3px">
        <el-option v-for="item in factoryList" :key="item.id" :value="item.id" :label="item.username" />
      </el-select>
      <el-select size="small" clearable placeholder="请选择设备购买方" v-model="buy_user_id" style="margin-right:3px">
        <el-option v-for="item in buyList" :key="item.id" :value="item.id" :label="item.username" />
      </el-select>
      <el-select size="small" clearable placeholder="请选择设备功率" v-model="type" style="margin-right: 30px">
        <el-option :value="2" label="20000W" />
        <el-option :value="3" label="30000W" />
        <el-option :value="4" label="40000W" />
      </el-select>
      <el-button size="small" @click="loading=true,getEquipmentAllList()">查 询</el-button>
      <el-button size="small" @click="type='',number='',name='',factory_user_id='',buy_user_id='',getEquipmentAllList()">重 置</el-button>
    </div>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="设备信息" min-width="180">
          <template slot-scope="scope">
            <div class="item">
              <span>简称：{{ scope.row.name || '- -' }}</span>
              <span>编号：{{ scope.row.number || '- -' }}</span>
              <span>型号：{{ scope.row.model_name || '- -' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参数" min-width="200">
          <template slot-scope="scope">
            <div class="item">
              <span>
                功率：{{ scope.row.type }}0000W【
                <span v-if="scope.row.status===0" style="color:#01BB00">空闲</span>
                <span v-if="scope.row.status===1" style="color:#3954B3">工作中</span>
                <span v-if="scope.row.status===2" style="color:#FF5858">故障</span>
                <span v-if="scope.row.status===3" style="color:#FFA238">维修中</span>
                】
              </span>
              <span>铺设时间：{{handelDate(scope.row.create_time)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="设备铺设/权属商家" min-width="300">
          <template slot-scope="scope">
            <div class="item">
              <span>铺设：{{scope.row.factory_user_name}}</span>
              <span>地址：{{scope.row.factory_user_address}}</span>
              <el-popover placement="top" width="380">
                <div>
                  <div style="font-size: 16px;font-weight: 600;margin-bottom: 20px;">修改权属</div>
                  <el-form ref="form" :rules="rules" :model="form">
                    <el-form-item label="状态" prop="buy_user_id">
                      <el-select style="width: 300px;" v-model="scope.row.buy_user_id">
                        <el-option v-for="item in buyList" :key="item.id" :value="item.id" :label="item.username" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" @click="cancel()">取消</el-button>
                    <el-button style="background-color:#3954B3;border-color:#3954B3" type="primary" size="mini" @click="handelStatus(scope.row.id)">确定</el-button>
                  </div>
                </div>
                <span slot="reference" style="color:#3954B3;cursor: pointer;" type="text" @click="changeRow(scope.row)">权属：{{scope.row.buy_user_name}}</span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总产量内容" min-width="250">
          <template slot-scope="scope">
            <div class="item">
              <span
                >{{ `大件：${scope.row.processed_two<1000?scope.row.processed_two+'kg':scope.row.processed_two/1000+'吨'}` }}{{ `\xa0\xa0\xa0小件：${scope.row.processed<1000?scope.row.processed+'kg':scope.row.processed/1000+'吨'}` }}</span
              >
              <span
                >{{ `板材：${scope.row.board_nub}张` }}</span
              >
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="财务信息" min-width="200">
          <template slot-scope="scope">
            <div class="item">
              <u>已结算：{{scope.row.seted_money || 0}}元</u>
              <u>待结算：{{scope.row.checked || 0}}元</u>
              <u>待确认：{{scope.row.need_check || 0}}元</u>
            </div>
          </template>
        </el-table-column> -->
         <el-table-column label="设备状态" fixed="right" width="200">
          <template slot-scope="scope">
            <el-popover placement="top" width="300">
              <div>
                <div style="font-size: 16px;font-weight: 600;margin-bottom: 20px;">修改状态</div>
                <el-form ref="form" :rules="rules" :model="form">
                  <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status">
                      <el-option :value="0" label="空闲" />
                      <el-option :value="1" label="工作中" />
                      <el-option :value="2" label="故障" />
                      <el-option :value="3" label="维修中" />
                    </el-select>
                  </el-form-item>
                </el-form>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" @click="cancel()">取消</el-button>
                  <el-button style="background-color:#3954B3;border-color:#3954B3" type="primary" size="mini" @click="handelStatus(scope.row.id)">确定</el-button>
                </div>
              </div>
              <el-button slot="reference" style="color:#3954B3" type="text" @click="changeRow(scope.row,1)">修改</el-button>
            </el-popover>
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
import { getEquipmentAllList,setEquipmentStatus,setEquipmentBuyUser } from '@/api/equipment'
import { getUserByType } from '@/api/public'
export default {
  name: 'EquipmentAllList',
  data() {
    return {
      list: [],
      name: '',
      number: '',
      type: '',
      factory_user_id:'',
      buy_user_id:'',
      size: 5,
      page: 1,
      total: 0,
      loading: true,
      factoryList:[],
      buyList:[],
      form: {
        status: 0,
        buy_user_id:'',
        id: ''
      },
      rules: {
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        buy_user_id: [{ required: true, message: '请选择设备权属', trigger: 'blur' }]
      }
    }
  },
  async created() {
    await this.getEquipmentAllList()
    this.buyList = await this.changeType(4)
    this.factoryList = await this.changeType(3)
  },
  methods: {
    async changeType(user_type){
      const {code,data} = await getUserByType({user_type})
      if(code===0){
        return data
      }
    },
    changeRow(row,type) {
      this.form.id = row.id
      if(type){
        this.form.status = row.status
        delete this.form.buy_user_id
      }else{
        this.form.buy_user_id = row.buy_user_id
        delete this.form.status
      }
    },
    cancel() {
      document.body.click()
    },
    handelDate(date){
      return date.slice(0,-9)
    },
    handelStatus() {
      this.$refs['form'].validate(async value => {
        if (value) {
          let params = JSON.parse(JSON.stringify(this.form))
          const { code } = params.buy_user_id ? await setEquipmentBuyUser(params) : await setEquipmentStatus(params)
          if (code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.getEquipmentAllList()
            document.body.click()
            this.$refs['form'].resetFields()
          }
        }
      })
    },
    async getEquipmentAllList() {
      const filters = {}
      this.name && (filters.name = this.name)
      this.number && (filters.number = this.number)
      this.type && (filters.type = this.type)
      this.buy_user_id && (filters.buy_user_id = this.buy_user_id)
      this.factory_user_id && (filters.factory_user_id = this.factory_user_id)
      const { code, data } = await getEquipmentAllList({
        page: this.page,
        size: this.size,
        filters,
        sorts: {}
      })
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getEquipmentAllList()
    }
  }
}
</script>
<style lang="scss" scoped>
.all-list {
  .select {
    margin: 5px 0 40px;
    .el-input{
      width: 300px;
    }
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
    padding-bottom: 60px;
    .item {
      color: #333333;
      display: inline-flex;
      flex-direction: column;
      line-height: 28px;
      .el-button {
        margin: 0;
        color: #3954b3;
      }
    }
  }
}
</style>

