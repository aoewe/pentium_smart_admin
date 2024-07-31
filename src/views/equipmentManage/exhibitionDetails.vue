<template>
  <div
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    class="exhibition-details main-box"
  >
    <p class="title">基本信息</p>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      class="form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备主图" prop="img">
            <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeImg">
              <img v-if="form.img" :src="form.img" class="img">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入设备名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备底价" prop="price">
            <el-input class="price" v-model="form.price" placeholder="请输入设备底价"/>
            <span class="rmb">元</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备排序">
            <el-input class="sort" type="number" v-model="form.order" placeholder="请输入设备排序"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 设备特色 -->
        <el-col :span="12">
          <el-form-item label="设备特色">
            <el-form :model="info" label-width="80px" ref="info" v-if="info.list.length">
              <el-row v-for="(item,index) in info.list" :key="index">
                <el-col :md="24" :lg="24" style="margin-bottom:25px;">
                  <el-form-item label="特色名" :prop="'list.'+index+'.key'" :rules="{required: true, message: '请输入特色名', trigger: 'blur'}">
                    <el-input placeholder="请输入特色名" v-model="item.key">
                      <template slot="append"><el-button icon="el-icon-delete" @click="delParameter(index)"></el-button></template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="24" :lg="24">
                  <el-form-item label="特色值" :prop="'list.'+index+'.value'" :rules="{required: true, message: '请输入特色值', trigger: 'blur'}">
                    <el-input style="margin-bottom:25px" placeholder="请输入特色值" type="textarea" autosize v-model="item.value" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-col :sm="12">
              <el-button style="width:102px;" @click="addParameter" icon="el-icon-plus"></el-button>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 设备参数 -->
          <el-form-item label="设备参数">
            <el-form :model="parameters" label-width="80px" ref="parameters" v-if="parameters.list.length">
              <el-row v-for="(item,index) in parameters.list" :key="index">
                <el-col :md="24" :lg="12" style="margin-bottom:25px;">
                  <el-form-item label="参数名" :prop="'list.'+index+'.key'" :rules="{required: true, message: '请输入参数名', trigger: 'blur'}">
                    <el-input placeholder="请输入参数名" v-model="item.key"/>
                  </el-form-item>
                </el-col>
                <el-col :md="24" :lg="12">
                  <el-form-item label="参数值" :prop="'list.'+index+'.value'" :rules="{required: true, message: '请输入参数值', trigger: 'blur'}">
                    <el-input placeholder="请输入参数值" v-model="item.value">
                      <template slot="append"><el-button icon="el-icon-delete" @click="delParameter(index,1)"></el-button></template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-col :span="12">
              <el-button style="width:102px;" @click="addParameter(1)" icon="el-icon-plus"></el-button>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button @click="resetForm('form')" :disabled="loading">重置</el-button>
      <el-button @click="submitForm('form')" :loading="loading">提交</el-button>
    </div>
  </div>
