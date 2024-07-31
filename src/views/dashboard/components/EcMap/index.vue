<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
require('../china')
import resize from '../mixins/resize'

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
    // eslint-disable-next-line vue/require-default-prop
    citys: {
      type: Array
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    citys() {
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
      let cityData = [{ name: '开封', value: [114.35628, 34.76657, 50] }]
      let citys = []
      let linesData = []
      if(this.citys?.length){
        this.citys.forEach(i=>i.city_data.forEach(j=> {
          citys.push({name:j.city_name.slice(0,j.city_name.length-1),value:[j.lng,j.lat,20]})
          linesData.push({
            fromName: '开封',
            toName: j.city_name.slice(0,j.city_name.length-1),
            coords: [[114.35628, 34.76657],[j.lng,j.lat]]})
        }))
        cityData.push(...citys)
      }
      var series = [
        {
          type: 'lines',
          effect: {
            show: true,
            period: 5,
            trailLength: 0.7,
            color: '#eee',
            symbolSize: 3.5
          },
          lineStyle: {
            normal: {
              opacity: 0,
              curveness: 0.2
            }
          },
          data: linesData
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              textBorderColor: 'rgba(55,92,254,1)',
              textBorderWidth:1,
              formatter: '{b}',
              color: '#fff',
              fontSize: 12
            }
          },
          symbolSize: function (val) {
            return val[2] / 6;
          },
          itemStyle: {
            normal: {
              color: '#fff'
            }
          },
          data: cityData
        }
      ]
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        geo: {
          type: 'map',
          map: 'china',
          zoom: 1.2,
          x: '8%',
          y: '8%',
          label: false,
          silent: true,
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#0263d4',
              borderColor: '#c0ccf9'
            },
            emphasis: {
              areaColor: '#c0ccf9'
            }
          },
        },
        series: series
      })
    }
  }
}
</script>