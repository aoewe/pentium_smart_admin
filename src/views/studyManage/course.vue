<template>
  <div
    v-loading="loading"
    class="video-list main-box"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="select">
      <el-input size="small" placeholder="请输入课程名称" v-model="title" style="margin-right:3px;">
        <template slot="prepend">课程名称</template>
      </el-input>
      <el-cascader placeholder="请选择课程分类" size="small" v-model="category" :options="categoryList" :props="props"/>
      <el-button size="small" @click="search(true)">查 询</el-button>
      <el-button size="small" @click="search(false)">重 置</el-button>
    </div>
    <router-link to="./editCourse">
      <el-button class="add-video" icon="el-icon-plus">新增</el-button>
    </router-link>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="课程标题" prop="title" min-width="200"/>
        <el-table-column label="课程封面" min-width="200">
          <template slot-scope="scope">
            <el-image fit="cover" class="cover" :preview-src-list="[scope.row.banner_pic]" :src="scope.row.banner_pic">
              <div slot="error" class="image-slot">
                <img src="../../assets/ic_default.jpg" alt="">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="create_time" min-width="200"/>
        <el-table-column label="课程简介" min-width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.profile}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.profile}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="下载地址" min-width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.content}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.content}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <router-link style="color:#3954b3;font-size: 14px;padding-right: 15px;" :to="{path:`./editCourse?id=${scope.row.id}`}">编辑</router-link>
            <el-button type="text" @click="delRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" fixed="right" width="200">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
              active-color="#3954B3"
              inactive-color="#666666"
              :disabled="switchId===scope.row.id"
              active-text="上架" inactive-text="下载"
              :active-value="1"
              :inactive-value="0"
              @change="e=>changeStatus(e,scope.row)"></el-switch>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import {getLessonList,getCategory,delLesson} from '@/api/study'
export default {
  name: 'Course',
  data() {
    return {
      props:{checkStrictly: true,label: 'title'},
      list: [],
      categoryList:[],
      category:'',
      status: '',
      title:'',
      size: 10,
      page: 1,
      total: 0,
      switchId:'',
      loading: true
    }
  },
  created() {
    this.getLessonList()
    this.getCategory()
  },
  methods: {
    delRow(id){
      this.$confirm('是否删除该课程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        const {code} = await delLesson({id})
        if(code===0){
          this.getLessonList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }else{
          this.loading = false
        }
      })
    },
    search(e){
      this.loading = true
      let filters = {}
      if(this.category){
        filters.class_one = this.category[0]
        if(this.category.length>1){
          filters.class_two = this.category[1]
        }
      }
      this.title && (filters.title = this.title)
      !e && (filters = {},this.category='',this.title='')
      this.getLessonList(filters)
    },
    async getCategory(){
      const {code,data} = await getCategory()
      if(code===0){
        this.categoryList = data
      }
    },
    async getLessonList(filters={}){
      const params = {
        page:this.page,
        size:this.size,
        sorts:{},
        filters
      }
      const {code,data} = await getLessonList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    async changeStatus(val,row) {
      this.switchId = row.id
      const { code } = await setMessageStatus({ id: row.id, status: val })
      if(code===0){
        this.switchId = ''
        row.status = val
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getLessonList()
    }
  }
}
</script>
<style lang="scss">
.video-list {
  .select {
    display: flex;
    align-items: center;
    .el-cascader{
      width: 224px;
      margin-right: 106px;
    }
    .el-input {
      width: 300px;
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
  .add-video{
    float: right;
    margin: 20px 24px 30px 0;
  }
  .list {
    margin-bottom: 60px;
  }
}
</style>

