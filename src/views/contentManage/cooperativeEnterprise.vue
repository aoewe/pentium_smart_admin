<template>
  <div v-loading="loading" class="e-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <el-button class="add" style="border-color:#3954b3" icon="el-icon-plus" type="primary" @click="dialogVisible = true, text = '添加'">添加</el-button>
    <div class="list" v-if="list.length">
      <el-row :gutter="20">
        <el-col :md="12" :lg="8" :xl="6" v-for="(item,index) in list" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <div class="box">
              <span class="order">序号：{{item.order || '- -'}}</span>
              <div>
                <span>企业logo：</span>
                <div class="logo"><img :src="item.logo"></div>
              </div>
              <div class="name">
                <span>企业名称：</span>
                <span>{{item.name}}</span>
              </div>
              <div>
                <span>操作：</span>
                <div class="dialog-footer">
                  <el-button @click="handelRow(item)">编辑</el-button>
                  <el-button @click="delRow(item.id)" style="color:#fff;">删除</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else class="not">
      暂无数据
    </div>
    <el-dialog :title="text" :visible.sync="dialogVisible" :before-close="initForm" width="550px">
      <el-form ref="form" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业LOGO" prop="logo">
          <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeLogo">
            <img v-if="form.logo" :src="form.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-input class="order" v-model="form.order" placeholder="数字排序" type="number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
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
import { setCompanyLogo,companyLogoList,deleteLogo } from '@/api/content'
import { uploadImgs } from '@/api/public'
import { compressAccurately } from '@/utils'

export default {
  name: 'CooperativeEnterprise',
  data() {
    return {
      loading:true,
      page:1,
      size:16,
      total:0,
      dialogVisible:false,
      text:'添加',
      form:{
        name:'',
        order:'',
        logo:''
      },
      rules: {
        logo: [{ required: true, message: '请上传企业LOGO', trigger: 'blur' }],
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }]
      },
      file:null,
      list:[]
    }
  },
  created() {
    this.companyLogoList()
  },
  methods: {
    delRow(id){
      this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {code} = await deleteLogo({id})
        if(code===0){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.companyLogoList()
        }
      }).catch(() => {
              
      })
      
    },
    handelRow(row){
      this.text = '编辑'
      this.form.logo = row.logo
      this.form.name = row.name
      this.form.id = row.id
      this.form.order = row.order
      this.dialogVisible = true
    },
    changeLogo(file) {
      this.file = file
      this.form.logo = URL.createObjectURL(file.raw)
    },
    initForm(){
      this.form = {
        logo:'',
        order:'',
        name:''
      }
      this.dialogVisible = false
      this.file=null
    },
    submit(){
      this.$refs['form'].validate(async value => {
        if(value){
          const params = JSON.parse(JSON.stringify(this.form))
          if (this.file && this.file.raw) {
            const res = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', res)
            formData.append('path_name', `system/${this.file.name}`)
            const { code, data } = await uploadImgs(formData)
            if (code === 0) params.logo = `${data.url[0]}`
          }
          // if (params.logo) params.logo = params.logo.split('com')[1]
          const res = await setCompanyLogo(params)
          if(res.code===0){
            this.$message({
              type:'success',
              message:this.text+'成功'
            })
            this.companyLogoList()
            this.initForm()
          }
        }
      })
    },
    async companyLogoList(){
      const params = {
        page: this.page,
        size: this.size,
        sorts: {},
        filters: {}
      }
      const {code,data} = await companyLogoList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val){
      this.loading = true
      this.page = val
      this.companyLogoList()
    }
  }
}
</script>
<style lang="scss">
.e-list{
  .el-dialog__body{
    padding: 30px 20px 0;
  }
  .not{
    text-align: center;
    margin-top: 50px;
    color: #909399;
    font-size: 15px;
  }
  .list{
    margin: 20px 0 50px;
    // box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    // padding: 20px 20px 0;
    .el-col{
      padding-bottom: 20px;
    }
    .box{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
      font-size: 17px;
      color: #333;
      background-color: #F5F6FA;
      position: relative;
      .order{
        position: absolute;
      }
      &>div:first-child{
        padding-bottom: 5px;
      }
      &>div{
        display: flex;
        align-items: center;
        &>span:first-child{
          min-width: 30%;
          display: block;
        }
        .logo{
          background-color: #fff;
          width: 60%;
          display: flex;
          justify-content: center;
          height: 60% * 1.6112;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .name{
        padding-bottom: 0;
        height: 50px;
        & span:last-child{
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .avatar-uploader {
    width: 204px;
    height: 82px;
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
      width: 204px;
      height: 82px;
      line-height: 82px;
      text-align: center;
    }
    .avatar {
      width: 204px;
      height: 82px;
      display: block;
    }
  }
  .add{
    background-color: #3954b3;
    color: #fff;
  }
  .order{
    .el-input__inner{
      width: 204px !important;
      padding-right: 0;
    }
  }
}
</style>
