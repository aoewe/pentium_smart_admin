<template>
  <div v-loading="loading" class="index main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <el-row :gutter="18">
      <el-col :span="16">
        <div class="left">
          <div class="left-top">
            <ec-map :citys="info.citys" />
            <div class="total">
              <p class="title">省份设备数量</p>
              <div class="city-total">
                <div v-if="info && info.citys && info.citys.length">
                  <div v-for="item in info.citys" :key="item.province" class="item">
                    <span>{{ item.province_name }}</span><span /><span>{{ item.equipment_count }}台</span>
                  </div>
                </div>
                <div v-else class="not">
                  <img src="@/assets/notdata.png" alt="">
                  暂无数据
                </div>
              </div>
            </div>
            <div class="show-view" @click="toExhibition"></div>
          </div>
          <div class="left-bottom">
            <div class="box">
              <p class="title">切割机数量统计</p>
              <ec-machine-total
                :equipment2="info.equipment_2"
                :equipment3="info.equipment_3"
                :equipment4="info.equipment_4"
              />
            </div>
            <div class="box yesterday">
              <p class="title">昨日生产</p>
              <div class="yesterday-data">
                <div><span>总切割原料</span><span>{{ (info.yesterday_raw_count>1000?info.yesterday_raw_count/1000+'吨':info.yesterday_raw_count+'kg') || '0吨' }}</span></div>
                <div><span>总切割成品</span><span>{{ (info.yesterday_processed_count>1000?info.yesterday_processed_count/1000+'吨':info.yesterday_processed_count+'kg') || '0吨' }}</span></div>
                <div><span>总切割板材</span><span>{{ info.yesterday_board_count }}张</span></div>
              </div>
              <ec-yesterday-yield
                :raw="info.yesterday_raw_count"
                :board="info.yesterday_board_count"
                :processed="info.yesterday_processed_count"
              />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right">
          <div class="right-top box">
            <p class="title">新增数据</p>
            <div v-if="info && info.new_equipment && info.new_equipment.length" class="list">
              <el-table :data="info.new_equipment" style="width: 100%">
                <el-table-column prop="index" label="排序" width="70" />
                <el-table-column prop="buy_user_name" label="购买者" />
                <el-table-column prop="factory_user_name" label="设备企业" />
                <el-table-column prop="name" label="简称" width="110" />
              </el-table>
            </div>
            <div v-else class="not">
              <img src="@/assets/notdata.png" alt="">
              暂无数据
            </div>
          </div>
          <div class="right-bottom box">
            <p class="title">企业生产排名</p>
            <div v-if="info && info.production_ranking && info.production_ranking.length" class="table">
              <ul>
                <li class="th">
                  <span>排名</span>
                  <div>
                    <span>设备台数</span><span>昨日切割</span><span style="text-align: center;">总切割</span>
                  </div>
                </li>
                <li
                  v-for="(item, index) in info.production_ranking"
                  :key="index"
                  :class="{'odd-li': index%2===0}"
                  class="hover"
                >
                  <ul>
                    <li>
                      <span :style="{color:index === 0 ? '#F43834' : index === 1? '#FFBE59' : index === 2 ? '#60D7A7' : '#333333'}">top{{ index + 1 }}</span>
                      <div>
                        <span>{{ item.factory_user_name }}</span>
                        <div>
                          <span>{{ item.equipment_num }}台</span>
                          <span v-convert="item.yesterday_processed_count">(昨)</span>
                          <span v-convert="item.all_processed_count">(总)</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div v-else class="not">
              <img src="@/assets/notdata.png" alt="">
              暂无数据
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import EcMap from './components/EcMap'
import EcMachineTotal from './components/EcMachineTotal'
import EcYesterdayYield from './components/EcYesterdayYield'
import { getDataInfo } from '@/api/public'
export default {
  name: 'Dashboard',
  components: { EcMap, EcMachineTotal, EcYesterdayYield },
  data() {
    return {
      loading: true,
      info: {}
    }
  },
  created() {
    this.getDataInfo()
  },
  methods: {
    toExhibition(){
      window.open('http://pentium.lumi-fs.com')
    },
    async getDataInfo() {
      const { code, data } = await getDataInfo()
      if (code === 0) {
        data.new_equipment.forEach((item, index) => {
          item.index = index + 1
        })
        data.citys.forEach(item => {
          if (item.province_name && (item.province_name.indexOf('省') !== -1 || item.province_name.indexOf('市') !== -1)) {
            item.province_name = item.province_name?.slice(0, -1)
          } else if (item.province_name && item.province_name.indexOf('特别行政区') !== -1) {
            item.province_name = item.province_name?.slice(0, -5)
          }
        })
        this.info = data
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
  .box {
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 11px 1px rgba(153, 153, 153, 0.16);
    border-radius: 8px;
    position: relative;
    .not{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #bfbfbf;
    }
  }
  .title {
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #1d1d1d;
    padding: 32px 0 0 44px;
    margin: 0;
    width: 200px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background: #3954b3;
      border-radius: 50%;
      left: 20px;
      top: 68%;
    }
    span {
      color: #999999;
      font-weight: 400;
      position: absolute;
      right: 25px;
    }
  }
  .left{
    height: calc(100vh - 128px);
    .left-top{
      height: 65%;
      position: relative;
      display: flex;
      .total{
        height: 100%;
        width: 210px;
        position: absolute;
        right: 40px;
        top: 0;
        .title{
          padding: 32px 22px;
          &::before{
            left: -2px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .city-total{
          color: #1d1d1d;
          font-size: 16px;
          height: 60%;
          background: #FFFFFF;
          box-shadow: 0px 0px 11px 1px rgba(153,153,153,0.1600);
          border-radius: 8px;
          padding: 31px 24px;
          overflow-y: scroll;
          position: relative;
          .not{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #bfbfbf;
          }
          .item{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-bottom: 36px;
            span{
              flex: 1;
              text-align: center;
            }
            & span:nth-child(2){
              height: 1px;
              background-color: #666666;
            }
          }
        }
      }
    }
    .left-bottom{
      height: 35%;
      display: flex;
      justify-content: space-between;
      &>div{
        width: calc((100% / 2) - 9px);
      }
      .yesterday{
        position: relative;
        .title{
          position: absolute;
        }
        .yesterday-data{
          font-size: 18px;
          position: absolute;
          left: 7.5%;
          right: 7.5%;
          height: 63%;
          bottom: 13%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          div{
            display: flex;
            justify-content: space-between;
            color: #1E84FF;
          }
          div+div{
            color: #FFBE59;
          }
          div+div+div{
            color: #60D7A7;
          }
        }
      }
    }
  }
  .right{
    height: calc(100vh - 128px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .right-top,.right-bottom{
      height: calc((100% / 2) - 11px);
    }
    .list {
      padding: 24px;
    }
    .table {
      padding: 24px;
      overflow-y: scroll;
      height: 83%;
      ul {
        padding: 0 10px;
        & .th {
          display: flex;
          padding: 0 24px 16px 24px;
          font-size: 16px;
          span {
            width: 20%;
          }
          div {
            display: flex;
            flex: 1;
            justify-content: space-between;
          }
        }
        .odd-li{
          background-color:#f5f6fa;
          &:hover{
            background-color: rgba($color: #3954B3, $alpha: .1);
          }
        }
        li {
          border-radius: 8px;
          ul {
            padding: 0;
            li {
              height: 68px;
              padding: 0 24px;
              font-size: 14px;
              display: flex;
              align-items: center;
              position: relative;
              &::after{
                content: '';
                height: 1px;
                width: calc(98% - 48px);
                position: absolute;
                right: 0;
                background-color: #E6E6E6;
              }
              &>span {
                width: 20%;
                position: relative;
              }
              &>div{
                flex: 1;
                height: 100%;
                &>span,div{
                  display: block;
                  height: 34px;
                  line-height: 34px;
                }
                div{
                  display: flex;
                  justify-content: space-between;
                }
              }
            }
          }
        }
      }
    }
  }
  .show-view{
    position: absolute;
    bottom: 1%;
    right: 27px;
    width: 233px;
    height: 110px;
    background-image: url('../../assets/show.png');
    background-size: 100% 100%;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.el-row {
  height: 100%;
  .el-col {
    height: 100%;
  }
}
.index {
  .el-table__empty-text{
    display: none;
  }
  .list {
    height: 83%;
    overflow-y: scroll;
    .el-table {
      font-size: 14px;
      th {
        font-size: 16px;
      }
      td {
        padding: 0;
        height: 34px;
      }
    }
  }
}
</style>
