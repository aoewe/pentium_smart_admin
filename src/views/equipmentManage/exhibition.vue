<template>
  <div v-loading="loading" class="exhibition main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <router-link :to="{path:`./exhibitionDetails`}">
      <el-button class="add" style="border-color:#3954b3" icon="el-icon-plus" type="primary" @click="dialogVisible = true, text = '添加'">添加</el-button>
    </router-link>
    <div class="list" v-if="list.length">
      <el-row :gutter="20">
        <el-col :md="12" :lg="8" :xl="6" v-for="(item,index) in list" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <div class="box">
              <span class="order">序号：{{item.order || '- -'}}</span>
              <div>
                <span>设备主图：</span>
                <div class="logo"><span class="price">底价：{{item.price || '- -'}}</span><img :src="item.img"></div>
              </div>
              <div class="name">
                <span>设备名称：</span>
                <span>{{item.name}}</span>
              </div>
              <div>
                <span>操作：</span>
                <div class="dialog-footer">
                  <el-button @click="toDetails(item.id)">编辑</el-button>
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
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getExhibitionList,delExhibitionInfo } from '@/api/equipment'

export default {
  name: 'Exhibition',
  data() {
    return {
      loading:true,
      page:1,
      size:16,
      total:0,
      list:[]
    }
  },
  created() {
    this.getExhibitionList()
  },
  methods: {
    toDetails(id){
      this.$router.push('./exhibitionDetails?id='+id)
    },
    delRow(id){
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {code} = await delExhibitionInfo({id})
        if(code===0){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.getExhibitionList()
        }
      }).catch(() => {
              
      })
      
    },
    async getExhibitionList(){
      const params = {
        page: this.page,
        size: this.size,
        sorts: {},
        filters: {}
      }
      const {code,data} = await getExhibitionList(params)
      if(code===0){
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val){
      this.loading = true
      this.page = val
      this.getExhibitionList()
    }
  }
}
</script>
<style lang="scss">
.exhibition{
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
    .el-col{
      padding-bottom: 20px;
    }
    .box{
      display: flex;
      height: 230px;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
      font-size: 15px;
      color: #333;
      background-color: #F5F6FA;
      position: relative;
      .order{
        position: absolute;
      }
      &>div{
        display: flex;
        align-items: center;
        &>span:first-child{
          min-width: 25%;
          display: block;
        }
        .logo{
          background-color: #fff;
          width: 300px;
          display: flex;
          justify-content: center;
          height: 120px;
          position: relative;
          .price{
            position: absolute;
            top: -8px;
            left: 0;
            color: #3954b3;
          }
          img{
            width: 100%;
            height: 100%;
            border-radius: 6px;
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
