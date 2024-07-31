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
        placeholder="请输入联系人手机"
        v-model="mobile"
        style="margin-right: 3px"
      >
        <template slot="prepend">联系人手机</template>
      </el-input>
      <el-input
        size="small"
        placeholder="请输入客户名称"
        v-model="name"
        style="margin-right: 3px"
      >
        <template slot="prepend">客户名称</template>
      </el-input>
      <el-select placeholder="请选择客户状态" size="small" v-model="status">
        <el-option value="0" label="未报备"></el-option>
        <el-option value="1" label="报备中"></el-option>
        <el-option value="2" label="待审核"></el-option>
        <el-option value="3" label="重复报备审批"></el-option>
        <el-option value="4" label="已报备"></el-option>
      </el-select>
      <el-button
        size="small"
        @click=";(page = 1), (loading = true), getCustomerList()"
        >查 询</el-button
      >
      <el-button size="small" @click=";(page = 1), reset()">重 置</el-button>
    </div>
    <!-- 列表 -->
    <div class="list">
      <el-table
        :data="list"
        style="width: 100%"
        :height="list.length ? 'calc(100vh - 300px)' : '100px'"
      >
        <el-table-column label="客户名称" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.user_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="归档设备" min-width="200">
          <template slot-scope="scope">
            <div>{{ scope.row.equipment_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.equipment_type }}</div>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.equipment_num }}</div>
          </template>
        </el-table-column>
        <el-table-column label="金额" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.money }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="handover_time" label="签约时间" min-width="150" />
        <el-table-column prop="create_time" label="交机时间" min-width="150" />
        <el-table-column label="拜访记录"  min-width="120">
          <template slot-scope="scope">
            <el-link @click="gotoVisitrecord(scope.row.id)">点击查看<i class="el-icon-view el-icon--right"></i> </el-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-button icon="edit" type="text" @click="editUser(scope.row)"
              >成功归档</el-button
            >
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
import {
  getFinishList,
} from '@/api/crm'
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
      name:'',
      status:'',
      mobile:'',
      loading: true,
      text: '添加',
      tags: [],
      list: [],
      page: 1,
      size: 10,
      total: 0,
      reporterForm: { user_id: '' },
      businessList: '',
    }
  },
  created() {
  },
  mounted() {
  // 获取路由传递的参数
  const user_id = this.$route.query.id;
  this.getFinishList(user_id)

},
  methods: {

    // 账号列表
    async getFinishList(e) {
      const {page,size} = this
      const res = await getFinishList({
        page,
        size,
        user_id:e
      })
      if (res.code === 0) {
        for (let i = 0; i < res.data.list.length; i++) {
				const time = new Date(res.data.list[i].handover_time);
				const newtiem = new Date(time * 1000);
				const year = newtiem.getFullYear();
				const month = newtiem.getMonth() + 1;
				const day = newtiem.getDate();
				const hour = newtiem.getHours();
				const minute = newtiem.getMinutes()< 10 ? '0' + newtiem.getSeconds() : newtiem.getSeconds();
				const second = newtiem.getSeconds()< 10 ? '0' + newtiem.getSeconds() : newtiem.getSeconds();
				const times = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
				res.data.list[i].handover_time = times
			}

        this.list = res.data.list
        this.total = res.data.total
        this.loading = false
      }
    },

    gotoVisitrecord(e) {
      this.$router.push({ path: './Visitrecord', query: { id: e } })
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
</style>
