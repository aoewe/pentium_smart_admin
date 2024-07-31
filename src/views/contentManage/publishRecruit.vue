<template>
  <div v-loading="loading" class="publish main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <p>基本信息</p>
    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="岗位名称" prop="position_name">
            <el-input v-model="form.position_name" placeholder="请输入岗位名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学历要求" prop="education">
            <el-input v-model="form.education" placeholder="请输入招聘学历" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="招聘薪资" prop="salary">
            <el-input v-model="form.salary" placeholder="请输入招聘薪资"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作经验" prop="experience">
            <el-input v-model="form.experience" placeholder="请输入工作经验" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工作地点" prop="province">
            <el-cascader placeholder="请选择工作地点" clearable v-model="defaultCity" :options="cityOptions" @change="changeCity" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" placeholder="请填写详细地址" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile" maxLength="11" placeholder="请输入工作经验" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证书">
            <el-input v-model="form.certificate" placeholder="请输入工作经验" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="招聘详情" prop="content" class="editor">
            <editor-bar ref="editor" :catch-data="catchData" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button @click="submit">发布</el-button>
    </div>
  </div>
</template>
<script>
import { citys } from '@/utils/citys'
import EditorBar from './components/editoritem'
import {editRecruit,getRecruitInfo} from '@/api/content'
export default {
  components: { EditorBar },
  name: 'PublishRecruit',
  data() {
    return {
      loading:false,
      cityOptions:[],
      defaultCity:[],
      form:{
        position_name:'',
        education:'',
        experience:'',
        mobile:'',
        salary:'',
        address:'',
        content:'',
        certificate:'',
        province:''
      },
      rules: {
        position_name: [{ required: true, message: '请输入招聘职位', trigger: 'blur' }],
        education: [{ required: true, message: '请输入学历要求', trigger: 'blur' }],
        experience: [{ required: true, message: '请输入工作经验', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入HR联系电话', trigger: 'blur' }],
        salary: [{ required: true, message: '请输入薪资', trigger: 'blur' }],
        content: [{ required: true, message: '请输入工作描述', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        province: [{ required: true, message: '请选择工作地点', trigger: 'blur' }]
      }
    }
  },
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        if(value.id){
          this.loading = true
          this.getRecruitInfo(value.id)
        }else{
          this.initForm()
        }
      }
    }
  },
  created() {
    this.cityOptions = citys
  },
  methods: {
    initForm(){
      this.form={
        position_name:'',
        education:'',
        experience:'',
        mobile:'',
        salary:'',
        address:'',
        content:'',
        certificate:'',
        province:''
      }
      this.$refs['editor'].set('')
      this.defaultCity = []
    },
    async getRecruitInfo(id){
      const {code,data} = await getRecruitInfo({id})
      if(code===0){
        this.defaultCity = [data.province+'',data.city+'',data.district+'']
        this.form = {...data}
        const timer = setTimeout(() => {
          this.loading = false
          this.$refs['editor'].set(data.content)
          clearTimeout(timer)
        }, 500)
      }
    },
    // 监听富文本的输入
    catchData(e) {
      this.form.content = e
    },
    changeCity(e){
      this.form.province=e[0]
      this.form.city=e[1]
      this.form.district=e[2]
    },
    submit(){
      this.$refs['form'].validate(async(valid) => {
        if(valid){
          const params = JSON.parse(JSON.stringify(this.form))
          const keys = ['address','certificate','city','content','district','education','experience','id','mobile','position_name','province','salary']
          for(const k in params){
            if(keys.indexOf(k)===-1){
              delete params[k]
            }
          }
          const {code} = await editRecruit(params)
          if(code===0){
            this.$message({
              message:params.id?'编辑成功':'发布成功',
              type:'success'
            })
            this.initForm()
            this.$refs['form'].resetFields()
            let timer = setTimeout(()=>{
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.go(-1)
              clearTimeout(timer)
            },200)
          }
        }
      })
    },
  }
}
</script>
<style lang="scss">
.publish{
  position: relative;
  .editor{
    .el-form-item__content{
      z-index: 99;
    }
    .w-e-full-screen-editor {
      position: fixed;
      width: 100vw!important;
      height: 100vh!important;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
  .el-form-item{
    position: relative;
  }
  .el-cascader,.el-select{
    width: 100%;
  }
  .el-form-item__content{
    z-index: 1;
  }
  .text{
    position: absolute;
    right: 3%;
    top: 50%;
    transform: translateY(-50%);
  }
  .btn{
    position: absolute;
    bottom: 2%;
    left: 50%;
    transform: translateX(-50%);
    button{
      background-color: #3954B3;
      width: 98px;
      color: #fff;
    }
  }
}
</style>
