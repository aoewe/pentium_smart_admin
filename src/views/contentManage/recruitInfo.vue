<template>
  <div v-loading="loading" class="recruit main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <el-button class="add" style="border-color:#3954b3" icon="el-icon-plus" type="primary" @click="publish">发 布</el-button>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="招聘岗位" prop="position_name" min-width="120"/>
        <!-- <el-table-column label="招聘人数" prop="" min-width="130"/> -->
        <el-table-column label="工作经验" prop="experience" min-width="120"/>
        <el-table-column label="学历" prop="education" min-width="120"/>
        <el-table-column label="招聘薪资" prop="salary_info" min-width="130"/>
        <el-table-column label="工作地点" min-width="200">
          <template slot-scope="scope">{{scope.row.city_name+' '+scope.row.district_name}}</template>
        </el-table-column>
        <el-table-column label="职位详情" min-width="280">
          <template slot-scope="scope">
            <el-popover
              trigger="hover">
              <div v-html="scope.row.content"></div>
              <u class="ellipsis-text" slot="reference" v-html="scope.row.content"></u>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="150">
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
              @change="e=>changeStatus(e,scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <router-link style="color:#3954b3;font-size: 14px;" :to="{path:`./publishRecruit?id=${scope.row.id}`}">编辑</router-link>
          </template>
        </el-table-column>
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
import {getRecruitList,changeRecruitStatus} from '@/api/content'
export default {
  name: 'RecruitInfo',
  data() {
    return {
      loading:true,
      switchId:null,
      page:1,
      size:10,
      total:0,
      list:[]
    }
  },
  created() {
    this.getRecruitList()
  },
  methods: {
    toJsonStr(row){
      return JSON.stringify(row)
    },
    async getRecruitList(){
      const params = {
        filters:{},
        page:this.page,
        size:this.size
      }
      const {code,data} = await getRecruitList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    publish(){
      this.$router.push('./publishRecruit')
    },
    async changeStatus(val,row) {
      this.switchId = row.id
      const { code } = await changeRecruitStatus({ id: row.id, status: val })
      if(code===0){
        this.switchId = ''
        row.status = val
      }
    },
    handleCurrentChange(val){
      this.loading = true
      this.page = val
      this.getRecruitList()
    }
  }
}
</script>
<style lang="scss">
.recruit{
  .list{
    margin: 20px 0 60px;
  }
  .ellipsis-text{
    width: 250px;
  }
  .add{
    background-color: #3954b3;
    color: #fff;
  }
}
</style>
