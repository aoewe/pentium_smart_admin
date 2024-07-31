<template>
  <div v-loading="loading" class="subject-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <el-select size="small" clearable placeholder="请选择试题类型" v-model="type" style="margin-right: 3px">
        <el-option :value="1" label="单选" />
        <el-option :value="2" label="多选" />
      </el-select>
      <el-cascader size="small" clearable placeholder="请选择试题分类" v-model="lesson_info_id" :props="props"/>
      <el-button size="small" @click="search(true)">查 询</el-button>
      <el-button size="small" @click="search(false)">重 置</el-button>
    </div>
    <router-link to="./editStudent">
      <el-button class="add-video" icon="el-icon-plus">新增</el-button>
    </router-link>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="题目" min-width="300">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.question}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.question}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="试题类型" min-width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.lesson_title}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.lesson_title}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="试题分类" min-width="120">
          <template slot-scope="scope">
            <u>{{scope.row.question_type===1?`选择题/${scope.row.type===1?'单选':'多选'}`:'问答题'}}</u>
          </template>
        </el-table-column>
        <el-table-column label="选项A" min-width="100">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.content[0]?scope.row.content[0].value:'- -'}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.content[0]?scope.row.content[0].value:'- -'}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="选项B" min-width="100">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.content[1]?scope.row.content[1].value:'- -'}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.content[1]?scope.row.content[1].value:'- -'}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="选项C" min-width="100">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.content[2]?scope.row.content[2].value:'- -'}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.content[2]?scope.row.content[2].value:'- -'}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="选项D" min-width="100">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="500"
              trigger="hover">
              <div>{{scope.row.content[3]?scope.row.content[3].value:'- -'}}</div>
              <span slot="reference" class="ellipsis-text">{{scope.row.content[3]?scope.row.content[3].value:'- -'}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="正确答案" min-width="200">
          <template slot-scope="scope">
            <span style="color:#EE5454" v-if="scope.row.question_type===1">{{scope.row.right_answer}}</span>
            <el-popover
              v-else
              placement="top"
              width="500"
              trigger="hover">
              <div style="color:#EE5454">{{scope.row.answer_info}}</div>
              <span slot="reference" class="ellipsis-text" style="color:#EE5454">{{scope.row.answer_info}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <router-link style="color:#3954b3;font-size: 14px;padding-right: 15px;" :to="{path:`./editStudent?info=${toJsonStr(scope.row)}`}">编辑</router-link>
            <el-button type="text" @click="delRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination :page-size="size" layout="prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
import { getExamination,delExamination,getLessonSelect } from '@/api/study'
export default {
  name: 'Subject',
  data() {
    return {
      list: [],
      lesson_info_id: '',
      size: 10,
      page: 1,
      total: 0,
      type:'',
      switchId:'',
      loading: true,
      props: {
        lazy: true,
        label:'title',
        value:'id',
        async lazyLoad (node, resolve) {
          const nodes = []
          if(node.level === 0 ){
           const {code,data} = await getLessonSelect()
              if(code===0) resolve(data)
          }else{
            const {code,data} = await getLessonSelect({lesson_id:node.value})
            if(code===0){
              data.map(i=>{
                let obj = {
                  id: i.id,
                  title: i.title,
                  leaf: node.level >= 1
                }
                nodes.push(obj)
              })
              resolve(nodes)
            }
          }
        }
      }
    }
  },
  watch:{
    
  },
  created() {
    this.getExamination()
  },
  methods: {
    search(e){
      this.loading = true
      let filters = {}
      this.lesson_info_id && (filters.lesson_info_id = this.lesson_info_id[1])
      this.type && (filters.type = this.type)
      !e && (filters = {},this.lesson_info_id='',this.type='')
      this.getExamination(filters)
    },
    delRow(id){
      this.$confirm('是否删除该试题？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        const {code} = await delExamination({id})
        if(code===0){
          this.getExamination()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }else{
          this.loading = false
        }
      })
    },
    toJsonStr(row){
      return JSON.stringify(row)
    },
    async getExamination(filters={}){
      const params = {
        page:this.page,
        size:this.size,
        sorts:{},
        filters
      }
      const {code,data} = await getExamination(params)
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
      this.getExamination()
    }
  }
}
</script>
<style lang="scss">
.subject-list {
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

