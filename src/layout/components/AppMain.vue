
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- 使用 keep-alive 包裹 -->
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      loading: false
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  overflow: hidden;
  /* padding: 0 33px 0 15px; */
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }
  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    padding-right: 0 !important;
}
.el-loading-spinner{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 35px;
  .el-loading-text{
    font-size: 15px;
  }
}
</style>