</template>
<script>
import {uploadImgs} from '@/api/public'
import {compressAccurately} from '@/utils'
import {getExhibitionInfo,eidtExhibitionInfo} from '@/api/equipment'
export default {
  name: 'exhibitionDetails',
  data() {
    return {
      loading: false,
      loadingText:'加载中',
      form: {
        name:'',
        order:'',
        price:'',
        img:[],
        info:[],
        parameters:[]
      },
      parameters:{list:[]},
      info:{list:[]},
      rules: {
        img: [{ required: true, message: '请上传设备主图', trigger: 'blur' }],
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入设备底价', trigger: 'blur' }],
      },
      file:null,
    }
  },
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        this.init()
        if(value.id){
          this.loading = true
          this.getExhibitionInfo(value.id)
        }
      }
    }
  },
  computed:{
    product_id(){return this.$route.query.product_id}
  },
  methods: {
    init(){
      this.loadingText='加载中'
      this.parameters = {list:[]}
      this.info = {list:[]}
      this.form={
        name:'',
        img:'',
        order:'',
        price:'',
        info:[],
        parameters:[]
      }
    },
    changeImg(file) {
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') return this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
      this.file = file
      this.form.img = URL.createObjectURL(file.raw)
    },
    async getExhibitionInfo(id){
      const {code,data} = await getExhibitionInfo({id})
      if(code===0){
        this.form = {
          name:data.name,
          order:data.order,
          price:data.price,
          img:data.img,
          id:data.id
        }
        this.parameters.list = data.parameters
        this.info.list = data.info
        this.loading = false
      }
    },
    addParameter(type){
      if(type===1){
        this.parameters.list.push({key:'',value:''})
      }else{
        this.info.list.push({key:'',value:''})
      }
    },
    delParameter(index,type){
      if(type===1){
        this.parameters.list.splice(index,1)
      }else{
        this.info.list.splice(index,1)
      }
    },
    // 重置表单
    resetForm() {
      this.$refs['form'].resetFields()
      this.init()
    },
    submit(){
      this.$refs['form'].validate(async valid=>{
        if(valid){
          const params = JSON.parse(JSON.stringify(this.form))
          if (this.file && this.file.raw) {
            const res = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', res)
            formData.append('path_name', `system/${this.file.name}`)
            const { code, data } = await uploadImgs(formData)
            if (code === 0) params.img = `${data.url[0]}`
          }
          params.parameters = this.parameters.list
          params.info = this.info.list
          const {code} = await eidtExhibitionInfo(params)
          if(code===0){
            this.$message({
              message:params.id?'编辑成功':'添加成功',
              type:'success'
            })
            let timer = setTimeout(()=>{
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.go(-1)
              clearTimeout(timer)
            },200)
          }
        }
      })
    },
    // 提交
    submitForm() {
      this.$refs['parameters']?this.$refs['parameters'].validate(async valid=>{
        if(valid){
          this.submit()
        }
      }):this.submit()
    }
  },
}
</script>
<style lang="scss" scoped>
.exhibition-details {
  padding: 0 32px 10px;
  margin-bottom: 88px;
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    margin: 0;
    padding: 30px 0;
    font-size: 20px;
    border-bottom: 2px solid #f3f5f7;
  }
  .form {
    width: 90%;
    margin-top: 30px;
    span {
      color: rgb(230, 162, 60);
    }
    .rmb{
      position: absolute;
      right: 10px;
    }
    .el-input,
    .el-cascader {
      width: 100%;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 76px;
    z-index: 1999;
    line-height: 76px;
    text-align: center;
    background-color: #ffffff;
    .el-button {
      width: 98px;
    }
    .el-button:last-child {
      color: #ffffff;
      background-color: #3954b3;
    }
  }
}
</style>
<style lang="scss">
.exhibition-details {
  .el-loading-mask{
    z-index: 4 !important;
  }
  .el-loading-spinner{
    position: fixed !important;
    margin-left: 6%;
  }
  .upload-box-flex{
    display: flex;
    justify-content: center;
  }
  .not-content {
    .sku-list{
      display: none;
    }
  }
  .sort .el-input__inner{
    padding-right: 0;
  }
  .el-textarea__inner{
    min-height: 40px !important;
    line-height: 30px;
  }
  .price .el-input__inner{
    padding-right: 30px;
  }
  .el-table__append-wrapper{
    .el-table__body-wrapper{
      display: none;
    }
  }
  .el-upload{
    border: 1px dashed #d9d9d9;
  }
  .el-upload,.img{
    border-radius: 12px;
    width: 320px;
    height: 162px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-uploader-icon{
    font-size: 25px;
    color: #999;
  }

  .el-table__append-wrapper{
    .upload-box{
      width: 80px !important;
      height: 80px !important;
    }
    th{
      padding: 0;
      color: #333;
    }
    .el-switch {
      .el-switch__label--right span {
        margin-left: -11px;
      }
      .el-switch__label--left span {
        margin-left: 10px;
      }
    }
  }
  .el-switch {
    .el-switch__label--right span {
      margin-left: -14px;
    }
    .el-switch__label--left span {
      margin-left: 10px;
    }
  }
}
</style>