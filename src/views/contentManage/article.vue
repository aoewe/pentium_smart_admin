<template>
  <div v-loading="load" class="main-box article" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <el-select placeholder="请选择文章类型" size="small" v-model="type">
        <el-option v-for="item in articleType" :key="item.code_id" :value="item.code_id" :label="item.code_name" />
      </el-select>
      <el-button size="small" @click="load=true,getArticleList()">查 询</el-button>
      <el-button size="small" @click="type = '', getArticleList()">重 置</el-button>
    </div>
    <el-button class="add" style="border-color:#3954b3" icon="el-icon-plus" type="primary" plain @click="dialogVisible = true, editText = '添加文章'">添 加</el-button>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="300" />
        <el-table-column label="封面" min-width="200">
          <template slot-scope="scopes">
            <div class="demo-image__preview">
              <el-image fit="cover" :src="scopes.row.banner_url" :preview-src-list="[scopes.row.banner_url]">
                <div slot="error" class="image-slot">
                  <img src="../../assets/ic_default.jpg" alt="">
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" min-width="200" />
        <el-table-column label="类型" width="180">
          <template slot-scope="scopes">{{ scopes.row.type===1 ? '隐私协议' : scopes.row.type===2 ? '用户协议' : scopes.row.type===3 ? '头条快讯' : '行业动态' }}</template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="180" />
        <el-table-column label="状态" width="200">
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
              @change="e=>changeArticleStatus(e,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button style="padding:0" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button style="padding:0" type="text" @click="deleteArticle(scope.row)">删除</el-button>
            <el-button style="padding:0" type="text" @click="preview(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="editText" :visible.sync="dialogVisible" :before-close="initForm" width="80%">
      <el-form ref="articleForm" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" :model="articleForm" :rules="rules" label-width="100px">
        <div class="row2">
          <el-form-item label="文章类型" prop="type">
            <el-select v-model="articleForm.type">
              <el-option v-for="item in articleType" :key="item.code_id" :value="item.code_id" :label="item.code_name" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="articleForm.title" placeholder="请输入标题" />
          </el-form-item>
        </div>
        <div class="row2">
          <el-form-item label="作者">
            <el-input v-model="articleForm.author" placeholder="请输入作者名称" />
          </el-form-item>
          <el-form-item label="时间" prop="create_time">
            <el-date-picker v-model="articleForm.create_time" type="datetime" placeholder="选择日期时间" default-time="12:00:00"></el-date-picker>
          </el-form-item>
        </div>
        <div class="row2">
          <el-form-item label="封面">
            <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeBanner">
              <img v-if="articleForm.banner_url" :src="articleForm.banner_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model="articleForm.status">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="内容" prop="content" class="editor">
          <editor-bar ref="editor" :catch-data="catchData" :content="editorContent" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="预览" :visible.sync="showView" width="80%">
      <div class="html">
        <div v-html="html" />
      </div>
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
import EditorBar from './components/editoritem'
import { getArticleList, changeArticleStatus, getArticleType, editArticle } from '@/api/content'
import { uploadImgs } from '@/api/public'
import { compressAccurately } from '@/utils'
export default {
  name: 'Article',
  components: { EditorBar },
  data() {
    return {
      list: [],
      load: true,
      switchId:null,
      type: '',
      loading: false,
      showView: false,
      html: '',
      editText: '添加文章',
      rules: {
        title: [{ required: true, message: '请输文章标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        status: [{ required: true, message: '请选择文章状态', trigger: 'blur' }],
        create_time: [{ required: true, message: '请选择文章发布时间', trigger: 'blur' }],
      },
      dialogVisible: false,
      size: 5,
      file: null,
      articleForm: {
        title: '',
        create_time:'',
        author: '',
        banner_url: '',
        content: '',
        type: '',
        status: 1
      },
      articleType: [],
      total: 0,
      page: 1
    }
  },
  created() {
    this.getArticleList()
    this.getArticleType()
  },
  methods: {
    initForm() {
      this.$refs['articleForm'].resetFields()
      this.$refs['editor'].init()
      this.dialogVisible = false
      this.articleForm = {
        title: '',
        author: '',
        create_time:'',
        banner_url: '',
        content: '',
        type: '',
        status: 1
      }
    },
    edit(row) {
      this.loading = true
      this.articleForm = { ...row }
      this.dialogVisible = true
      const timer = setTimeout(() => {
        this.loading = false
        this.$refs['editor'].set(row.content)
        clearTimeout(timer)
      }, 500)
    },
    preview(row) {
      this.showView = true
      this.html = row.content
    },
    deleteArticle(row) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code } = await changeArticleStatus({ id: row.id, status: 2 })
        if (code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getArticleList()
        }
      })
    },
    submit() {
      this.$refs['articleForm'].validate(async value => {
        if (value) {
          const params = JSON.parse(JSON.stringify(this.articleForm))
          params.create_time =  new Date(this.articleForm.create_time).getTime().toString().slice(0,-3)
          if (this.file && this.file.raw) {
            const res = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', res)
            formData.append('path_name', `system/${this.file.name}`)
            const { code, data } = await uploadImgs(formData)
            if (code === 0) params.banner_url = `${data.url[0]}`
          }
          // if (this.articleForm.banner_url) this.articleForm.banner_url = this.articleForm.banner_url.split('com')[1]
          const { code } = await editArticle(params)
          if (code === 0) {
            this.$message({
              type: 'success',
              message: this.editText === '添加文章' ? '添加成功' : '修改成功'
            })
            this.getArticleList()
            this.initForm()
          }
        }
      })
    },
    async getArticleType() {
      const { code, data } = await getArticleType()
      if (code === 0) {
        this.articleType = data
      }
    },
    changeBanner(file) {
      this.file = file
      this.articleForm.banner_url = URL.createObjectURL(file.raw)
    },
    // 监听富文本的输入
    catchData(e) {
      this.articleForm.content = e
    },
    // 富文本中的内容
    editorContent(e) {
      console.log(e)
    },
    async getArticleList() {
      const filters = {}
      if (this.type) filters.type = this.type
      const { code, data } = await getArticleList({
        page: this.page,
        size: this.size,
        filters,
        sorts: {}
      })
      if (code === 0) {
        this.total = data.total
        data.list.map(i=>{
          i.create_time=i.create_time.slice(0,-9)
        })
        this.list = data.list
        this.load = false
      }
    },
    handleCurrentChange(val) {
      this.load = true
      this.page = val
      this.getArticleList()
    },
    async changeArticleStatus(val,row) {
      this.switchId = row.id
      const { code } = await changeArticleStatus({ id: row.id, status: val })
      if (code === 0){
        row.status = val
        this.switchId = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.article{
  .html{
    overflow-y: scroll;
    height: 80vh;
  }
  .banner-img{
    height: 120px;
    width: 200px;
  }
  .list{
    margin: 20px 0 40px 0;
  }
  .row2{
    display: flex;
    justify-content: space-between;
    width: 100%;
    .el-form-item{
      width: 42%;
    }
    .el-input,.el-select{
      width: 100%;
    }
  }
  .add{
    background-color: #3954b3;
    color: #fff;
  }
  .select {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
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
}
</style>
<style lang="scss">
.el-icon-circle-close:before{
  color: #fff;
}
.editor{
  .el-form-item__content{
    z-index: 1;
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
.avatar-uploader {
  height: 160px;
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
    width: 160px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 160px;
    height: 160px;
    display: block;
  }
}
</style>
