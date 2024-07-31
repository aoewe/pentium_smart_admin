<template>
  <div class="nav-message">
    <el-popover placement="top" width="300" trigger="hover">
      <div class="msg-box" style="text-align:center">
        <div style="text-align:center;display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50px 0;">
          <svg-icon style="width:3em;height: 3em;color:#c2c2c2" icon-class="no-message" />
          <span style="color:#c2c2c2;padding-top:10px">暂无消息哦~</span>
        </div>
        <div style="border-top:1px solid #efeff5;display: flex;justify-content: space-between;position: relative;bottom: -12px;padding: 6px 0;">
          <el-button style="color:#1d1d1d;flex: 1;text-align: center;" size="mini" type="text">清空消息</el-button>
          <el-button style="color:#1d1d1d;flex: 1;text-align: center;" size="mini" type="text">查看更多</el-button>
        </div>
      </div>
      <el-badge is-dot class="item" slot="reference">
        <svg-icon icon-class="message" />
      </el-badge>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
    }
  },
  created(){
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
.nav-message{
  .el-badge__content.is-fixed{
    top: 12px;
    right: 10px;
    // background-color: #ED213A;
    // padding: 0 5px;
  }
  .svg-icon {
    display: inline-block;
    cursor: pointer;
    width: 0.8em !important;
    height: 0.8em !important;
    vertical-align: 10px;
    margin-bottom: 2px;
    fill: #ED213A;
    margin-right: 4px;
  }
  .meg-box{
    .svg-icon{
      height: 2em !important;
      width: 2em !important;
    }
  }
}
</style>
