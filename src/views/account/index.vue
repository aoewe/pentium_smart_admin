<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="account main-box">
    <div class="select">
      <el-input size="small" placeholder="请输入账号" v-model="mobile" style="margin-right:3px">
        <template slot="prepend">账号</template>
      </el-input>
      <el-select placeholder="请选择用户类型" size="small" v-model="type" v-if="is_admin==='前端用户'">
        <el-option :value="6" label="管理端用户" />
        <el-option :value="8" label="普通用户" />
        <el-option :value="10" label="企业员工" />
        <el-option :value="4" label="购买方" />
        <el-option :value="3" label="铺设方" />
        <el-option :value="7" label="业主方" />
      </el-select>
      <el-select placeholder="请选择用户类型" size="small" v-model="type" v-else>
        <el-option :value="0" label="超级管理员" />
        <el-option :value="1" label="企业管理员" />
        <el-option :value="2" label="运营管理员" />
      </el-select>
      <el-button size="small" @click="page=1,loading=true,getUserList()">查 询</el-button>
      <el-button size="small" @click="page=1,reset()">重 置</el-button>
    </div>
    <el-radio-group v-model="is_admin" @change="handelRadio">
      <el-radio-button label="前端用户"></el-radio-button>
      <el-radio-button label="后台用户"></el-radio-button>
    </el-radio-group>
    <el-button icon="el-icon-plus" type="primary" plain @click="dialogVisible = true, dialogTitle = '添加用户'">添 加</el-button>
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" width="588px">
      <el-form ref="form" v-loading="discern" :model="form" :rules="rules" label-width="115px" :element-loading-text="discernText" element-loading-spinner="el-icon-loading">
        <template v-if="dialogTitle==='添加用户'||dialogTitle==='编辑用户'">
          <el-form-item label="用户类型" prop="user_type">
            <el-select v-model="form.user_type">
              <el-option :value="0" label="超级管理员" />
              <el-option :value="1" label="企业管理员" />
              <el-option :value="6" label="管理端用户" />
              <el-option :value="2" label="运营管理员" />
              <el-option :value="3" label="铺设方" />
              <el-option :value="4" label="购买方" />
              <el-option :value="7" label="业主方" />
              <el-option :value="8" label="普通用户" />
              <el-option v-if="dialogTitle==='编辑用户'" :value="10" label="企业员工" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.user_type === 6 || form.user_type === 10 || form.user_type === 8" label="是否为业务员" prop="is_business">
            <el-radio-group v-model="form.is_business">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="form.is_business === 1">
          <el-form-item v-if="form.user_type === 8 || form.user_type === 10" label="业务员等级" prop="business_id">
            <el-select v-model="level_name" @change="handleBusinessChange" value-key="id">
              <el-option v-for="item,index in selBusinessList" :key="index" :value="item" :label="item.level_name"></el-option>
            </el-select>
          </el-form-item>
        </div>
          <el-form-item v-if="form.user_type === 1 || form.user_type === 3 || form.user_type === 4 || form.user_type === 6 || form.user_type === 7" :label="form.user_type === 3 || form.user_type === 7 ? '厂商LOGO' : '企业LOGO'" :prop="form.user_type === 6?'':'avatar'">
            <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeAvatar">
              <img v-if="form.avatar" :src="form.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item v-if="form.user_type === 3 || form.user_type === 4 || form.user_type === 7" label="营业执照" prop="license">
            <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeLicense">
              <img v-if="form.license" :src="form.license" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item :label="form.user_type === 3 || form.user_type === 4 || form.user_type === 6 || form.user_type === 7 ? '企业/厂商名' : '用户名'" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户/企业/厂商名" />
          </el-form-item>
          <el-form-item v-if="form.user_type === 7" label="所属铺设方" prop="parent_id">
            <el-select v-model="form.parent_id">
              <el-option v-for="item in parentList" :key="item.id" :label="item.username" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" maxlength="11" placeholder="请输入手机号" />
          </el-form-item>
          <div v-if="form.is_business === 1">
          <el-form-item v-if="form.user_type === 8 || form.user_type === 10" label="业务归属上级">
            <el-select v-model="up_business_name" @change="handleUpBusiness">
              <el-option v-for="item,index in UpBusiness" :key="index" :value="item" :label="item.username" />
            </el-select>
          </el-form-item>
        </div>
          <el-form-item v-if="form.is_business === 1 || form.user_type === 8" label="最大报备数量" prop="max_baobei_number">
            <el-input v-model="form.max_baobei_number" maxlength="11" type="number" placeholder="请输入最大报备数量" />
          </el-form-item>
          <el-form-item v-if="form.user_type === 3 || form.user_type === 4 || form.user_type === 7" label="联系人" prop="delegate_name">
            <el-input v-model="form.delegate_name" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item v-if="form.user_type === 0 || form.user_type === 1 || form.user_type === 2" label="角色" prop="role_id">
            <el-select v-model="form.role_id">
              <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.user_type === 3 || form.user_type === 4 || form.user_type === 7" label="联系地址" prop="address">
            <el-cascader v-model="cityCode" :options="cityOptions" @change="changeCity" />
            <br>
            <el-input v-model="form.address" style="margin-top: 13px" placeholder="请填写详细地址" />
          </el-form-item>
          <div v-if="form.user_type === 3 || form.user_type === 7" class="row2">
            <el-form-item label="切割小件单价" prop="price">
              <el-input v-model="form.price" type="number" placeholder="元/吨" />
            </el-form-item>
            <el-form-item label="切割大件单价" prop="price_two">
              <el-input v-model="form.price_two" type="number" placeholder="元/吨" />
            </el-form-item>
          </div>
        </template>
        <template v-else>
          <el-form-item label="充值类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">余额</el-radio>
              <el-radio :label="2">积分</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="充值数量" prop="reduce_balance">
            <el-input placeholder="请输入充值数量" v-model="form.reduce_balance"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.remark">
            </el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <div class="list">
      <el-table :data="list" style="width: 100%" height="calc(100vh - 300px)">
        <el-table-column label="用户信息" min-width="250">
          <template slot-scope="scope">
            <div class="row">
              <div class="logo">
                <el-image fit="cover" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]"/>
              </div>
              <div>
                <div>用户名：{{scope.row.username}}</div>
                <div v-if="scope.row.is_business === 1">业务员<span>({{ scope.row.business_level_name }})</span></div>
                <div>手机号：{{scope.row.mobile}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="create_time" min-width="200"></el-table-column>
        <el-table-column label="用户资产" min-width="200">
          <template slot-scope="scope">
            <router-link :to="{path:`./stream?type=1&user_id=${scope.row.id}`}">
              余额：<span style="color:#3954B3">{{scope.row.balance}}</span>
            </router-link>
            <br/>
            <router-link :to="{path:`./stream?type=2&user_id=${scope.row.id}`}">
              积分：<span style="color:#3954B3">{{scope.row.integral}}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="用户类型"  min-width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.user_type === 0 ? '超级管理员': scope.row.user_type === 1 ? '企业管理员': scope.row.user_type === 2 ? '运营管理员' : scope.row.user_type === 3 ? '铺设方' : scope.row.user_type === 4 ? '购买方' :scope.row.user_type === 5 ? '操作员': scope.row.user_type === 6 ? '管理端用户': scope.row.user_type === 7 ? '业主方':scope.row.user_type === 8?'普通用户':'企业员工' }}</span>
            <div v-if="scope.row.user_type === 10">{{scope.row.department_name}}<span v-if="scope.row.member">({{ scope.row.member }})</span></div>
            <div>ID：{{scope.row.id}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="150">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status"
              :disabled="switchId===scope.row.id"
              active-color="#3954B3"
              inactive-color="#666666"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              @change="changeUserStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" fixed="right">
          <template slot-scope="scope">
            <el-button  type="text" @click="editUser(scope.row,'Edit')">编辑</el-button>
            <el-button type="text" @click="editUser(scope.row,'Recharge')">充值</el-button>
            <el-button type="text" @click="resetPaw(scope.row)">重置密码</el-button>
            <el-button v-if="scope.row.user_type!==0 && scope.row.user_type!==3 && scope.row.user_type!==4 && scope.row.user_type!==7" type="text" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="n" label="薪资（元）" width="130px" /> -->
      </el-table>
    </div>
    <el-pagination
      :page-size="size"
      :current-page="page"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getRoleList } from '@/api/authority'
