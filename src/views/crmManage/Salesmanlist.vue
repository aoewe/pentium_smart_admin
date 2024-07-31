<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="high-seas-clients main-box"
  >
    <div class="select">
      <el-input
        size="small"
        placeholder="请输入客户名称"
        v-model="username"
        style="margin-right: 3px"
      >
        <template slot="prepend">用户名</template>
      </el-input>
      <el-input
        size="small"
        placeholder="请输入联系人手机"
        v-model="mobile"
        style="margin-right: 3px"
      >
        <template slot="prepend">联系人手机</template>
      </el-input>
      <el-button
        size="small"
        @click=";(page = 1), (loading = true), getUserList()"
        >查 询</el-button
      >
      <el-button size="small" @click=";(page = 1), reset()">重 置</el-button>
    </div>
    <el-drawer title="我是标题" :visible.sync="drawers" :with-header="false">
      <template>
        <el-table :data="bis" style="width: 100%">
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="business_level_name" label="职位" width="180">
          </el-table-column>
          <el-table-column prop="reporting" label="报备数量"> </el-table-column>
        </el-table>
      </template>
    </el-drawer>
    <!-- 列表 -->
    <div class="list">
      <el-table
        :data="list"
        style="width: 100%"
        :height="list.length ? 'calc(100vh - 300px)' : '100px'"
      >
        <el-table-column label="用户名" min-width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.username }}</div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" min-width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column label="业务等级" min-width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.business_level_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户上限" min-width="80">
          <template slot-scope="scope">
            <div style="padding: 0px 22px">
              {{ scope.row.max_baobei_number }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="提成总金额" min-width="80">
          <template slot-scope="scope">
            <div style="padding: 0px 5px">
              {{ scope.row.commission_money }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="成交总金额" min-width="80">
          <template slot-scope="scope">
            <div style="padding: 0px 5px">
              {{ scope.row.money }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="报备数量" min-width="80">
          <template slot-scope="scope">
            <el-link
              style="padding: 0px 25px"
              type="primary"
              @click="gotoReporting(scope.row.id)"
              >{{ scope.row.reporting }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="成交归档数量" min-width="80">
          <template slot-scope="scope">
            <el-link
              style="padding: 0px 35px"
              type="primary"
              @click="gotoFinishList(scope.row.id)"
              >{{ scope.row.finish }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="直属上级名称/身份" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.up_business_name">
              {{ scope.row.up_business_name }}/{{ scope.row.up_business_level }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-link type="primary" @click="drawer(scope.row.id)"
              >查看团队<i class="el-icon-view el-icon--right"></i>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
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
import { getBusinessFans, editCustomer, setBelongCustomer } from '@/api/crm'
import { getUserList } from '@/api/user'
import VueTagsInput from '@johmun/vue-tags-input'
export default {
  name: 'HighSeasClients',
  components: {
    VueTagsInput
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else {
        if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      dialogVisible: false,
      drawers: false,

      username: '',
      contacts: '',
      mobile: '',
      status: '',
      loading: true,

      tags: [],
      list: [],
      page: 1,
      size: 10,
      total: 0,
      bis: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    reset() {
      this.username = ''
      this.mobile = ''
      this.loading = true
      this.getUserList()
    },
    async getUserList() {
      let filters = {}
      this.username && (filters.username = this.username)
      this.mobile && (filters.mobile = this.mobile)
      filters.is_business = 1
      const { page, size } = this
      const params = {
        filters,
        page,
        size,
        sorts: {}
      }
      const res = await getUserList(params)
      if (res.code === 0) {
        this.list = res.data.list
        this.total = res.data.total
        this.loading = false
      }
    },
    gotoReporting(e) {
      this.$router.push({ path: './Reporting', query: { id: e } })
    },
    gotoFinishList(e) {
      this.$router.push({ path: './FinishList', query: { id: e } })
    },
    async drawer(e) {
      this.drawers = true
      const { page, size } = this
      const res = await getBusinessFans({
        page,
        size,
        user_id: e
      })
      if (res.code === 0) {
        this.bis = res.data
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getUserList()
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
</style>
