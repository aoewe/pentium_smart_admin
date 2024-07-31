<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

const animationDuration = 2000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    raw: {
      type: Number,
      default: 0
    },
    processed: {
      type: Number,
      default: 0
    },
    board: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    raw() {
      this.initChart()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: '#fff'
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '7.5%',
          right: '7.5%',
          bottom: '-5%',
          top: '21%'
        },
        xAxis: {
          type: 'value',
          show: false
        },
        yAxis: [
          {
            type: 'category',
            show: false,
            offset: -10,
            axisLabel: {
              textStyle: {
                color: function(params, index) {
                  const arr = ['#60D7A7', '#FFBE59', '#1E84FF']
                  return arr[index]
                }
              },
              align: 'left',
              verticalAlign: 'bottom',
              lineHeight: 50,
              fontSize: 18
            },
            data: ['总切割板材', '总切割成品', '总切割原料'],
            axisLine: false,
            axisTick: false
          },
          {
            type: 'category',
            show: false,
            offset: -46,
            width: '200',
            axisLabel: {
              textStyle: {
                color: function(params, index) {
                  const arr = ['#60D7A7', '#FFBE59', '#1E84FF']
                  return arr[index]
                }
              },
              verticalAlign: 'bottom',
              lineHeight: 50,
              fontSize: 18
            },
            data: [`${this.board} 张`, `${this.processed} kg`, `${this.raw} kg`],
            axisLine: false,
            axisTick: false
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: '14%',
            data: [this.board, this.processed, this.raw],
            showBackground: true,
            backgroundStyle: {
              color: '#EEEEEE',
              borderRadius: 6
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  const arr = ['#60D7A7', '#FFBE59', '#1E84FF']
                  return arr[params.dataIndex]
                },
                barBorderRadius: 6
              }
            },
            animationDuration
          }
        ]
      })
    }
  }
}
</script>
