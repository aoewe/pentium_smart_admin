<template>
  <div class="good-order-details main-box">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>基本信息</p>
          <ul>
            <li>订单号：{{info.order_sn}}</li>
            <li>下单时间：{{info.create_time}}</li>
            <li v-if="info.order_integral*1>0">订单积分：{{info.order_integral}}</li>
            <li v-else>订单金额：￥{{info.order_money}}</li>
            <li>运费金额：{{info.order_sn}}</li>
            <li>支付金额：[包邮]</li>
            <li>快递公司：{{info.kuaidi_name || '- -'}}</li>
            <li>快递号：{{info.shipping_sn || '- -'}}</li>
            <li>用户名称：{{info.username}}</li>
            <li>收货人：{{info.shipping_user}}</li>
            <li>手机号：{{info.mobile}}</li>
            <li>订单备注：{{info.explain || '- -'}}</li>
            <li>订单状态：
              <span :style="{color:info.order_status===0?'#FF4701':info.order_status===1?'#FFA238':info.order_status===2?'#3A8CFF':info.order_status===3?'#01BB00':'#999999'}">
                {{info.order_status===0?'待支付':info.order_status===1?'待发货':info.order_status===2?'待收货':info.order_status===3?'已完成':'已失效'}}
              </span>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <p>支付信息</p>
          <ul>
            <li>支付状态：{{info.pay_status===0?'未支付':'已支付'}}</li>
            <li>支付时间：{{info.pay_time || '- -'}}</li>
            <li>支付方式：{{info.pay_status===0?'- -':info.order_integral*1>0?'积分支付':'余额支付'}}</li>
            <li>退款时间：{{info.refund_time || '- -'}}</li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div class="product-info" v-for="item in info.detail" :key="item.id">
        <el-image fit="cover" style="width: 100px; height: 100px" :src="item.good_img" :preview-src-list="[item.good_img]"/>
        <div class="info">
          <p>{{item.good_name}}</p>
          <p>
            规格:
            <span v-for="item in item.good_attr" :key="item.value">{{item.value}}</span>
            价格:
            <span v-if="item.good_integral*1>0">{{item.good_integral}}积分</span>
            <span v-if="item.good_integral*1>0 && item.good_price*1>0"> + </span>
            <span v-if="item.good_price*1>0">￥{{item.good_price}}</span>
            数量:{{item.buy_cnt}}
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getOrderDetail } from '@/api/goods'
export default {
  name: 'OrderDetails',
  data() {
    return {
      loading: true,
      info: {}
    }
  },
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        if(value.info){
          this.info = JSON.parse(value.info)
        }
      }
    }
  },
  methods: {
    async getOrderDetail(id) {
      const { code, data } = await getOrderDetail({ id })
    }
  }
}
</script>
<style lang="scss" scoped>
.good-order-details {
  .box-card{
    margin-bottom: 20px;
    p{
      font-weight: bold;
      font-size: 17px;
      margin: 0 0 20px;
    }
    ul{
      font-size: 15px;
      li:not(:last-child){
        padding-bottom: 20px;
      }
    }
  }
  .product-info:not(:last-child){
    padding-bottom: 16px;    
  }
  .product-info{
    display: flex;
    .info{
      padding-left: 20px;
      p+p{
        color: #999999;
      }
    }
  }
}
</style>