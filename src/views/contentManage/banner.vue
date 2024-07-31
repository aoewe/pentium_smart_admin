<template>
  <div v-loading="loading" class="banner main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <el-button class="add" style="border-color:#3954b3" icon="el-icon-plus" type="primary" @click="dialogVisible = true, text = '添加'">添 加</el-button>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="order" label="序号" width="130"/>
        <el-table-column label="banner" min-width="300">
          <template slot-scope="scopes">
            <div class="demo-image__preview banner-img" v-if="scopes.row.is_video===0">
              <el-image fit="cover" :src="scopes.row.url" :preview-src-list="[scopes.row.url]">
                <div slot="error" class="image-slot">
                  <img src="../../assets/ic_default.jpg" alt="">
                </div>
              </el-image>
            </div>
            <video v-else controls :src="scopes.row.video_url"/>
          </template>
        </el-table-column>
        <el-table-column label="banner类型" min-width="300">
          <template slot-scope="scopes">{{ scopes.row.type===1 ? '前端首页' : scopes.row.type===2 ? '福利商城' : '配件商城' }}</template>
        </el-table-column>
        <el-table-column label="文件类型" min-width="300">
          <template slot-scope="scopes">{{ scopes.row.is_video===1 ? '视频' : '图片' }}</template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" min-width="300" />
        <!-- <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              @change="changeArticleStatus(scope.row)"
            />
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button style="padding:0" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button style="padding:0" type="text" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <el-dialog :title="text" :visible.sync="dialogVisible" :before-close="initForm" width="550px">
        <div v-loading="upLoading" element-loading-text="上传中" element-loading-spinner="el-icon-loading">
          <el-form ref="form" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type">
                <el-option :value="1" label="前端首页" />
                <el-option :value="2" label="福利商城" />
                <el-option :value="3" label="配件商城" />
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
            <div v-if="form.type===1">
              <el-form-item label="视频封面" prop="url">
                <span style="color:#e6a23c;">建议尺寸  1125px * 624px</span>
                <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeBanner">
                  <img v-if="form.url" :src="form.url" class="avatar">
                  <i v-if="!form.url" class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
              <el-form-item label="视频链接" prop="video_url">
                <el-input v-model="form.video_url" placeholder="请输入视频链接" />
                <!-- <span style="color:#e6a23c;">建议尺寸  1125px * 624px</span>
                <el-upload class="avatar-uploader" action="#" accept="video/mp4,video/quicktime,video/avi" :auto-upload="false" :show-file-list="false" :on-change="changeVideo">
                  <video v-if="form.video_url" :src="form.video_url" class="avatar"/>
                  <i v-if="!form.video_url" class="el-icon-plus avatar-uploader-icon" />
                </el-upload> -->
              </el-form-item>
            </div>
            <el-form-item label="banner" prop="url" v-else>
              <span style="color:#e6a23c;">建议尺寸  1125px * 624px</span>
              <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeBanner">
                <img v-if="form.url" :src="form.url" class="avatar">
                <i v-if="!form.url" class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item label="链接" v-if="form.type!==1">
              <el-input v-model="form.link" placeholder="跳转链接" />
            </el-form-item>
            <el-form-item label="排序" prop="order">
              <el-input class="order" v-model="form.order" type="number" placeholder="数字排序" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="initForm()">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </span>
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
import {bannerList,setBanner,deleteBanner} from '@/api/content'
import { uploadImgs } from '@/api/public'
import { compressAccurately } from '@/utils'
export default {
  name: 'Banner',
  data() {
    return {
      loading:true,
      upLoading:false,
      text:'添加',
      dialogVisible:false,
      page:1,
      size:6,
      total:0,
      file:null,//banner文件
      videoFile:null,//视频文件
      list:[],
      form:{
        title:'',
        order:'',
        video_url:'',
        is_video:0,
        type:'',
        link:'',
        url:''
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        order: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        url: [{ required: true, message: '请添加图片', trigger: 'blur' }],
        video_url: [{ required: true, message: '请添加视频', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.bannerList()
  },
  methods: {
    del(row){
      this.$confirm('此操作将永久删除该banner, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {code} = await deleteBanner({id:row.id})
        if(code===0){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.bannerList()
        }
      }).catch(() => {
      })
    },
    edit(row){
      this.text = '编辑'
      this.form.id = row.id
      this.form.title = row.title
      this.form.type = row.type
      this.form.is_video = row.is_video
      this.form.link = row.link
      this.form.order = row.order
      this.form.video_url = row.video_url
      this.form.url = row.url
      this.dialogVisible = true
    },
    initForm(){
      this.form = {
        type:'',
        order:'',
        is_video:0,
        title:'',
        url:'',
        video_url:''
      }
      this.dialogVisible = false
      this.upLoading = false
      this.file=null
    },
    submit(){
      this.$refs['form'].validate(async value => {
        if(value){
          this.upLoading = true
          const params = JSON.parse(JSON.stringify(this.form))
          if (this.file && this.file.raw) {
            const res = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', res)
            formData.append('path_name', `system/${this.file.name}`)
            const { code, data } = await uploadImgs(formData)
            if (code === 0) params.url = `${data.url[0]}`
          }
          if(this.videoFile && this.videoFile.raw){
            const videoData = new FormData()
            videoData.append('file[]', this.videoFile.raw)
            videoData.append('path_name', `system/${this.videoFile.name}`)
            const { code, data } = await uploadImgs(videoData)
            if (code === 0) params.video_url = `${data.url[0]}`
          }
          // if (params.url) params.url = params.url.split('com')[1]
          const res = await setBanner(params)
          if(res.code===0){
            this.$message({
              type:'success',
              message:this.text+'成功'
            })
            this.initForm()
            this.bannerList()
          }
        }
      })
    },
    changeBanner(file) {
      this.file = file
      this.form.url = URL.createObjectURL(file.raw)
    },
    changeVideo(file) {
      this.form.is_video = 1
      this.videoFile = file
      this.form.video_url = URL.createObjectURL(file.raw)
    },
    async bannerList(){
      const params = {
        sorts:{},
        filters:{},
        page:this.page,
        size:this.size
      }
      const {code,data} = await bannerList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val){
      this.loading = true
      this.page = val
      this.bannerList()
    }
  }
}
</script>
<style lang="scss">
.el-icon-circle-close:before{
  color: #fff;
}
.banner{
  .banner-img{
    img{
      border-radius: 5px;
    }
  }
  .list{
    margin: 20px 0 50px;
  }
  .el-select{
    width: 100%;
  }
  .add{
    background-color: #3954b3;
    color: #fff;
  }
  video{
    height: 70px;
    width: 120px;
    border-radius: 6px;
    object-fit: cover;
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
      width: 410px;
      height: 160px;
      line-height: 160px;
      text-align: center;
    }
    .avatar {
      width: 408px;
      height: 160px;
      display: block;
    }
  }
  .order{
    .el-input__inner{
      width: 204px !important;
      padding-right: 0;
    }
  }
}

</style>
