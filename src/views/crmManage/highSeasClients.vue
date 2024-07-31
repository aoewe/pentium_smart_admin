<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="high-seas-clients main-box">
    <div class="select">
      <el-input size="small" placeholder="请输入联系人手机" v-model="mobile" style="margin-right:3px">
        <template slot="prepend">联系人手机</template>
      </el-input>
      <el-input size="small" placeholder="请输入客户名称" v-model="name" style="margin-right:3px">
        <template slot="prepend">客户名称</template>
      </el-input>
      <el-select placeholder="请选择客户状态" size="small" v-model="status">
        <el-option value="0" label="未报备"></el-option>
        <el-option value="1" label="报备中"></el-option>
        <el-option value="2" label="待审核"></el-option>
        <el-option value="3" label="重复报备审批"></el-option>
        <el-option value="4" label="已报备"></el-option>
      </el-select>
      <el-button size="small" @click="page=1,loading=true,getCustomerList()">查 询</el-button>
      <el-button size="small" @click="page=1,reset()">重 置</el-button>
    </div>
    <el-button icon="el-icon-plus" type="primary" plain @click="dialogVisible = true, text = '添加'">添 加</el-button>
    <el-dialog :title="text" :visible.sync="dialogVisible" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="102px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户地区" prop="province">
          <el-cascader placeholder="请选择客户地区" v-model="cityCode" :options="cityOptions" @change="changeCity" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="客户分类" prop="category_id">
          <el-cascader placeholder="请选择客户分类" :props="{ children:'child', value:'id',label:'name' }" v-model="form.category_id" :options="customerList" />
        </el-form-item>
        <el-form-item label="联系人名称" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人名称" />
        </el-form-item>
        <el-form-item label="联系人手机" prop="mobile">
          <el-input maxlength="11" v-model="form.mobile" placeholder="请输入联系人手机" />
        </el-form-item>
        <el-form-item label="联系人职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入联系人职位" />
        </el-form-item>
        <el-form-item label="年产量" prop="output">
          <el-input type="number" v-model="form.output" placeholder="请输入年产量">
            <span slot="suffix" class="suffix">吨</span>
          </el-input>
        </el-form-item>
        <el-form-item label="客户标签">
          <vue-tags-input :placeholder="tags.length?'':'输入完成按回车可输入多个'" v-model="form.tag" :tags="tags" @tags-changed="newTags => tags = newTags"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 列表 -->
    <div class="list">
      <el-table :data="list" style="width: 100%" :height="list.length?'calc(100vh - 300px)':'100px'">
        <el-table-column label="联系人信息" min-width="250">
          <template slot-scope="scope">
            <div>联系人：{{scope.row.contacts}}</div>
            <div>手机号：{{scope.row.mobile}}</div>
          </template>
        </el-table-column>
        <el-table-column label="联系地址" min-width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.province_name }} </span>
            <span>{{ (scope.row.province_name===scope.row.city_name)?'':scope.row.city_name+' ' }}</span>
            <span>{{ scope.row.district_name }}</span>
            <div>{{scope.row.address}}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户信息" min-width="250">
          <template slot-scope="scope">
            <div>客户名：{{scope.row.name}}</div>
            <div class="tags">标签：
              <span v-if="scope.row.tag[0]===''">- -</span>
              <div v-else><span  class="tag" v-for="item in scope.row.tag" :key="item">{{ item }}</span></div>
            </div>
          </template>
        </el-table-column>
        <!-- 0未报备 1报备中 2待审核 3重复报备审批 4已报备 -->
        <el-table-column label="客户状态" min-width="200">
          <template slot-scope="scope">
            <div style="display: flex;">{{scope.row.status===0?'未报备':scope.row.status===1?'报备中':scope.row.status===2?'待审批':scope.row.status===3?'重复报备审批':scope.row.status===4?'已报备':'其他'}}
              <div class="btns" v-if="scope.row.status===2">
                <el-button @click="auditing(scope.row,'REFUSE')">拒绝</el-button>
                <el-button type="success" @click="auditing(scope.row,'AGREE')">同意</el-button>
              </div>
            </div>
            <span v-if="scope.row.post_user_mobile">报备人：{{scope.row.contacts}}</span>
            <el-popover :title="scope.row.name+'绑定报备人'" placement="right" width="400" trigger="click" v-if="scope.row.status===0">
              <el-form ref="reporterRef" :model="reporterForm" :rules="reporterRules" label-width="102px">
                <el-form-item label="选择业务员" prop="user_id">
                  <el-select placeholder="请选择报备业务员" v-model="reporterForm.user_id" style="width: 260px;">
                    <el-option v-for="item,index in businessList" :key="index" :value="item.id" :label="item.username"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-button type="text" slot="reference">绑定报备人</el-button>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="cancel()">取消</el-button>
                <el-button style="background-color:#3954B3;border-color:#3954B3" type="primary" size="mini" @click="bandSalesman(scope.row)">确定</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" min-width="200" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button icon="edit" type="text" @click="editUser(scope.row)">编辑</el-button>
            <el-button icon="delete" type="text" @click="delCustomer(scope.row)">删除</el-button>
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
import { getCustomerList,editCustomer,getCustomerCategory,delCustomer,getBusinessUser,setBelongCustomer,editExamine } from '@/api/crm'
import VueTagsInput from '@johmun/vue-tags-input';
import { citys } from '@/utils/citys'
export default {
  name: 'HighSeasClients',
  components: {
    VueTagsInput,
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else {
        if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      dialogVisible: false,
      name:'',
      contacts:'',
      mobile:'',
      status:'',
      loading: true,
      text: '添加',
      cityCode: [],
      cityOptions: [],
      customerList:[],
      tags:[],
      list: [],
      page: 1,
      size: 10,
      total: 0,
      reporterForm:{user_id:''},
      businessList:'',
      form: {
        name:'',
        position:'',
        province:'',
        city:'',
        district:'',
        address:'',
        category_id:'',
        contacts:'',
        mobile:'',
        output:'',
        tag:''
      },
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        position: [{ required: true, message: '请输入联系人职位', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        province: [{ required: true, message: '请选择客户地区', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择客户类型', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入联系人名称', trigger: 'blur' }],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }],
        output: [{ required: true, message: '请输入年产量', trigger: 'blur' }]
      },
      reporterRules:{
        user_id: [{ required: true, message: '请选择绑定业务员', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getCustomerList()
    this.getCustomerCategory()
    this.getBusinessUser()
    this.cityOptions = citys
  },
  methods: {
    // 审核
    async auditing(row,type){
      if(type==='AGREE'){
          const {code} = await editExamine({customer_id:row.id,status:1})
          if(code===0) this.getCustomerList()
      }else{
        this.$confirm(`是否拒绝${row.name}的认证`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {code} = await editExamine({customer_id:row.id,status:10})
          if(code===0) this.getCustomerList()
        }).catch(()=>{})
      }
    },
    // 绑定业务员
    bandSalesman(row){
      this.$refs['reporterRef'].validate(async valid => {
        if(valid){
          const params = {...this.reporterForm}
          params.customer_id = row.id
          const {code} = await setBelongCustomer(params)
          if(code===0){
            this.$message({
              type: 'success',
              message: '绑定提交成功'
            })
            this.getCustomerList()
          }
        }
      })
    },
    async getBusinessUser(){
      const {code,data} = await getBusinessUser()
      if(code===0) this.businessList = data
    },
    cancel() {
      document.body.click()
    },
    async getCustomerCategory(){
      const {code,data} = await getCustomerCategory()
      if(code===0) this.customerList = data
    },
    changeCity(e) {
      this.form.province = e[0]
      this.form.city = e[1]
      this.form.district = e[2]
    },
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const params = JSON.parse(JSON.stringify(this.form))
          params.category_id.length && (params.category_id = params.category_id[params.category_id.length-1])
          if(this.tags.length){
            params.tag = this.tags.map(i=>i.text)
          }
          if(typeof params.tag === 'string'){
            params.tag = params.tag.split('')
          }
          params.create_time && delete params.create_time
          params.update_time && delete params.update_time
          const res = await editCustomer(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: this.text+'成功'
            })
            this.initForm()
            this.getCustomerList()
          }
        }
      })
    },
    initForm() {
      this.form = {
        name:'',
        province:'',
        city:'',
        district:'',
        address:'',
        position:'',
        category_id:'',
        contacts:'',
        mobile:'',
        output:'',
        tag:''
      }
      this.cityCode = []
      this.tags = []
      this.$refs['form'].resetFields()
      this.dialogVisible = false
    },
    reset() {
      this.name = ''
      this.mobile = ''
      this.contacts=''
      this.loading = true
      this.getCustomerList()
    },
    async getCustomerList() {
      let filters = {}
      const params = {
        filters,
        sorts: {},
        page: this.page,
        size: this.size
      }
      this.name && (filters.name=this.name)
      this.mobile && (filters.mobile=this.mobile)
      this.contacts && (filters.contacts=this.contacts)
      this.status && (filters.status=this.status)
      const { code, data } = await getCustomerList(params)
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    // 编辑
    editUser(row) {
      this.text = '编辑'
      this.form.id = row.id
      this.form.name = row.name
      this.form.address = row.address
      this.form.category_id = row.category_id
      this.form.contacts = row.contacts
      this.form.position = row.position
      this.form.mobile = row.mobile
      this.form.output = row.output
      this.cityCode = [row.province + '',row.city + '',row.district + '']
      this.form.city = row.city
      this.form.district = row.district
      this.form.province = row.province
      row.tag.forEach(i=>{
        this.tags.push({text:i,tiClasses:['ti-valid']})
      })
      this.dialogVisible = true
    },
    // 删除岗位
    delCustomer(row) {
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const {code} = await delCustomer({id:row.id})
          if(code===0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.page > 1) {
              this.page--
            }
            this.getCustomerList()
          }
        })
        .catch(() => {})
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getCustomerList()
    }
  }
}
</script>
<style lang="scss" scoped>
.high-seas-clients {

  .select {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .el-select {
      width: 224px;
      margin-right: 60px;
    }
    .el-input{
      width: 300px;
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
  .el-cascader{
    width: 100%;
  }
  .list {
    margin: 20px 0 60px 0;
    .el-select{
      width: 100% !important;
    }
  }
  .btns{
    .el-button{
      margin-left: 10px;
      border-radius: 4px;
      padding: 4px 6px;
      font-size: 12px;
    }
  }
  .tags{
    display: flex;
    flex-wrap: wrap;
  }
  .tag{
    border: 1px solid #0263D4;
    display: inline-block;
    color: #0263D4;
    border-radius: 2px;
    padding: 0 2px;
    margin-right: 10px;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
  }
}
</style>
<style lang="scss">
.el-popover__title{
  padding-left: 10px;
}
// element ui
.high-seas-clients {
  .ti-input {
    height: 40px;
    width: 558px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0 15px;
    .ti-new-tag-input-wrapper{
      padding: 0 !important;
      font-size: 14px;
    }
    .ti-tag{
      background-color: rgba($color: #000000, $alpha: 0);
      color: #0263D4;
      border: 1px solid #0263D4;
      border-radius: 4px;
    }
    input{
      color: #606266;
    }
    input[type=text]::placeholder {
      color: #C0C4CC;
    }
  }
  .el-input--suffix .el-input__inner{
    padding-right: 0;
  }
  .el-input__suffix{
    .suffix{
      padding-right: 20px;
    }
  }
  .el-select{
    width: 100%;
  }

  .el-button--text{
    padding: 0;
  }
  .el-dialog {
    position: absolute;
    margin-top: 0 !important;
    top: 50%;
    left: 50%;
    border-radius: 4px;
    transform: translate(-50%,-50%);
    .el-dialog__header {
      text-align: center;
      padding-bottom: 0;
      color: #333333;
      font-weight: bold;
      .el-dialog__title {
        font-size: 22px;
      }
      .el-dialog__close {
        display: none;
      }
    }
    .el-dialog__body{
      padding-bottom: 10px;
    }
  }

  .el-button--primary.is-plain {
    color: #fff;
    background-color: #3954b3;
    border: 0;
  }
}
</style>