import { uploadImgs, getLicenseNum, getLocation, getUserByType } from '@/api/public'
import { editUser, getUserList, changeUserStatus, resetPassword,rechargeApply,businessList,getUpBusiness } from '@/api/user'
import { citys } from '@/utils/citys'
import { compressAccurately } from '@/utils'
import { log } from '@/utils/ezuikit'
export default {
  name: 'AccountList',
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
      file: null,
      loading: true,
      switchId:null,
      avatar: '',
      dialogVisible: false,
      dialogTitle: '添加用户',
      discernText: '识别中',
      discern: false,
      cityCode: [],
      cityOptions: [],
      parentList: [],
      selBusinessList:[],
      level_name:'',
      up_business_name:'',
      form: {
        username: '',
        business_id:'',
        is_business:2,
        mobile: '',
        role_id: '',
        user_type: '',
        avatar: '',
        status: 1,
        license: '',
        delegate_name: '',
        license_num: '',
        price: '',
        price_two: '',
        province: '',
        address: '',
        city: '',
        district: '',
        parent_id: '',
        relate_id:'',
        type:'',
        reduce_balance:'',
        remark:'',
        up_business_uid:'',
        max_baobei_number:''
      },
      roleList: [],
      UpBusiness:[],
      rules: {
        avatar: [{ required: true, message: '请上传LOGO', trigger: 'blur' }],
        // license: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
        address: [{ required: true, message: '请选择和填写联系地址', trigger: 'blur' }],
        business_id: [{ required: true, message: '请选择业务员等级', trigger: 'blur' }],
        is_business: [{ required: true, message: '请选择是否为业务员', trigger: 'blur' }],
        parent_id: [{ required: true, message: '请选择所属铺设方', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户/企业/厂商名称', trigger: 'blur' }],
        delegate_name: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
        user_type: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
        price: [{ required: true, message: '请输入小件切割单价', trigger: 'blur' }],
        type: [{ required: true, message: '请选择充值类型', trigger: 'blur' }],
        reduce_balance: [{ required: true, message: '请输入充值金额', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入充值备注', trigger: 'blur' }],
        price_two: [{ required: true, message: '请输入大件切割单价', trigger: 'blur' }],
        max_baobei_number: [{ required: true, message: '请输入报备数量', trigger: 'blur' }],

      },
      type: '',
      is_admin:'前端用户',
      mobile:'',
      list: [],
      page: 1,
      size: 10,
      total: 0
    }
  },
  created() {
    this.getUserList()
    this.getRoleList()
    this.getUserByType()
    this.getBusinessList()
    this.cityOptions = citys
  },
  methods: {
    // 业务员分类
    async getBusinessList(){
      const {code,data} = await businessList()
      if(code===0) this.selBusinessList = data
    },
    handelRadio(e){
      this.is_admin = e
      this.loading = true
      this.page=1
      this.type = ''
      this.getUserList()
    },
    async getUserByType() {
      const { code, data } = await getUserByType({ user_type: 3 })
      if (code === 0) {
        this.parentList = data
      }
    },
    changeCity(e) {
      this.form.province = e[0]
      this.form.city = e[1]
      this.form.district = e[2]
    },
    changeAvatar(file) {
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') return this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
      this.file = file
      this.form.avatar = URL.createObjectURL(file.raw)
    },
    // 识别营业执照
    async changeLicense(file) {
      const formData = new FormData()
      const res = await compressAccurately(file.raw,1000)
      formData.append('file[]', res)
      formData.append('path_name', `system/${file.name}`)
      const { code, data } = await uploadImgs(formData)
      if (code === 0) {
        this.discern = true
        const res = await getLicenseNum({ image: `${data.url[0]}` })
        if (res.code === 0) {
          this.form.license_num = res.data.license_num
          this.form.license = `${data.url[0]}`
          this.form.username = res.data.name
        }
        this.discern = false
      }
    },
    async changeUserStatus(row) {
      this.switchId = row.id
      const res = await changeUserStatus({ id: row.id, status: !row.status ? 1 : 0 })
      if (res.code === 0){
        row.status = !row.status ? 1 : 0
        this.switchId = null
      }
    },
    reset() {
      this.type = ''
      this.mobile = ''
      this.loading = true
      this.getUserList()
    },
    initForm() {
      this.form = {
        username: '',
        business_id: '',
        is_business: 2,
        mobile: '',
        role_id: '',
        user_type: '',
        avatar: '',
        status: 1,
        license: '',
        price: '',
        price_two: '',
        province: '',
        address: '',
        delegate_name: '',
        license_num: '',
        city: '',
        parent_id: '',
        district: '',
        up_business_uid:'',
        max_baobei_number:''
      }
      this.UpBusiness = [],
      this.level_name = ''
      this.up_business_name ='',
      this.file = null
      this.cityCode = []
      this.dialogVisible = false
      this.avatar = ''
      this.$refs['form'].resetFields()
    },
    // 编辑用户
    editUser(row,type) {
      this.dialogVisible = true

      if(type==='Recharge'){
        this.dialogTitle = `${row.username}充值`
        this.form.relate_id = row.id
      }else{
        this.dialogTitle = '编辑用户'
        this.form.id = row.id
        this.form.username = row.username
        this.form.mobile = row.mobile
        this.form.business_id = row.business_id
        this.form.is_business = row.is_business
        this.form.role_id = row.role_id
        this.form.user_type = row.user_type
        this.level_name = row.business_level_name
        this.up_business_name = row.up_business_name
        this.form.avatar = row.avatar
        this.form.status = row.status
        this.cityCode[0] = row.province + ''
        this.cityCode[1] = row.city + ''
        this.cityCode[2] = row.district + ''
        this.form.city = row.city
        this.form.district = row.district
        this.form.parent_id = row.parent_id
        this.form.province = row.province
        this.form.price = row.price
        this.form.delegate_name = row.delegate_name
        this.form.price_two = row.price_two
        this.form.avatar = row.avatar
        this.form.license = row.license
        this.form.address = row.address
        const index = this.selBusinessList.findIndex(item => item.level_name === row.business_level_name);
      if (index !== -1) {
  const cor = this.selBusinessList[index];
 this.handleBusinessChang(cor)
      } else {

    }
      }

    },
    // 重置密码
    resetPaw(row) {
      this.$confirm('是否将该用户密码重置为123456', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await resetPassword({ user_id: row.id, new_pass: '123456', confirm_pass: '123456' })
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '重置成功'
          })
        }
      }).catch(() => {
        return
      })
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await changeUserStatus({ id: row.id, status: 2 })
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.page > 1) {
              this.page--
            }
            this.getUserList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 角色类型
    async getRoleList() {
      const params = {
        filters: {},
        sorts: {},
        page: 1,
        size: 9999
      }
      const res = await getRoleList(params)
      if (res.code === 0) this.roleList = res.data.list
    },
    //必须另外执行（打开编辑默认执行)
    async handleBusinessChang(item) {
      this.form.business_id = item.id;
      const params = {
        business_level:item.level
      }
      const res = await getUpBusiness(params)
      if (res.code === 0) this.UpBusiness = res.data
    },

    async handleBusinessChange(item) {
      this.form.business_id = item.id;
      this.up_business_name = ''
      this.form.up_business_uid = '-1'
      const params = {
        business_level:item.level
      }
      const res = await getUpBusiness(params)
      if (res.code === 0) this.UpBusiness = res.data
    },
    handleUpBusiness(item){
      this.form.up_business_uid = item.id
      this.up_business_name = item.username
    },
    // 账号列表
    async getUserList() {
      const {type,mobile,page,size} = this
      const res = await getUserList({
        page,
        size,
        sorts: {},
        filters: { user_type:type,mobile,is_admin:this.is_admin==='前端用户'?2:1 }
      })
      if (res.code === 0) {
        this.list = res.data.list
        this.total = res.data.total
        this.loading = false
      }
    },
    // 提交
    submit() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          for (const k in params) {
            if (!params[k]) {
              delete params[k]
            }
          }
          if(params.relate_id){
            const {code} = await rechargeApply(params)
            if(code===0){
              this.$message({
                type: 'success',
                message: '充值已提交，等待审核。'
              })
              this.dialogVisible = false
              this.getUserList()
              this.initForm()
            }
            return
          }
          if (this.file && this.file.raw) {
            const res = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', res)
            formData.append('path_name', `system/${this.file.name}`)
            const { code, data } = await uploadImgs(formData)
            if (code === 0) params.avatar = `${data.url[0]}`
          }
          if (params.city && params.address) {
            const parm = await getLocation(params.city, params.address)
            const { infocode, geocodes } = parm.data
            if (infocode.substr(0, 1) === '3') return this.$message({ message: '地区所对应的地址有误！', type: 'warning', duration: 1000 })
            params.lat = geocodes[0].location.split(',')[1]
            params.lng = geocodes[0].location.split(',')[0]
          }
          // if (params.avatar) params.avatar = params.avatar.split('com')[1]
          // if (params.license) params.license = params.license.split('com')[1]
          const res = await editUser(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: this.dialogTitle === '添加用户' ? '添加成功' : '编辑成功'
            })
            this.dialogVisible = false
            this.getUserList()
            this.initForm()
          }
        }
      })
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getUserList()
    }
  }
}
</script>
<style lang="scss" scoped>
.account {
  .row2 {
    display: flex;
    justify-content: space-between;
    .el-input{
      width: 125px;
    }
    .el-input {
      :-moz-placeholder {
        text-align: right;
      }

      ::-moz-placeholder {
        text-align: right;
      }

      ::-webkit-input-placeholder {
        text-align: right;
      }

      :-ms-input-placeholder {
        text-align: right;
      }
    }
  }
  .select {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .el-input{
      width: 300px;
    }
    .el-select {
      width: 224px;
      margin-right: 30px;
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
  .list {
    margin: 20px 0 60px 0;
    .row{
      display: flex;
      align-items: center;
      .logo{
        width: 50px;
        height: 50px;
        margin-right: 10px;
        background-color: #fff;
        border-radius: 50%;
        .el-image{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .logo+div{
        max-width: calc(100% - 60px);
      }
    }
  }
}
</style>
<style lang="scss">
// element ui
.account {
  .el-radio-group{
    margin: -2px 20px 0 0;
  }
  .el-radio-button__inner{
    height: 38px;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #3954b3;
    border-color: #3954b3;
    -webkit-box-shadow: -1px 0 0 0 #3954b3;
    box-shadow: -1px 0 0 0 #3954b3;
  }
  .el-input__inner{
    padding-right: 0;
  }
  .el-select,.el-cascader{
    width: 100%;
  }
  .el-button--text{
    padding: 0;
  }
  .el-dialog {
    position: absolute;
    margin-top: 0 !important;
    padding-right: 20px;
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
  .el-form-item{
    margin-bottom: 30px;
  }
  .el-button--primary.is-plain {
    color: #fff;
    background-color: #3954b3;
    border: 0;
  }
  .avatar-uploader {
    height: 60px;
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 18px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .avatar {
      width: 60px;
      height: 60px;
      display: block;
    }
  }
}
</style>
