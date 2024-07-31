<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="high-seas-clients main-box"
  >
  <div v-if="list <= 0" class="visit">暂无拜访记录</div>
    <div class="block" v-else>
      <el-timeline>
        <el-timeline-item
          v-for="(step, index) in list"
          :key="index"
          type="primary"
          color="#3954b3"
          size="large"
          placement="top"
          :timestamp="step.create_time"
        >
          <div class="Visitrecord_flex">
            <div class="Visitrecord_type" v-if="step.type === 1">线上拜访</div>
            <div class="Visitrecord_type" v-if="step.type === 2">线下拜访</div>
            <div class="contact_type" v-if="step.contact_type === 1">
              微信联系
            </div>
            <div class="contact_type" v-if="step.contact_type === 2">
              电话联系
            </div>
            <div>{{ step.explain }}</div>
          </div>
          <el-image
            fit="cover"
            :src="step.img"
            :preview-src-list="[step.img]"
            v-if="step.img"
          >
            <div slot="error" class="image-slot">
              <img src="../../assets/ic_default.jpg" alt="" />
            </div>
          </el-image>
        </el-timeline-item>
      </el-timeline>
    </div>
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getVisitingHistory } from '@/api/crm'
export default {
  name: 'HighSeasClients',
  data() {
    return {
      loading: true,
      text: '添加',
      tags: [],
      list: [],
      page: 1,
      size: 10,
      total: 0
    }
  },
  created() {},
  mounted() {
    const customer_id = this.$route.query.id
    this.getVisitingHistory(customer_id)
  },
  methods: {
    // 账号列表
    async getVisitingHistory(e) {
      const { page, size } = this
      const res = await getVisitingHistory({
        page,
        size,
        customer_id: e
      })
      if (res.code === 0) {
        this.list = res.data
        console.log(this.list);
        this.total = res.data.length
        this.loading = false
      }
    },

    handleCurrentChange(val) {
      this.loading = true
      this.page = val
    }
  }
}
</script>
<style lang="scss" scoped>
.team_flex {
  display: flex;
  align-items: center;
  .team {
    // width: 210px;
    text-decoration: underline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.high-seas-clients {
  .select {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .el-select {
      width: 224px;
      margin-right: 60px;
    }
    .el-input {
      width: 300px;
    }
    span {
      font-size: 15px;
      color: #333;
      margin-right: 15px;
    }
    .el-button {
      background-color: #3954b3;
      color: #fff;
    }
    .el-button + .el-button {
      background-color: #fff;
      color: #666666;
    }
  }
  .el-cascader {
    width: 100%;
  }
  .list {
    margin: 20px 0 60px 0;
    .el-select {
      width: 100% !important;
    }
  }
  .btns {
    .el-button {
      margin-left: 10px;
      border-radius: 4px;
      padding: 4px 6px;
      font-size: 12px;
    }
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
  }
  .tag {
    border: 1px solid #0263d4;
    display: inline-block;
    color: #0263d4;
    border-radius: 2px;
    padding: 0 2px;
    margin-right: 10px;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
  }
}
</style>
<style lang="scss">
.el-popover__title {
  padding-left: 10px;
}
// element ui
.high-seas-clients {
  .ti-input {
    height: 40px;
    width: 558px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 15px;
    .ti-new-tag-input-wrapper {
      padding: 0 !important;
      font-size: 14px;
    }
    .ti-tag {
      background-color: rgba($color: #000000, $alpha: 0);
      color: #0263d4;
      border: 1px solid #0263d4;
      border-radius: 4px;
    }
    input {
      color: #606266;
    }
    input[type='text']::placeholder {
      color: #c0c4cc;
    }
  }
  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  .el-input__suffix {
    .suffix {
      padding-right: 20px;
    }
  }
  .el-select {
    width: 100%;
  }

  .el-button--text {
    padding: 0;
  }
  .el-dialog {
    position: absolute;
    margin-top: 0 !important;
    top: 50%;
    left: 50%;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      text-align: center;
      padding-bottom: 0;
      color: #333333;
      font-weight: bold;
      .el-dialog__title {
        font-size: 22px;
      }
      .el-dialog__close {
        display: none;
      }
    }
    .el-dialog__body {
      padding-bottom: 10px;
    }
  }

  .el-button--primary.is-plain {
    color: #fff;
    background-color: #3954b3;
    border: 0;
  }
}

.visit {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #999999;
}

.Visitrecord_time {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-left: 23px;
  margin-right: 8px;
}
.contact_type {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-right: 35px;
}

.Visitrecord_type {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100px;
  height: 28px;
  background: #cce0f6;
  border-radius: 4px;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #3954b3;
  margin-right: 32px;
}

.Visitrecord_flex {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}
</style>
