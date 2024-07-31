<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="main-box customer-class">
    <el-button class="add" @click="text='新增',dialogVisible=true">新增</el-button>
    <div class="table">
      <el-table :data="list" row-key="id" :tree-props="{children: 'child', hasChildren: 'hasChildren'}">
        <el-table-column sortable label="分类ID" prop="id"/>
        <el-table-column label="分类名称" prop="name"/>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row,'edit')">编辑</el-button>
            <el-button type="text" @click="edit(scope.row,'add')" v-if="scope.row.child">新增</el-button>
            <el-button type="text" @click="delCustomerCategory(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="text" :visible.sync="dialogVisible" width="500px" :before-close="initForm"  v-loading="true" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <el-form :model="form" :rules="rules" ref="form" label-width="90px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
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
import {getCustomerCategory,editCustomerCategory,delCustomerCategory} from '@/api/crm'
export default {
  name: 'CustomerClass',
  data() {
    return {
      text:'',
      dialogVisible:false,
      loading:true,
      form:{
        name:'',
        level:1
      },
      rules:{
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      list:[]
    }
  },
  created(){
    this.getCustomerCategory()
  },
  methods:{
    edit(row,type){
      if(row.child && type==='edit'){
        this.form.level=1
      }else{
        this.form.level=2
      }
      if(type==='add'){
        this.form.parent_id = row.id
      }else{
        this.text = '编辑'
        this.form.name = row.name
        this.form.id = row.id
        delete this.form.parent_id
      }
      this.dialogVisible = true
    },
    async submit(){
      this.$refs['form'].validate(async value=>{
        if(value){
          const params = JSON.parse(JSON.stringify(this.form))
          const {code} = await editCustomerCategory(params)
          if(code===0){
            this.$message({
              type:'success',
              message:this.text+'成功'
            })
            this.initForm()
            this.getCustomerCategory()
          }
        }
      })
    },
    initForm(){
      this.form = {
        name:'',
        level: 1
      }
      this.$refs['form'].resetFields()
      this.dialogVisible=false
    },
    async delCustomerCategory(row){
      console.log()
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const {code} = await delCustomerCategory({ id: row.id })
          if(code===0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.page > 1) {
              this.page--
            }
            this.getCustomerCategory()
          }
        })
        .catch(() => {})
    },
    async getCustomerCategory(){
      const {code,data} = await getCustomerCategory()
      if(code===0){
        this.list = data
        this.loading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.customer-class {
  .el-input{
    width: 300px;
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
}
</style>
<style lang="scss">
.customer-class {
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