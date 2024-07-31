<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import watermark from './utils/waterMark'
export default {
  name: 'App',
  mounted() {
    watermark.set('奔腾智能', document.documentElement)
  },
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>
<style>

</style>
