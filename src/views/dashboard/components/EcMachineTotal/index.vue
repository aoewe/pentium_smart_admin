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
    equipment2: {
      type: Number,
      default: 0
    },
    equipment3: {
      type: Number,
      default: 0
    },
    equipment4: {
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
    equipment2() {
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
          }
        },
        legend: {
          icon: 'circle',
          y: '37%',
          x: '57%',
          formatter: item => {
            switch (item) {
              case '20000W':
                return item + '    ' + this.equipment2 + '台'
              case '30000W':
                return item + '    ' + this.equipment3 + '台'
              case '40000W':
                return item + '    ' + this.equipment4 + '台'
              default:
                break
            }
          },
          itemWidth: 20,
          textStyle: {
            color: '#666',
            lineHeight: 25,
            fontSize: 16,
            textAlign: 'center'
          }
        },

        series: [
          {
            name: '',
            type: 'pie',
            radius: ['45%', '72%'],
            center: ['30%', '55%'],
            label: {
              normal: {
                show: true,
                position: 'center',
                color: '#666',
                formatter: '{title|切割机}' + '\n' + '{sub|数量}',
                rich: {
                  title: {
                    lineHeight: 20,
                    fontSize: '1rem'
                  },
                  sub: {
                    lineHeight: 22,
                    fontSize: '1rem'
                  }
                }
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 4,
                borderRadius: 10,
                borderColor: '#fff'
              }
            },
            labelLine: false,
            data: [
              {
                value: this.equipment2,
                name: '20000W',
                itemStyle: {
                  color: '#52FFFF'
                }
              },
              {
                value: this.equipment3,
                name: '30000W',
                itemStyle: {
                  color: '#28B1FF'
                }
              },
              {
                value: this.equipment4,
                name: '40000W',
                itemStyle: {
                  color: '#F8B62D'
                }
              }
            ],
            animationDuration
          }
        ]
      })
    }
  }
}
</script>
