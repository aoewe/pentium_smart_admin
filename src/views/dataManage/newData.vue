<template>
  <div class="new-data-box main-box">
    <el-form ref="form" :model="newForm" :rules="rules" label-width="150px">
      <el-form-item label="选择日期" prop="date">
        <el-date-picker
          v-model="newForm.date"
          type="date"
          placeholder="选择日期"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="选择铺设方" prop="factory_user_id">
        <el-select v-model="newForm.factory_user_id" @change="changeFactory">
          <el-option v-for="item in factoryList" :key="item.id" :value="item.id" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="生产数据" prop="data">
        <ul class="table">
          <li>
            <span>设备简称</span>
            <span style="margin-right:20px">原料重量</span>
            <span style="margin-right:20px">大件成品重量</span>
            <span style="margin-right:20px">小件成品重量</span>
            <span style="margin-right:20px">板材数量</span>
            <span style="margin-right:20px">余料重量</span>
            <span style="margin-right:20px">废料重量</span>
            <span style="margin-right:20px">下级业主</span>
          </li>
          <li class="item-li" v-for="(item,index) in newForm.data" :key="item.id">
            <span>{{ item.name || item.equipment_nub }}</span>
            <el-input v-model="item.raw" type="number" placeholder="单位(吨)" style="margin-right:20px" />
            <el-input v-model="item.processed_two" type="number"  placeholder="单位(吨)" style="margin-right:20px" />
            <el-input v-model="item.processed" type="number"  placeholder="单位(吨)" style="margin-right:20px" />
            <el-input v-model="item.board_nub" type="number"  placeholder="单位(张)" style="margin-right:20px" />
            <el-input v-model="item.remain" type="number"  placeholder="单位(吨)" style="margin-right:20px" />
            <el-input v-model="item.wasted" type="number"  placeholder="单位(吨)" style="margin-right:20px" />
            <el-select v-model="item.owner_id">
              <el-option v-for="i in ownerList" :key="i.id" :value="i.id" :label="i.username" />
            </el-select>
            <i @click="deleteItem(index)" class="el-icon-circle-close delete-icon"></i>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <div class="batch">
      <span>批量设置</span>
      <span @click="handelBatch('raw')">原料重量</span>
      <span @click="handelBatch('processed_two')">大件成品重量</span>
      <span @click="handelBatch('processed')">小件成品重量</span>
      <span @click="handelBatch('board_nub')">板材数量</span>
      <span @click="handelBatch('remain')">余料重量</span>
      <span @click="handelBatch('wasted')">废料重量</span>
      <el-input v-model="batchValue" type="number" :placeholder="batchTitle === 'raw' ? '原料重量' : batchTitle === 'processed_two' ? '大件成品重量' : batchTitle === 'processed' ? '小件成品重量' : batchTitle === 'board_nub' ? '板材数量' : batchTitle === 'remain' ? '余料重量' : '废料重量'" />
      <span @click="batchSubmit(batchTitle)">保存</span>
    </div>
    <div class="btn">
      <el-button>取消</el-button>
      <el-button @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script>
