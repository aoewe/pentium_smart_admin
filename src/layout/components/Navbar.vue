<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <message class="right-menu-item hover-effect" />
        <svg-icon class="right-menu-item hover-effect" :class="isRefresh?'animation':''" icon-class="refresh" @click="refreshSelectedTag(selectedTag)" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span>{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Message from '@/components/Message'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Message,
    Screenfull,
    Hamburger
  },
  data(){
    return{
      isRefresh:false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'device'
    ]),
    selectedTag(){return this.$route}
  },
  methods: {
    refreshSelectedTag(view) {
      this.isRefresh = true
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
      let timer = setTimeout(() => {
        this.isRefresh = false
        clearTimeout(timer)
      }, 500);
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 40px;
  overflow: hidden;
  position: relative;
  background: #fff;
  padding: 0 0 0 7px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  .animation {
    animation-name: first;
    animation-duration: 500ms;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    -webkit-animation-name: first;
    -webkit-animation-duration: 500ms;
    -webkit-animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
  }
  @keyframes first {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes first {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
  .hamburger-container {
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    // &:hover {
    //   background: rgba(0, 0, 0, .025);
    // }
  }

  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
      height: 100%;
      fill: #303133;
      font-size: 19px;
      vertical-align: text-bottom;
      line-height: 40px;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          // background: rgba(0, 0, 0, .025);
          fill: #3954B3 !important;
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        span{
          padding-left: 10px;
        }
        .user-avatar {
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          &:hover{
            transform: rotate(666turn);
            transition-delay: 1s;
            transition-property: all;
            transition-duration: 20s;
            transition-timing-function: cubic-bezier(.34,0,.84,1);
          }
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          display: none;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
