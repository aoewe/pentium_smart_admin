<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="goods-order-list main-box"
  >
    <div class="select">
      <el-input placeholder="请输入产品名称" size="small" v-model="searchInfo.product_name" style="margin-right:3px;">
        <template slot="prepend">产品名称</template>
      </el-input>
      <el-input placeholder="请输入订单号" size="small" v-model="searchInfo.order_sn" style="margin-right:3px;">
        <template slot="prepend">订单号</template>
      </el-input>
      <el-select placeholder="请选择订单状态" clearable size="small" v-model="searchInfo.order_status" style="margin-right:3px;">
        <el-option value="0" label="待支付"/>
        <el-option value="1" label="待发货"/>
        <el-option value="2" label="待收货"/>
        <el-option value="3" label="已完成"/>
        <el-option value="4" label="已失效"/>
      </el-select>
      <el-date-picker
        v-model="searchInfo.date"
        type="daterange"
        size="small"
        align="right"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button size="small" @click="search(true)" style="margin-left:30px">查 询</el-button>
      <el-button size="small" @click="search(false)">重 置</el-button>
    </div>
    <div class="methods">
      <span>共{{total}}条数据</span>
      <div>
        <el-button icon="el-icon-connection" :disabled="!exportList.length" @click="handelExport">导出</el-button>
        <el-button icon="el-icon-receiving" @click="allExport">一键导出</el-button>
      </div>
    </div>
    <div class="list">
      <el-table
        :data="list"
        height="calc(100vh - 330px)"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" min-width="45" />
        <el-table-column label="订单信息" width="380">
          <template slot-scope="scope">
            <span class="number">共{{scope.row.detail.length}}个商品</span>
            <el-carousel height="80px" style="width:100%" indicator-position="none">
              <el-carousel-item class="product" v-for="item in scope.row.detail" :key="item.id">
                <el-image :src="item.good_img" :preview-src-list="[item.good_img]" fit="cover"/>
                <div class="info">
                  <div class="name">
                    <span>{{item.good_name}}</span>
                    <div>
                      <span class="price" v-if="item.good_price*1>0">{{item.good_price}}</span>
                      <span class="integral" v-if="item.good_integral*1>0">{{item.good_integral}}</span>
                    </div>
                  </div>
                  <div>
                    <p class="ellipsis">
                      <span v-for="aitem in item.good_attr" :key="aitem.value">{{aitem.value}}</span>
                    </p>
                    x{{item.buy_cnt}}
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-table-column>
        <el-table-column label="其他信息" min-width="300">
          <template slot-scope="scope">
            <div class="center">
              <p>订单号：{{scope.row.order_sn || '- -'}}</p>
              <p>订单状态：
                <span :style="{color:scope.row.order_status===0?'#FF4701':scope.row.order_status===1?'#FFA238':scope.row.order_status===2?'#3A8CFF':scope.row.order_status===3?'#01BB00':'#999999'}">
                  {{scope.row.order_status===0?'待支付':scope.row.order_status===1?'待发货':scope.row.order_status===2?'待收货':scope.row.order_status===3?'已完成':'已失效'}}</span>
                </p>
              <p>创建时间：{{scope.row.create_time || '- -'}}</p>
              <p>订单备注：{{scope.row.remarks || '- -'}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货信息" min-width="300">
          <template slot-scope="scope">
            <div class="center">
              <p>{{scope.row.shipping_user}}（{{scope.row.mobile}}）</p>
              <p>{{scope.row.province_name+' '+scope.row.city_name+' '+scope.row.district_name}}</p>
              <p>{{scope.row.address}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.order_status===1" type="text" style="font-size: 14px;" @click="deliver(scope.row)">发货</el-button>
            <router-link style="color:#3954b3;font-size: 14px;" :to="{path:`./orderDetails?info=${toJsonStr(scope.row)}`}">订单详情</router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="订单发货" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="快递名称" prop="kuaidi_name">
            <el-input placeholder="请输入快递名称" v-model="form.kuaidi_name" />
          </el-form-item>
          <el-form-item label="订单号" prop="shipping_sn">
            <el-input placeholder="请输入订单号" v-model="form.shipping_sn" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
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
import {getOrderList,editKuaidi} from '@/api/goods'
export default {
  name: 'GoodsOrderList',
  data() {
    return {
      dialogVisible:false,
      form:{
        id:'',
        kuaidi_name:'',
        shipping_sn:''
      },
      rules: {
        kuaidi_name: [{ required: true, message: '请输入快递名称', trigger: 'blur' }],
        shipping_sn:[{ required: true, message: '请输入订单号', trigger: 'blur' }]
      },
      searchInfo:{
        product_name:'',
        order_sn:'',
        order_status:'',
        date:null,
      },
      exportList:[],
      rwo:{},
      loading: true,
      list: [],
      total: 0,
      page: 1,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    deliver(row){
      this.form.id = row.id
      this.row = row
      this.dialogVisible = true
    },
    submit(){
      this.$refs['form'].validate(async valid=>{
        if(valid){
          const {code} = await editKuaidi(this.form)
          if(code===0){
            this.$message({
              message:'发货成功',
              type:'success'
            })
            this.handleClose()
            this.row.order_status = 2
          }
        }
      })
    },
    handleClose(){
      this.dialogVisible = false
      this.form={
        id:'',
        kuaidi_name:'',
        shipping_sn:''
      }
      this.$refs['form'].resetFields()
    },
    toJsonStr(row){
      return JSON.stringify(row)
    },
    allExport(){
    },
    handelExport(){},
    search(value){
      this.loading = true
      const filters = {}
      !value && (this.searchInfo={product_name:'',order_sn:'',order_status:'',date:null})
      const {product_name,order_sn,order_status,date} = this.searchInfo
      product_name && (filters.product_name = product_name)
      order_sn && (filters.order_sn = order_sn)
      order_status && (filters.order_status = order_status)
      date && (filters.create_time = [date[0].getTime().toString().slice(0, -3),date[1].getTime().toString().slice(0, -3)])
      this.getOrderList(filters)
    },
    async getOrderList(filters={}){
      const params={
        page:this.page,
        size:10,
        sorts: {},
        filters
      }
      const {code,data} = await getOrderList(params)
      if(code===0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleSelectionChange(row) {
      this.exportList = row
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page= val
      this.getOrderList()
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-order-list {
  .select {
    display: flex;
    align-items: center;
    .el-cascader,
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
    .product{
      text-align: start;
      display: flex;
      font-size: 14px;
      width: 100%;
      .el-image{
        border-radius: 4px;
        width: 80px;
        height: 80px;
      }
      .info{
        flex: 1;
        width: 100%;
        padding-left: 10px;
        .name{
          &>span{
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
          }
          div{
            display: flex;
            flex: 1;
            flex-direction: column;
            .integral,.price{
              color: #3954b3;
              width: 100% !important;
              height: 18px;
              text-align: end;
            }
            .price::before{
              content: '¥';
              font-size: 12px;
            }
            .integral::after{
              content: '积分';
              font-size: 12px;
            }
          }

        }
        &>div{
          width: 100%;
          display: flex;
          justify-content: space-between;
          word-break: break-all;
          span:first-child,p{
            width: 65%;
          }
          i:not(:last-child){
            &::after{
              content: ';';
              padding-right: 2px;
            }
          }
        }
        .ellipsis{
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
          word-break: break-all;
        }
      }
    }
    .number{
      text-align: start;
      width: 100%;
      font-size: 12px;
      color: #999;
      position: relative;
      top: -4px;
      height: 18px;
    }
    p{
      margin: 0;
    }
    .center{
      width: 250px;
      p{
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
<style lang="scss">
.goods-order-list{
  th>.cell{
    text-align: center;
  }
  .cell{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>