import { setProductionData } from '@/api/production'
import { getAllFactory, getEquipmentByFactory, getUserByType } from '@/api/public'
export default {
  name: 'NewData',
  data() {
    return {
      factoryList: [],
      equipmentList: [],
      ownerList: [],
      ownerId: '',
      batchTitle: 'raw',
      batchValue: '',
      newDate: '',
      newForm: {
        factory_user_id: '',
        date: '',
        data: []
      },
      rules: {
        factory_user_id: [
          { required: true, message: '请选择选择设备企业', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        data: [
          { required: true, message: '请添加数据', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAllFactory()
  },
  methods: {
    deleteItem(index){
      this.newForm.data.splice(index,1)
    },
    initForm() {
      this.$refs['form'].resetFields()
      this.ownerList = []
      this.newForm = {
        factory_user_id: '',
        date: '',
        data: []
      }
    },
    handelBatch(e) {
      this.batchTitle = e
    },
    batchSubmit(e) {
      this.newForm.data.forEach(item => {
        item[e] = this.batchValue
      })
      this.batchValue = ''
    },
    async getUserByType(parent_id) {
      const { code, data } = await getUserByType({ parent_id })
      if (code === 0) {
        this.ownerList = data
      }
    },
    changeFactory(id) {
      this.getEquipmentByFactory(id)
      this.getUserByType(id)
    },
    async getEquipmentByFactory(id) {
      const res = await getEquipmentByFactory({ id })
      if (res.code === 0) {
        res.data.forEach(i=>{
          i.equipment_id = i.id
          i.equipment_nub = i.number
          i.equipment_type = i.type
          delete i.buy_user_address
          delete i.buy_user_avatar
          delete i.buy_user_name
          delete i.type
          delete i.number
          delete i.id
        })
        this.$set(this.newForm, 'data', res.data)
        this.newForm.data.forEach((item, index) => {
          this.$set(this.newForm.data[index], 'raw', '')
          this.$set(this.newForm.data[index], 'wasted', '')
          this.$set(this.newForm.data[index], 'remain', '')
          this.$set(this.newForm.data[index], 'board_nub', '')
          this.$set(this.newForm.data[index], 'processed', '')
          this.$set(this.newForm.data[index], 'processed_two', '')
          this.$set(this.newForm.data[index], 'owner_id', '')
          this.$set(this.newForm.data[index], 'factory_user_id', item.buy_user_id)
        })
      }
    },
    async getAllFactory() {
      const res = await getAllFactory({ sorts: {}})
      if (res.code === 0) this.factoryList = res.data
    },
    changeDate(date) {
      const time = date.getTime()
      this.newForm.date = time
      this.newDate = time
    },
    submit() {
      let data = JSON.stringify(this.newForm)
      data = JSON.parse(data)
      const list = data.data
      this.$refs['form'].validate(async value => {
        if (value) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].processed * 1 + list[i].processed_two * 1 + list[i].wasted * 1 + list[i].remain * 1 > list[i].raw * 1) {
              this.$notify({
                title: '提示',
                message: `编号：${list[i].number || list[i].equipment_nub}各产量数据大于原料重量`,
                type: 'error'
              })
              return
            }
            list[i].raw = parseFloat(list[i].raw*1000) || ''
            list[i].processed = parseFloat(list[i].processed*1000) || ''
            list[i].processed_two = parseFloat(list[i].processed_two*1000) || ''
            list[i].board_nub = parseInt(list[i].board_nub) || ''
            list[i].remain = parseFloat(list[i].remain*1000) || 0
            list[i].wasted = parseFloat(list[i].wasted*1000) || 0
            if(!list[i].raw || !list[i].board_nub){
              this.$notify({
                  title: '提示',
                  message: `请选择编号：${list[i].name}设备(原料重量/板材数量)不能为空`,
                  type: 'error'
                })
                return
            }
            if (!list[i].owner_id) {
              delete list[i].owner_id
              // this.$notify({
              //   title: '提示',
              //   message: `请选择编号：${list[i].equipment_nub}设备的下级业主`,
              //   type: 'error'
              // })
              // return
            }
          }
          data.date = data.date.toString().slice(0, -3)
          const res = await setProductionData(data)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.initForm()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.new-data-box {
  padding-top: 36px;
  position: relative;
  .btn {
    position: absolute;
    bottom: 2%;
    left: 50%;
    transform: translateX(-50%);
    button {
      width: 98px;
      height: 40px;
      box-sizing: border-box;
      border: 1px solid #cccccc;
      border-radius: 4px;
      color: #666666;
      &:hover {
        background-color: rgba($color: #999999, $alpha: 0.1);
        color: #666666;
      }
    }
    button + button {
      background-color: #3954b3;
      color: #fff;
      &:hover {
        color: #fff;
        background-color: #4867d4;
      }
    }
  }
  .table{
    width:82%;
    .item-li{
      position: relative;
      .delete-icon{
        position: absolute;
        cursor: pointer;
        right: -35px;
        font-size: 25px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    li{
      display: flex;
      justify-content: space-between;
      padding-right: 60px;
      padding: 10px 35px 10px 24px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      .el-input,.el-select,span{
        flex: 1;
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
      padding: 0 35px 0 24px;
      span:not(:first-child){
        text-align: center;
      }
    }
  }
  .el-input,
  .el-select {
    width: 15vw;
  }
  .batch {
    margin-left: 150px;
    span {
      color: #333;
      font-size: 15px;
      padding-right: 40px;
    }
    span:not(:first-child) {
      color: #3954b3;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
// element ui

.new-data-box {
  .batch {
    margin-bottom: 80px;
    .el-input {
      width: 120px;
      margin-right: 40px;
      .el-input__inner {
        height: 32px;
        padding-right: 0;
      }
    }
  }
  .table{
    .el-input__inner{
      padding-right: 0;
    }
    .el-icon-circle-close:before{
      color: #999 !important;
    }
  }
}
</style>
