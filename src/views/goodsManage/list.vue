<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="goods-list main-box"
  >
    <div class="select">
      <el-input size="small" placeholder="请输入产品名称" v-model="product_name" style="margin-right:3px;">
        <template slot="prepend">产品名称</template>
      </el-input>
      <el-cascader placeholder="请选择产品分类" size="small" v-model="category" :options="categoryList" :props="props"></el-cascader>
      <el-button size="small" @click="search(true)">查 询</el-button>
      <el-button size="small" @click="search(false)">重 置</el-button>
    </div>
    <div class="methods">
      <span>共{{total}}条数据</span>
      <div>
        <el-button icon="el-icon-plus" @click="addGodds" v-if="!opt">新增</el-button>
        <el-button icon="el-icon-check" type="success" :disabled="!selectList.length" @click="onEmit" v-if="opt">确定</el-button>
      </div>
    </div>
    <div class="list">
      <el-table
        :data="list"
        ref="table"
        style="width: 100%"
        height="calc(100vh - 330px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="opt" type="selection" min-width="45" />
        <el-table-column prop="id" label="商品ID" min-width="70" />
        <el-table-column label="商品信息" min-width="400">
          <template slot-scope="scope">
            <el-image fit="contain" style="width: 80px; height: 80px;" :src="scope.row.main_pic" :preview-src-list="[scope.row.main_pic]"></el-image>
            <span class="prdouct-name text-line">{{scope.row.product_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品分类" min-width="200">
          <template slot-scope="scope">
            <u>{{scope.row.one_category+'/'+scope.row.two_category}}</u>
          </template>
        </el-table-column>
        <el-table-column label="商品价格" min-width="150"><template slot-scope="scope">￥{{scope.row.price}}</template></el-table-column>
        <el-table-column label="商品积分" min-width="150"><template slot-scope="scope">{{scope.row.integral || '0.00'}}积分</template></el-table-column>
        <el-table-column prop="current_cnt" label="库存" min-width="150" />
        <el-table-column label="状态" min-width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.publish_status"
              active-color="#3954B3"
              inactive-color="#666666"
              :disabled="switchId===scope.row.id"
              active-text="上架" inactive-text="下架"
              :active-value="1"
              :inactive-value="0"
              @change="e=>changeStatus(e,scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <!-- <el-button type="text" @click="del(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import {getProductList,changeProStatus,getCategory} from '@/api/goods'
export default {
  name: 'GoodsList',
  props: ['opt'],
  data() {
    return {
      props:{checkStrictly: true,label: 'title'},
      product_name:'',
      switchId:null,
      selectList:[],
      category:'',
      categoryList:[],
      type:'',
      loading: true,
      list: [],
      total: 0,
      page: 1,
      filters:{}
    }
  },
  created() {
    if(this.props.opt===1){

    }
    this.getProductList()
    this.getCategory()
  },
  methods: {
    // 向editView传值
    handleSelectionChange(row) {
      this.selectList = row
    },
    onEmit(){
      this.$emit('changeProduct', this.selectList)
      this.$refs.table.clearSelection()
      this.selectList=[]
    },
    async search(e){
      this.loading = true
      let filters = this.filters
      if(this.category){
        filters.category_id = this.category
        filters.one_category_id = this.category[0]
        if(this.category.length>1){
          filters.two_category_id = this.category[1]
        }
      }
      this.product_name && (filters.product_name = this.product_name)
      !e && (this.filters={},this.category='',this.product_name='')
      await this.getProductList()
    },
    async getCategory(){
      const {code,data} = await getCategory()
      if(code===0){
        this.categoryList = data
      }
    },
    // 删除商品
    // del(row) {
    //   this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(async() => {
    //       const res = await changeStatus({ id: row.id, status: 2 })
    //       if (res.code === 0) {
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功!'
    //         })
    //         if (this.list.length === 1 && this.page > 1) {
    //           this.page--
    //         }
    //         this.getProductList()
    //       }
    //     })
    // },
    // 商品上下架
    async changeStatus(val,row) {
      this.switchId = row.id
      const { code } = await changeProStatus({ id: row.id, publish_status: val })
      if(code===0){
        row.status = val
        this.switchId = null
      }
    },
    async getProductList(){
      const params={
        page:this.page,
        size:10,
        sorts: {},
        filters:this.filters
      }
      const {code,data} = await getProductList(params)
      if(code===0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    addGodds(){
      this.$router.push('./details')
    },
    edit(row){
      this.$router.push('./details?product_id='+row.id)
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page= val
      this.getProductList()
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-list {
  .select {
    display: flex;
    align-items: center;
    .el-cascader{
      width: 224px;
      margin-right: 30px;
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
  .methods{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0;
    span{
      color: #666666;
      font-size: 13px;
    }
  }
  .list {
    margin: 20px 0 60px 0;
  }
}
</style>
<style lang="scss">
.goods-list{
  .cell{
    display: flex;
    align-items: center;
    .prdouct-name{
      max-width: 80%;
      padding-left:20px;
    }
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #3954B3;
    border-color: #3954B3;
  }
}
</style>