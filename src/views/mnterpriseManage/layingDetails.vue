<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="laying-details main-box">
    <!-- <div class="equipment-info">
      <div>
        <span>企业名称：{{ rowData.username }}</span
        ><span>企业属性：铺设方</span>
      </div>
      <div class="preview">
        <span>企业地址：{{ rowData.address }}</span>
        <span>营业执照：<u style="cursor: pointer" @click="showPreview(rowData.license)">点击查看</u></span>
      </div>
      <div>
        <span>联系人：{{ rowData.username }}</span
        ><span>联系方式：{{ rowData.mobile }}</span>
      </div>
      <div>
        <span>设备数量：{{ rowData.equipment_count }}台</span><span>企业切割总量：{{ rowData.processed_count }}（吨）</span>
      </div>
      <div>
        切割单价：大件{{ rowData.price_two }}元/吨<i style="width: 30px; display: inline-block"/>小件{{ rowData.price }}元/吨
      </div>
    </div> -->
    <div class="table">
      <el-table :data="rowData.equipment_list" style="width: 100%" @cell-click="handelRow">
        <el-table-column prop="name" label="设备简称" min-width="200" />
        <el-table-column prop="number" label="设备编号" min-width="200" />
        <el-table-column label="设备功率" min-width="200">
          <template slot-scope="props">
            {{ props.row.type + '0000W' }}
          </template>
        </el-table-column>
        <el-table-column prop="buy_user_name" label="购买方" min-width="300" />
        <el-table-column prop="create_time" label="铺设日期" min-width="250" />
        <el-table-column label="设备操作员" min-width="300">
          <template slot-scope="scopes">
            <div v-if="scopes.row.operator_info && scopes.row.operator_info.length > 0" @click="(operator = scopes.row.id), editOperator(scopes.row.operator_info)">
              <span v-for="item in scopes.row.operator_info" :key="item.id" class="operator-item">{{ item.username }}</span>
            </div>
            <el-button v-else style="color: #3954b3;font-size: 18px;text-decoration: underline;padding: 0;" type="text" @click=";(dialogVisible = true), (operator = scopes.row.id)">
              添加操作员
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="200">
          <template slot-scope="props">
            <span v-if="props.row.status === 0" style="color: #01bb00">空闲</span>
            <span v-if="props.row.status === 1" style="color: #3954b3">工作中</span>
            <span v-if="props.row.status === 2" style="color: #ff5858">故障</span>
            <span v-if="props.row.status === 3" style="color: #ffa238">维修中</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="120px">
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
                <el-button slot="reference" style="color: #3954B3;font-size: 18px;" type="text" size="small" @click="changeRow(scope.row)">修改状态</el-button>
              </el-popover>
            </template>
          </el-table-column> -->
      </el-table>
    </div>
    <el-image-viewer v-if="license" :on-close="()=>{license=false}" :url-list="srcList" />
    <!-- 添加操作员 -->
    <el-dialog :visible.sync="dialogVisible" width="488px" :before-close="handleClose">
      <div class="set-operator">
        <p>编辑操作员</p>
        <div class="input"><span>手机号</span><el-input v-model="operatorValue" maxlength="11" placeholder="请输入操作员手机号" /></div>
        <ul class="operators">
          <li v-for="(item, index) in operatorArr" :key="index">
            <el-input v-model="item.username" :disabled="item.id ? true : false" placeholder="姓名" />
            <el-input v-model="item.mobile" disabled maxlength="11" placeholder="手机号" />
            <div class="btn">
              <el-button v-if="!item.id" type="success" icon="el-icon-check" circle @click="addOperator(item,index)" />
              <el-button type="warning" icon="el-icon-close" circle @click="delOperator(index)" />
            </div>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="initOperatorArr()">取 消</el-button>
          <el-button type="primary" @click="submitOperator()">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getFactoryEquipmentInfo,setOperator } from '@/api/equipment'
