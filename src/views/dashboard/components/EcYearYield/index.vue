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
      default: '80%'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data() {
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
    handelData() {
      const data = []
      this.data.forEach((item, index) => {
        data.push((index + 1) + '月')
      })
      return data
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '5%',
          right: '8%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F8F9FD'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#EBEBEB'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#999999'
            }
          },
          data: this.handelData()
        },
        yAxis: {
          type: 'value',
          splitArea: false,
          axisTick: {
            show: true,
            lineStyle: {
              color: '#ccc',
              width: 2
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F8F9FD'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#EBEBEB'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#999999'
            },
            margin: 20
          }
        },
        series: [
          {
            color: '#3954B3',
            barWidth: '16',
            data: this.data,
            type: 'bar',
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
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

