<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="main-box course-category">
    <el-button class="add" @click="getCategory,text='新增',dialogVisible=true">新增</el-button>
    <div class="table">
      <el-table :data="list" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column sortable label="分类ID" prop="id"/>
        <el-table-column label="分类名称" prop="name"/>
        <!-- <el-table-column label="分类图片">
          <template slot-scope="scope">
            <el-image :src="scope.row.category_img"></el-image>
          </template>
        </el-table-column> -->
        <el-table-column label="分类层级">
          <template slot-scope="scope">
            <span class="span">{{scope.row.level===1?'一':scope.row.level===2?'二':'三'}}级分类</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.category_status"
              @change="e=>changeStatus(e,scope.row)"
              :disabled="switchId===scope.row.id"
              active-color="#3954B3"
              inactive-color="#666666"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)" :disabled="scope.row.parent_id===0">编辑</el-button>
            <el-button type="text" @click="delCategory(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="text" :visible.sync="dialogVisible" width="900px" :before-close="initForm"  v-loading="true" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <el-form :model="form" :rules="rules" ref="form" label-width="90px">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分类" prop="category_level">
              <el-cascader v-model="form.category_level" :options="categoryList" :props="props"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类图片">
              <el-upload
                class="upload-box"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="file => changeImg(file)"
              >
                <img
                  v-if="form.category_img"
                  :src="form.category_img"
                  class="upload-img"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="category_status">
              <el-radio-group v-model="form.category_status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item v-if="text==='新增'" label="强制添加" prop="froce">
          <el-radio-group v-model="form.froce">
            <el-radio :label="1">强制</el-radio>
            <el-radio :label="0">非强制</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getCategotyList,getCategory,editCategory,delCategory} from '@/api/study'
import {uploadImgs} from '@/api/public'
import {compressAccurately} from '@/utils'
export default {
  name: 'CourseCategory',
  data() {
    return {
      text:'',
      switchId:null,
      props:{checkStrictly: true,label: 'title'},
      dialogVisible:false,
      loading:true,
      categoryList:[],
      form:{
        name:'',
        parent_id:'',
        froce:'',
        category_level:'',
      },
      file:null,
      rules:{
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        category_level: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        froce: [{ required: true, message: '请选择是否强制添加', trigger: 'blur' }]
      },
      list:[]
    }
  },
  created(){
    this.getCategotyList()
    this.getCategory()
  },
  methods:{
    edit(row){
      this.text = '编辑'
      this.form={...row}
      if(this.form.parent_id===0){
        this.form.category_level = [0]
      }else{
        this.form.category_level = [this.form.parent_id,this.form.id]
      }
      this.dialogVisible = true
    },
    delCategory(id){
      this.$confirm('是否删除该分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        const {code} = await delCategory({id})
        if(code===0){
          this.getCategotyList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }else{
          this.loading = false
        }
      })
    },
    async submit(){
      this.$refs['form'].validate(async value=>{
        if(value){
          const params = JSON.parse(JSON.stringify(this.form))
          params.parent_id = params.category_level[params.category_level.length-1]
          params.category_level = params.category_level.length
          if (this.file && this.file.raw) {
            const file = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', file)
            formData.append('path_name', `system/${this.file.name}`)
            const res = await uploadImgs(formData)
            if(res.code===0){
              params.category_img = res.data.url[0]
            }
          }
          for(const k in params){
            if(params[k]==='') delete params[k]
          }
          // if (params.category_img) params.category_img = params.category_img.split('com')[1]
          const {code} = await editCategory(params)
          if(code===0){
            this.$message({
              type:'success',
              message:this.text+'成功'
            })
            this.initForm()
            this.getCategotyList()
          }
        }
      })
    },
    changeImg(file){
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') return this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
      this.file = file
      this.form.category_img = URL.createObjectURL(file.raw)
    },
    initForm(){
      this.form = {
        name:'',
        parent_id:'',
        froce:'',
        category_level:'',
      }
      this.$refs['form'].resetFields()
      this.dialogVisible=false
    },
    async changeStatus(val,row){
      this.switchId = row.id
      const {code} = await changeStatus({ id: row.id, status: val })
      if (code === 0) this.switchId = null
    },
    async getCategory(){
      const {code,data} = await getCategory()
      if(code===0){
        this.categoryList = data
        data.unshift({title:'一级分类',value:0})
      }
    },
    async getCategotyList(){
      const {code,data} = await getCategotyList()
      if(code===0){
        this.list = data
        this.loading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.course-category {
  .el-input,.el-cascader{
    width: 100%;
  }
  .add{
    background-color: #3954B3;
    color: #fff;
  }
  .upload-box {
    height: 104px;
    width: 104px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    border-radius: 4px;
    .upload-img {
      width: 100%;
      height: 100%;
    }
  }
  .footer{
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.course-category {
  .el-dialog__body{
    padding: 20px 50px;
  }
  .table{
    padding-top: 40px;
  }
  .el-upload{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-dialog__header{
    text-align: center;
    font-weight: bold;
  }
}
</style>