<template>
  <div class="new-box main-box">
    <div class="step">
      <div class="item first" :class="{ first_active: active === 1 }">
        <span>1</span>新增设备
      </div>
      <div class="item next" :class="{ next_active: active === 2 }">
        <span>2</span>设备购买方
      </div>
      <div class="item last" :class="{ last_active: active === 3 }">
        <span>3</span>绑定设备
      </div>
    </div>
    <div class="new-main">
      <el-form
        v-if="active === 1"
        ref="form1"
        :model="newForm"
        label-width="150px"
        :rules="rules1"
      >
        <el-form-item label="设备简称" prop="name">
          <el-input v-model="newForm.name" placeholder="请输入设备唯一简称" />
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
          <el-input v-model="newForm.number" placeholder="请输入设备唯一编号" />
        </el-form-item>
        <el-form-item label="设备型号" prop="model_name">
          <el-input v-model="newForm.model_name" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="newForm.type" placeholder="请选择设备瓦数">
            <el-option v-for="item in equipmentType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form
        v-if="active === 2"
        ref="form2"
        :model="newForm"
        label-width="150px"
        :rules="rules2"
      >
        <el-form-item label="购买方" prop="buy_user_id">
          <el-select v-model="newForm.buy_user_id">
            <el-option v-for="item in purchaserList" :key="item.id" :value="item.id" :label="item.username" />
          </el-select>
          <el-button style="background-color: #3954b3; color: #fff; margin-left: 10px" @click="newUser('0')">新增购买方</el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-if="active === 3"
        ref="form3"
        :model="newForm"
        label-width="150px"
        :rules="rules3"
      >
        <el-form-item label="选择铺设方" prop="factory_user_id">
          <el-select v-model="newForm.factory_user_id" placeholder="请选择">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.username" :value="item.id" />
          </el-select>
          <el-button style="background-color: #3954b3; color: #fff; margin-left: 10px" @click="newUser('1')">新增铺设方</el-button>
        </el-form-item>
      </el-form>
      <!-- dialog -->
      <el-dialog :visible.sync="dialogVisible" width="660px">
        <el-form ref="addForm" v-loading="discern" :rules="dialogRules" :model="addForm" label-width="120px" element-loading-text="识别中" element-loading-spinner="el-icon-loading">
          <el-form-item :label="newText === '铺设方'?'铺设方LOGO':'购买方LOGO'" prop="avatar">
            <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeAvatar">
              <img v-if="addForm.avatar" :src="addForm.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="营业执照" prop="license">
            <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeLicense">
              <img v-if="addForm.license" :src="addForm.license" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item :label="newText" prop="username">
            <el-input v-model="addForm.username" placeholder="请输入真实信息" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile" maxlength="11" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="联系人" prop="delegate_name">
            <el-input v-model="addForm.delegate_name" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-cascader v-model="cityCode" :options="cityOptions" @change="changeCity" />
            <br>
            <el-input v-model="addForm.address" style="margin-top: 13px" placeholder="请填写详细地址" />
          </el-form-item>
          <div v-if="newText === '铺设方'" class="row2">
            <el-form-item label="切割小件单价" prop="price">
              <el-input v-model="addForm.price" type="number" placeholder="元/吨" />
            </el-form-item>
            <el-form-item label="切割大件单价" prop="price_two">
              <el-input v-model="addForm.price_two" type="number" placeholder="元/吨" />
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="initForm(1)">取消</el-button>
          <el-button style="background-color: #3954b3; color: #fff" @click="editRole()">添加</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="btn">
      <el-button v-if="active > 1" @click="back">上一步</el-button>
      <el-button class="next" @click="active===3?submit():next(active)">{{ nextText }}</el-button>
    </div>
  </div>