import { findUser, editUser } from '@/api/user'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'LayingDetails',
  components: { ElImageViewer },
  data() {
    return {
      operatorValue: '',
      operatorArr: [],
      operator: '',
      dialogVisible: false,
      license: false,
      visible: false,
      rules: {
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      list: [],
      rowData: [],
      loading: true,
      total: 0,
      rowId: '',
      size: 10,
      page: 1,
      srcList: [],
      form: {
        status: 0,
        id: ''
      }
    }
  },
  watch: {
    async operatorValue(val) {
      const h = this.$createElement
      if (val.length === 11) {
        if (
          !/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/.test(
            val
          )
        ) {
          this.$notify({
            title: '提示',
            duration: 1500,
            message: h('span', { style: 'color: red' }, '手机号码格式错误')
          })
          return
        }
        const { data } = await findUser({ mobile: val })
        if (data.code === 200) {
          this.operatorArr.push({ username: '', mobile: val })
          this.operatorValue = ''
        } else {
          this.operatorArr.push({
            username: data.username,
            mobile: val,
            id: data.id
          })
          this.operatorValue = ''
        }
      }
    }
  },
  created() {
    this.rowId = this.$route.query.id
    this.getFactoryEquipmentInfo()
  },
  methods: {
    handelRow(row,column){
      if (column.label === '设备操作员') return
      this.$router.push({ path: '../dataManage/form', query: { eid: row.id }})
    },
    imgError() {
      this.rowData.license = ''
    },
    showPreview(e) {
      const that = this
      const imgres = new Image()
      imgres.src = e
      imgres.onload = function () {
        that.srcList[0] = e
        that.license = true
      }
      imgres.onerror = function () {
        that.$notify({
          title: '提示',
          message: '未上传营业执照/加载失败',
          type: 'warning',
          duration: 1000
        })
      }
    },
    editOperator(info) {
      this.operatorArr = [...info]
      this.dialogVisible = true
    },
    initOperatorArr() {
      this.operatorArr = []
      this.operatorValue = ''
      this.operator = ''
      this.dialogVisible = false
    },
    async submitOperator() {
      let operator = []
      this.operatorArr.forEach(i => {
        operator.push(i.id)
      })
      operator = operator.join(',')
      const { code } = await setOperator({ id: this.operator, operator })
      if (code === 0) {
        this.$message({
          type: 'success',
          message: '绑定成功'
        })
        this.getFactoryEquipmentInfo(this.rowId)
        this.initOperatorArr()
      }
    },
    delOperator(index) {
      this.operatorArr.splice(index, 1)
    },
    async addOperator(row, index) {
      const { code, data } = await editUser({
        mobile: row.mobile,
        username: row.username,
        user_type: 5
      })
      if (code === 0) {
        this.$set(this.operatorArr[index], 'id', data.id)
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.initOperatorArr()
    },
    changeRow(row) {
      this.form.status = row.status
      this.form.id = row.id
    },
    cancel() {
      document.body.click()
    },
    handelStatus() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const { code } = await setEquipmentStatus(this.form)
          if (code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.getFactoryEquipmentInfo(this.rowId)
            document.body.click()
            this.$refs['form'].resetFields()
          }
        }
      })
    },
    async getFactoryEquipmentInfo() {
      this.showmodel = true
      const res = await getFactoryEquipmentInfo({ id:this.rowId })
      if (res.code === 0) {
        this.rowData = res.data
        this.loading = false
        this.showmodel = false
      }
    }
  }
}
</script>
<style lang="scss">
.laying-details {
  .set-operator{
    .input{
      margin-top: 16px;
      display: flex;
      align-items: center;
      color: #1d1d1d;
      span{
        font-size: 15px;
        padding-right: 20px;
        font-weight: bold;
      }
      .el-input{
        width: 85%;
      }
    }
    p{
      padding: 0;
      margin: 0;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .operators{
      margin-bottom: 30px;
      li{
        display: flex;
        margin-top: 28px;
        & .el-input:first-child{
          width: 210px;
        }
        .el-input+.el-input{
          margin-left: 20px;
        }
        .btn{
          min-width: 90px;
          display: flex;
          justify-content: flex-end;
          margin-left: 10px;
        }
      }
    }
  }
  .operator-item{
    text-decoration: underline;
    cursor: pointer;
    &::after{
      content: '，';
    }
  }
  .operator-item:last-child{
    &::after{
      content: '';
    }
  }
   .table{
    .el-table{
      font-size: 18px;
      &::before{
        background-color: #fff;
      }
      td,th.is-leaf{
        border: none;
      }
      color: #333;
      thead{
        color: #333;
      }
    }
  }
  .equipment-info{
    width: 900px;
    color: #333333;
    padding-bottom: 20px;
    padding-left: 10px;
    &>div{
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      width: 100%;
      span+span{
        width: 35%;
      }
    }
    &>div:last-child{
      color: #3954B3;
      display: block;
    }
  }
  .el-drawer__header{
    padding-left: 60px;
    font-size: 22px;
    color: #333;
    margin-bottom: 0;
    font-weight: bold;
    .el-drawer__close-btn{
      position: fixed;
      right: 20px;
      top: 10px;
      font-size: 30px;
    }
  }
}
</style>
