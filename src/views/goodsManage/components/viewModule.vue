<template>
  <div class="view" :style="{backgroundColor:data.bgColor}">
    <div class="volume"></div>
    <div class="power"></div>
    <div class="drop"></div>
    <div class="box">
      <!-- banner -->
      <el-carousel indicator-position="none" height="272px" v-if="data.banner.length">
        <el-carousel-item v-for="item in data.banner" :key="item.url">
          <el-image class="top-banner-img" :src="item.url" />
        </el-carousel-item>
      </el-carousel>
      <div v-for="item,index in data.list" :key="index" class="model">
        <!-- 轮播图商品 -->
        <img class="title" :src="item.title" v-if="item.title">
        <div class="module2" v-if="index===0">
          <div class="mask"></div>
          <el-carousel :interval="5000" type="card">
            <el-carousel-item :style="{backgroundColor:item.color[0]}" class="p-item" v-for="row in item.products" :key="row.id">
              <el-image class="p-img" :src="row.main_pic" />
              <span class="ellipsis-text" :style="{color:item.color[3]}">{{row.product_name}}</span>
              <div class="btn" :style="{background: `linear-gradient(-45deg, ${item.color[1]} 0%, ${item.color[2]} 100%)`,color:item.color[4]}">{{row.integral}}</div>
            </el-carousel-item>
          </el-carousel>
          <span>向右滑动查看更多</span>
        </div>
        <!-- 单品 -->
        <div class="single-product" v-if="index===1">
          <div v-if="oddProduct.id">
            <div class="odd">
              <span class="line1" :style="{background: `linear-gradient(0deg, ${item.color[2]} 0%, ${item.color[3]} 100%)`}"></span>
              <span class="line2" :style="{background: `linear-gradient(0deg, ${item.color[2]} 0%, ${item.color[3]} 100%)`}"></span>
              <span class="line3" :style="{background: `linear-gradient(0deg, ${item.color[2]} 0%, ${item.color[3]} 100%)`}"></span>
              <span class="line4" :style="{background: `linear-gradient(0deg, ${item.color[2]} 0%, ${item.color[3]} 100%)`}"></span>
              <div :style="{backgroundColor:item.color[0]}">
                <el-image lazy-load :src="oddProduct.main_pic" />
                <div class="info">
                  <span class="ellipsis-text" :style="{color:item.color[4]}">{{oddProduct.product_name}}</span>
                  <div :style="{background: `linear-gradient(-45deg, ${item.color[2]} 0%, ${item.color[3]} 100%)`,color:item.color[5]}">{{oddProduct.integral}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="even-list">
            <div class="even" v-for="row in singleProduct" :key="row.id">
              <span class="after" :style="{background: `linear-gradient(0deg, ${item.color[3]} 0%, ${item.color[2]} 100%)`}"></span>
              <el-image lazy-load :src="row.main_pic" />
              <div class="info" :style="{backgroundColor:data.list[1].color[1]}">
                <span class="ellipsis-text" :style="{color:item.color[4]}">{{row.product_name}}</span>
                <span class="span" :style="{color:item.color[4]}">{{row.integral}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 卡片商品 -->
        <div class="health-product" v-if="index===2">
          <div class="item" v-for="row in item.products" :key="row.id">
            <div class="left" :style="{background: `linear-gradient(0deg, ${item.color[0]} 0%, ${item.color[1]} 100%)`}"><span></span><span></span><span></span></div>
            <div class="right" :style="{background: `linear-gradient(0deg, ${item.color[0]} 0%, ${item.color[1]} 100%)`}"><span></span><span></span><span></span></div>
            <div class="info" :style="{background:item.color[2]}">
              <el-image lazy-load :style="{borderColor:item.color[3]}" :src="row.main_pic" />
              <div class="bottom">
                <div>
                  <span class="ellipsis-text" :style="{color:item.color[7]}">{{row.product_name}}</span>
                  <span>惊喜价:{{row.integral}} 积分</span>
                </div>
                <div class="btn">
                  <div :style="{color:item.color[2],backgroundColor:item.color[4],color:item.color[8]}">立即购买
                    <span class="after" :style="{backgroundColor:item.color[5]}"></span>
                    <span class="before" :style="{backgroundColor:item.color[6]}"></span>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 推荐商品 -->
        <div class="list" v-if="index>=3">
          <div class="p-item" :style="{backgroundColor:item.color[0]}" v-for="row in item.products" :key="row.id">
            <el-image class="p-img" lazy-load :src="row.main_pic" />
            <span class="ellipsis-text" :style="{color:item.color[3]}">{{row.product_name}}</span>
            <div class="btn" :style="{background: `linear-gradient(-45deg, ${item.color[2]} 0%, ${item.color[1]} 100%)`,color:item.color[4]}">{{row.integral}}</div>
          </div>
        </div>
      </div>
      <div class="path">
        <el-image class="b-img" lazy-load :src="data.path" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ViewModule',
  props:['data'],
  data() {
    return {
      oddProduct:{
        current_cnt: 100,
        id: 103,
        integral: "34.00",
        main_pic: "http://img.btzni.com/adminImg/default/2b0868ed3c2cd387dec155d8e152ef33ed3d4451.jpg",
        one_category: "福利商城",
        price: "0.00",
        product_name: "富硒酵母片保健食品成人活性硒元素咀嚼片",
        publish_status: 1,
        sort: 0,
        three_category: "",
        two_category: "肝护养区"
      },
      singleProduct:[
      {
        current_cnt: 100,
        id: 102,
        integral: "23.00",
        main_pic: "http://img.btzni.com/adminImg/default/ae893865abebf3d029b96a97c220c8475e4800e8.jpg",
        one_category: "福利商城",
        price: "0.00",
        product_name: "日本京都药业锁阳益肾温肾固本艾灸贴扶阳固本锁阳足贴肚脐贴",
        publish_status: 1,
        sort: 0,
        three_category: "",
        two_category: "肾护养区"
      },
      {
        current_cnt: 1000,
        id: 101,
        integral: "41.00",
        main_pic: "http://img.btzni.com/adminImg/default/824344c236f2e17cca35600477752799ddd353b6.jpg",
        one_category: "福利商城",
        price: "0.00",
        product_name: "小儿贴参苓健脾保健贴蜂蜜膏肚脐贴",
        publish_status: 1,
        sort: 0,
        three_category: "",
        two_category: "脾养护区",
      }]
    }
  },
  watch:{
    'data.list':{
      handler(e){
        this.change(e[1].products)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    change(e){
      let data = JSON.parse(JSON.stringify(e))
      if(e.length%2===0){
        this.oddProduct = {}
        this.singleProduct = data
      }else{
        this.oddProduct = data[0]
        this.singleProduct = data.splice(1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-view {
  .view {
    margin: auto 82.5px;
    height: 820px;
    position: relative;
    border: 20px solid #000;
    border-radius: 60px;
    &:before {
      content: "";
      position: absolute;
      width: 105%;
      height: 103%;
      box-shadow: 0px 0px 24px #fff;
      border-radius: 45px;
      left: -10px;
      top: -12px;
    }
    .drop{
      content: '';
      position: absolute;
      width: 7px;
      height: 7px;
      background-color: rgba($color: #000000, $alpha: .6);
      box-shadow: 0 0 0 6px #000;
      border-radius: 50%;
      top: 18px;
      left: 32px;
      z-index: 999;
    }
    .volume {
      width: 9px;
      height: 100px;
      border: #000 1px solid;
      background: linear-gradient(#8c8c8c, #000 9%, #222, #000 94%, #353535 100%);
      position: absolute;
      right: -25px;
      top: 125px;
      border-radius: 20px;
    }
    .power {
      width: 9px;
      height: 46px;
      border: #000 1px solid;
      background: linear-gradient(#8c8c8c, #000 9%, #222, #000 94%, #353535 100%);
      position: absolute;
      right: -25px;
      top: 260px;
      border-radius: 20px;
    }
    .box{
      border-radius: 40px;
      overflow-y: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;
      height: 780px;
      &::-webkit-scrollbar {
        display: none;
      }
      .top-banner-img{
        height: 272px;
        width: 100%;
      }
      .title{
        margin: 10px auto;
        height: 66px;
        display: flex;
      }
      // 轮播图
      .module2{
        padding-top: 10px;
      }
      .module2,.list{
        width: 375px;
        height: 336px;
        position: relative;
        &>span{
          color: #fff;
          text-align: center;
          width: 100%;
          position: absolute;
          bottom: 10px;
          font-size: 13px;
        }
        .mask{
          width: 351px;
          height: 336px;
          border: 2px solid #fff;
          opacity: 0.3;
          border-radius: 0px 20px 0px 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1;
          transform: translate(-50%,-50%);
        }
        .el-carousel__item,.p-item {
          border-radius: 9px;
          padding: 5px;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          .p-img{
            width: 179px;
            height: 179px;
          }
          span{
            margin: 8px 8px 6px;
          }
          .btn{
            width: 143px;
            height: 35px;
            line-height: 35px;
            border: 1px solid #FFFFFF;
            border-radius: 27px;
            color: #fff;
            &::after{
              content: ' 积分';
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  // 单品
  .single-product {
    padding: 0 9px 32px;

    .odd,
    .even {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 7px;
      position: relative;
    }

    .odd {
      &>span {
        position: absolute;
        width: 37px;
        height: 8px;
        border-radius: 3px;
      }

      .line1,
      .line2 {
        top: 0;
      }

      .line1,
      .line3 {
        left: 44px;
      }

      .line2,
      .line4 {
        right: 44px;
      }

      .line3,
      .line4 {
        bottom: 0;
      }

      &>div {
        display: flex;
        padding: 8px;
        height: 163px;

        .info {
          padding: 5px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;

          span {
            font-weight: bold;
            -webkit-line-clamp: 4;
            word-break: break-all;
            font-size: 16px;
          }

          &>div {
            width: 143px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            border: 1px solid #FFFFFF;
            border-radius: 18px;
            font-size: 12px;
            &::after{
              content: ' 积分';
              font-size: 12px;
            }
          }
        }
      }

      .el-image {
        min-width: 160px;
        height: 100%;
        border-radius: 6px;
      }
    }

    .even-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .even {
      margin-top: 12px;
      width: 174px;
      box-sizing: border-box;
      color: #ffffff;
      position: relative;
      .after {
        position: absolute;
        width: 37px;
        height: 8px;
        border-radius: 3px;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
      }

      .info {
        border-radius: 0 0 6px 6px;
        padding: 0 8px 8px;
        height: 66.89px;
      }

      .span {
        font-size: 12px;
        &::after{
          content: ' 积分';
          font-size: 12px;
        }
      }

      .ellipsis-text {
        -webkit-line-clamp: 2;
        font-weight: bold;
        font-size: 15px;
        padding: 4px 0 2px;
      }

      .el-image {
        display: flex;
        height: 160px;
        width: 160px;
      }
    }
  }
  // 卡片
  .health-product {
    padding-bottom: 16px;

    .item {
      background-color: #ffffff;
      height: 302px;
      margin: 0 12px 16px;
      border-radius: 10px;
      position: relative;
      padding: 7px;

      .left,
      .right {
        position: absolute;
        top: 50px;
        width: 32px;
        height: 88px;
        border-radius: 0 8px 8px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        padding: 9px 0;
        box-sizing: border-box;

        span {
          width: 14px;
          height: 14px;
          background: #FFFFFF;
          border-radius: 50%;
          display: block;
        }
      }

      .left {
        left: -12px;
      }

      .right {
        right: -12px;
        border-radius: 8px 0 0 8px;
      }

      .info {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0 10px;
        box-sizing: border-box;
        border-radius: 4px;
        color: #ffffff;

        .el-image {
          width: 282px;
          height: 195px;
          border: 4px solid;
          border-radius: 5px;
        }

        .bottom {
          padding-top: 5px;
          flex: 1;
          width: 282px;
          display: flex;
          justify-content: space-between;

          &>div:first-child {
            height: 100%;
            width: 140px;
            font-size: 15px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 12px;

            span:first-child {
              font-size: 15px;
              font-weight: bold;
              -webkit-line-clamp: 2;
            }
          }

          .btn {
            position: relative;
            flex: 1;

            &::before {
              content: '';
              position: absolute;
              width: 124px;
              height: 35px;
              background: rgba($color: #000000, $alpha: .3);
              border-radius: 8px 8px 5px 5px;
              right: -7px;
              bottom: -6px;
            }

            &>div {
              margin-top: 6px;
              right: 0;
              top: 0;
              width: 110px;
              height: 33px;
              border-radius: 8px 8px 4px 4px;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              line-height: 35px;
              position: absolute;
              transform-style: preserve-3d;

              .after {
                position: absolute;
                display: block;
                width: 110px;
                height: 10px;
                bottom: -10px;
                left: 0;
                border-radius: 0 0 4px 4px;
              }

              .before {
                position: absolute;
                width: 124px;
                height: 38px;
                border-radius: 12px 12px 8px 8px;
                transform: translateZ(-1px);
                left: -7px;
                top: 10px;
              }
            }
          }
        }
      }
    }
  }
  // 推荐
  .list {
    padding: 0 12px 12px !important;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: auto !important;
    margin-bottom: 0 !important;
    .p-item {
      margin-bottom: 12px;
      height: 246px !important;
      .p-img{
        width: 160px !important;
        height: 160px !important;
      }
      span{
        max-width: 130px;
      }
    }
  }
  .path{
    margin: 0 auto 15px;
    width: 189px;
    height: 82px;
    .b-img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.el-carousel__arrow{
  display: none;
}
.el-carousel__mask{
  display: none;
}
.module2{
  .el-carousel__indicators--outside{
    position:absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    .el-carousel__button{
      height: 5px;
      width: 5px;
      border-radius: 50%;
    }
    .el-carousel__indicators--outside button{
      width: 5px;
      height: 5px;
      background: #FFFFFF;
      opacity: 0.5;
      border-radius: 50%;
    }
    .el-carousel__indicator.is-active button{
      opacity: 1;
      background: #FFFFFF;
    }
  }
}
</style>