</template>
<script>
import { getUserByType, getAllFactory, uploadImgs, getLicenseNum, getLocation } from '@/api/public'
import { editUser } from '@/api/user'
import { editEquipment } from '@/api/equipment'
import { citys } from '@/utils/citys'
import { compressAccurately } from '@/utils'
export default {
  name: 'NewEquipment',
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
      cityCode: '',
      dialogVisible: false,
      purchaserList: [],
      factoryList: [],
      roleList: [],
      cityOptions: [],
      equipmentType: [{ value: 2, label: '20000W' }, { value: 3, label: '30000W' }, { value: 4, label: '40000W' }],
      newText: '购买方',
      active: 1,
      nextText: '下一步',
      newForm: {
        number: '',
        name: '',
        type: '',
        model_name:'',
        buy_user_id: '',
        factory_user_id: ''
      },
      rules1: {
        name: [{ required: true, message: '请输入设备简称', trigger: 'blur' }],
        number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        model_name: [{ required: true, message: '请输入设备型号', trigger: 'blur' }]
      },
      rules2: {
        buy_user_id: [{ required: true, message: '请选择购买方名称', trigger: 'blur' }]
      },
      rules3: {
        factory_user_id: [{ required: true, message: '请选择铺设方', trigger: 'blur' }]
      },
      dialogRules: {
        username: [{ required: true, message: '请输入购买方/铺设方名称', trigger: 'blur' }],
        avatar: [{ required: true, message: '请上传LOGO', trigger: 'blur' }],
        // license: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }],
        delegate_name: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        address: [{ required: true, message: '请选择和填写联系地址', trigger: 'blur' }],
        price: [{ required: true, message: '请输入小件切割单价', trigger: 'blur' }],
        price_two: [{ required: true, message: '请输入大件切割单价', trigger: 'blur' }]
      },
      file: null, // 购买方logo文件
      licenseFile: null, // 营业执照文件
      discern: false,
      addForm: {
        username: '',
        mobile: '',
        user_type: 4,
        status: 1,
        avatar: '',
        license: '',
        license_num: '',
        lat: '',
        lng: '',
        province: '',
        city: '',
        district: '',
        delegate_name: '',
        address: '',
        price: '',
        price_two: ''
      }
    }
  },
  created() {
    this.getAllFactory()
    this.cityOptions = citys
  },
  methods: {
    // 识别营业执照
    async changeLicense(file) {
      const raw = await compressAccurately(file.raw,1000)
      const formData = new FormData()
      formData.append('file[]', raw)
      formData.append('path_name', `system/${file.name}`)
      const { code, data } = await uploadImgs(formData)
      if (code === 0) {
        this.discern = true
        const res = await getLicenseNum({ image: `${data.url[0]}` })
        if (res.code === 0) {
          this.addForm.license_num = res.data.license_num
          this.addForm.license = `${data.url[0]}`
          this.addForm.username = res.data.name
        }
        this.discern = false
      }
    },
    changeAvatar(file) {
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') return this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
      this.file = file
      this.addForm.avatar = URL.createObjectURL(file.raw)
    },
    changeCity(e) {
      this.addForm.province = e[0]
      this.addForm.city = e[1]
      this.addForm.district = e[2]
    },
    initForm(type) {
      if (type === 0) {
        this.newForm = {
          number: '',
          name: '',
          type: '',
          buy_user_id: '',
          factory_user_id: ''
        }
        this.active = 1
        this.$refs['form1'].resetFields()
        this.$refs['form2'].resetFields()
        this.$refs['form3'].resetFields()
      } else {
        this.$refs['addForm'].resetFields()
        this.addForm = {
          username: '',
          mobile: '',
          delegate_name: '',
          user_type: 4,
          status: 1,
          avatar: '',
          license: '',
          license_num: '',
          province: '',
          city: '',
          district: '',
          address: '',
          price: '',
          price_two: ''
        }
        this.cityCode = ''
        this.dialogVisible = false
      }
    },
    // 新增购买方/铺设方
    editRole() {
      this.$refs['addForm'].validate(async value => {
        if (value) {
          const form = JSON.parse(JSON.stringify(this.addForm))
          for (var key in form) {
            if (form[key] === '') {
              delete form[key]
            }
          }
          if (this.file && this.file.raw) {
            const res = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', res)
            formData.append('path_name', `system/${this.file.name}`)
            const { code, data } = await uploadImgs(formData)
            if (code === 0) form.avatar = `${data.url[0]}`
          }
          const parm = await getLocation(this.addForm.city, this.addForm.address)
          const { infocode, geocodes } = parm.data
          if (infocode.substr(0, 1) === '3') return this.$message({ message: '地区所对应的地址有误！', type: 'warning', duration: 1000 })
          form.lat = geocodes[0].location.split(',')[1]
          form.lng = geocodes[0].location.split(',')[0]
          // if (form.avatar) form.avatar = form.avatar.split('com')[1]
          // if (form.license) form.license = form.license.split('com')[1]
          const res = await editUser(form)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            if (this.addForm.user_type === 4) {
              this.getUserByType(4)
            } else {
              this.getAllFactory()
            }
            this.initForm(1)
          }
        }
      })
    },
    newUser(e) {
      this.dialogVisible = true
      if (e === '0') {
        this.newText = '购买方'
        this.addForm.user_type = 4
      } else {
        this.newText = '铺设方'
        this.addForm.user_type = 3
      }
    },
    // 铺设方列表
    async getAllFactory() {
      const res = await getAllFactory()
      if (res.code === 0) this.factoryList = res.data
    },
    // 购买方列表
    async getUserByType(user_type) {
      const res = await getUserByType({ user_type })
      if (res.code === 0) this.purchaserList = res.data
    },
    back() {
      this.active--
      this.nextText = '下一步'
    },
    next(e) {
      if (e === 1) {
        this.getUserByType(4)
      }
      this.$refs[`form${e}`].validate(async value => {
        if (value) {
          if (++this.active > 2) this.nextText = '提交'
        }
      })
    },
    // 提交新增设备
    submit() {
      this.$refs['form3'].validate(async value => {
        if (value) {
          const res = await editEquipment(this.newForm)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '新增设备成功'
            })
            this.initForm(0)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.new-box {
  .step {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: 100% 100%;
      height: 48px;
      color: #fff;
      font-size: 18px;
      span {
        color: #999999;
        display: inline-block;
        text-align: center;
        line-height: 24px;
        width: 24px;
        height: 24px;
        background: #f5f6fa;
        border-radius: 50%;
        margin-right: 6px;
      }
    }
    .first, .next, .last{
      transition: all 1s;
    }
    .first {
      background-image: url('../../assets/first.png');
    }
    .next {
      background-image: url('../../assets/next.png');
    }
    .last {
      background-image: url('../../assets/next_last.png');
    }
    .next_active {
      background-image: url('../../assets/next_active.png');
    }
    .last_active {
      background-image: url('../../assets/last_active.png');
    }
    .last_active,
    .first_active,
    .next_active {
      transition: all 0s;
      span {
        color: #3954b3;
      }
    }
    .first_active {
      background-image: url('../../assets/step_active.png');
    }
  }
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
    .next {
      background-color: #3954b3;
      color: #fff;
      &:hover {
        color: #fff;
        background-color: #4867d4;
      }
    }
  }
  .row2 {
    display: flex;
    .el-input,
    .el-select {
      width: 165px;
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
  .el-input,
  .el-select,
  .el-cascader {
    width: 450px;
  }
}
</style>
<style lang="scss">
// element ui
.new-box{
  .el-input__inner{
    padding-right: 0;
  }
  .el-dialog {
    .el-dialog__body{
      padding-bottom: 0;
    }
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__headerbtn .el-dialog__close{
      display: none;
    }
    .el-dialog__footer{
      display: flex;
      justify-content: center;
    }
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
