<template>
  <div v-loading="loading" class="edit-course main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <p class="title">基本信息</p>
    <el-form label-width="120px" :model="form" :rules="rules" ref="form" >
      <el-form-item label="课程标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入课程标题"/>
      </el-form-item>
      <el-form-item label="课程分类" prop="category">
        <el-cascader placeholder="请选择课程分类" v-model="form.category" :options="categoryList" :props="props"/>
      </el-form-item>
      <el-form-item label="课程下载地址" prop="content">
        <el-input v-model="form.content" placeholder="请输入课程下载地址"/> 
      </el-form-item>
      <el-form-item label="课程简介">
        <el-input v-model="form.profile" autosize type="textarea" placeholder="请输入课程简介"/>
      </el-form-item>
      <el-form-item label="序号">
        <el-input class="sort" v-model="form.sorts" type="number" placeholder="请输入课程序号"/>
      </el-form-item>
      <el-form-item label="课程内容" prop="lesson_info">
        <el-table border :data="form.lesson_info">
          <el-table-column label="章节封面图" min-width="120px">
            <template slot-scope="scope">
              <el-upload
                :show-file-list="false"
                :action="action"
                name="file[]"
                :before-upload="beforeUpload"
                :on-success="res => imageUpload(res, scope.row)"
              >
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  v-if="!scope.row.video_pic[0]"
                  >上传图片</el-button
                >
                <el-image
                  v-else
                  style="width: 80px; height: 50px"
                  :src="scope.row.video_pic[0]"
                  fit="scale-down"
                />
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="章节标题" min-width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.title" placeholder="请输入章节标题" size="small"/>
            </template>
          </el-table-column>
          <el-table-column label="视频地址" min-width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.video" placeholder="请输入视频地址" size="small"/>
            </template>
          </el-table-column>
          <el-table-column label="序号" min-width="120px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort" class="sort" type="number" placeholder="请输入章节序号" size="small"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click="delRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button icon="el-icon-plus" size="small" @click="addLesson">添加章节</el-button>
      </el-form-item>
      <el-form-item label="课程封面图" prop="banner_pic" class="cover">
        <el-upload
          :class="form.banner_pic.length?'hide':''"
          list-type="picture-card"
          action="#"
          :auto-upload="false"
          :file-list="form.banner_pic"
          :on-change="file => changeImg(file)"
          :on-remove="file => removeImg(file)"
        >
          <i class="el-icon-upload"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button>取消</el-button>
      <el-button type="primary" @click="submit">发布</el-button>
    </div>
  </div>
</template>
<script>
import {editLesson,getCategory,getLessonInfo} from '@/api/study'
import {uploadImgs} from '@/api/public'
import { compressAccurately } from '@/utils'
export default {
  name: 'EditCourse',
  data() {
    return {
      loading: false,
      action: `/api/backend/upload/uploadImg`,
      props:{checkStrictly: true,label: 'title'},
      categoryList:[],
      options:[],
      form:{
        title:'',
        category:'',
        banner_pic:[],
        content:'',
        sorts:'',
        profile:'',
        lesson_info:[]
      },
      dleLessonList:[],
      rules:{
        title: [{ required: true, message: '请输入课程标题', trigger: 'blur' }],
        category: [{ required: true, message: '请选择课程分类', trigger: 'blur' }],
        banner_pic: [{ required: true, message: '请选择课程封面图', trigger: 'blur' }],
        // content: [{ required: true, message: '请输入课程下载地址', trigger: 'blur' }],
        profile: [{ required: true, message: '请输入课程简介', trigger: 'blur' }],
        lesson_info: [{ required: true, message: '请添加课程章节', trigger: 'blur' }]
      }
    }
  },
  watch:{
    id: {
      immediate: true,
      handler(value) {
        if(value){
          this.loading = true
          this.getLessonInfo(value)
        }else{
          this.initForm()
        }
      }
    }
  },
  computed:{
    id(){return this.$route.query.id || ''}
  },
  created() {
    this.getCategory()
  },
  methods: {
    async getLessonInfo(id){
      const {code,data} = await getLessonInfo({id})
      if(code===0){
        let form = {}
        form = {...data}
        form.category=[]
        form.lesson_info = form.info
        form.lesson_info.forEach(i=>{
          if(i.video_pic){
            i.video_pic = [i.video_pic]
          }else{
            i.video_pic = []
          }
          delete i.create_time
          delete i.update_time
        })
        form.banner_pic = [{url:form.banner_pic}]
        form.category[0]=form.class_one
        form.class_two>0?form.category[1]=form.class_two:''
        delete form.finish_num
        delete form.create_time
        delete form.class_two
        delete form.class_one
        delete form.info
        this.form = form
      }
      this.loading = false
    },
    initForm(){
      this.form={
        title:'',
        category:'',
        banner_pic:[],
        content:'',
        sorts:'',
        profile:'',
        lesson_info:[]
      }
    },
    delRow(index){
      const {form} = this
      form.lesson_info[index].is_del=true
      this.dleLessonList.push(form.lesson_info[index])
      form.lesson_info.splice(index,1)
    },
    // 章节封面
    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        const isJPG = file.type === 'image/jpeg'
        const isPng = file.type === 'image/png'
        if (!isJPG && !isPng) {
          this.$message.warning('上传图片只能是 JPG 或者 PNG 格式!')
          return reject(false)
        }
        let compress = 600 // 假设图片限制不能大于1M
        let sizeOver = file.size / 300 > compress //文件大小 是否大于指定大小
        if (sizeOver && compress) {
          const res = await compressAccurately(file, sizeOver)
          file = res
        }
        resolve(true)
      })
    },
    imageUpload(res, row) {
      row.video_pic = res.data.url
    },
    addLesson(){
      this.form.lesson_info.push({
        title:'',
        video_pic:[],
        video:'',
        sort:''
      })
    },
    // upload
    changeImg(file) {
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') return this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
      this.form.banner_pic = [{url:URL.createObjectURL(file.raw),file:file.raw}]
    },
    removeImg(){
      this.form.banner_pic = []
    },
    async getCategory(){
      const {code,data} = await getCategory()
      if(code===0){
        this.categoryList = data
      }
    },
    submit(){
      this.$refs['form'].validate(async valid=>{
        if(valid){
          this.loading = true
          const params = JSON.parse(JSON.stringify(this.form))
          params.class_one = params.category[0]
          params.category[1]?params.class_two = params.category[1]:''
          delete params.category
          delete params.class_two_name
          if(this.form.banner_pic[0].file){
            const res = await compressAccurately(this.form.banner_pic[0].file,500)
            const main = new FormData()
            main.append('file[]', res)
            main.append('path_name', `adminImg/default`)
            const m = await uploadImgs(main)
            if(m.code===0){
              params.banner_pic=m.data.url[0]
            }else{
              this.loading = false
            }
          }
          params.lesson_info.map(i=>{
            i.video_pic = i.video_pic[0]
          })
          params.lesson_info.push(...this.dleLessonList)
          const {code} = await editLesson(params)
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
          }else{
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.edit-course {
  padding: 0 32px 10px;
  .el-table{
    th{
      padding: 0;
    }
    .cell{
      text-align: center;
    }
    .el-input{
      width: 80%;
    }
  }
  .sort{
    .el-input__inner{
      padding-right: 0;
    }
  }
  .el-upload-list__item{
    height: 200px;
    width: 155px;
  }
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    margin: 0;
    padding: 30px;
    font-size: 20px;
  }
  .el-input,.el-textarea{
    width: 380px;
  }
  .dialog-footer{
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .hide {
    .el-upload{
      display: none !important;
    }
  }
}
</style>

