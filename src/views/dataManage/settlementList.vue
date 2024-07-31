<template>
  <div v-loading="loading" class="unsettled-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <span style="font-size:15px;margin-right:15px;color:#333;">选择时间</span>
      <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="始" end-placeholder="终" style="margin-right: 30px" @change="changeFilterDate" />
      <el-button @click="details()">查 询</el-button>
    </div>
    <div v-if="!type" class="list">
      <el-table :data="list" style="width: 100%">
        <!-- <el-table-column type="expand" width="20">
          <template slot-scope="props">
            <ul class="expand-box">
              <li v-for="item in props.row.factory_user_info" :key="item.factory_user_id">
                <span>设备占比：{{ item.equipment_proportion }}</span>
                <span>结算总产量：{{ item.processed_count }}（吨）</span>
                <span></span>
                <span></span>
              </li>
            </ul>
          </template>
        </el-table-column> -->
        <el-table-column prop="create_time" label="结算时间" width="220" />
        <el-table-column label="扣除岗位">
          <template slot-scope="scope">
            <span v-for="item in scope.row.post_info" :key="item.post_id" class="comma">{{ item.post_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="扣除薪资">
          <template slot-scope="scope">
            <span v-for="item in scope.row.post_info" :key="item.post_id" class="comma">¥{{ item.salary }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" width="300">
          <template slot-scope="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="服务费" width="300">
          <template slot-scope="scope">¥{{ scope.row.server_price }}</template>
        </el-table-column>
        <el-table-column label="结算状态" width="160">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.pay_status===0?'#FF5858':'#01BB00')}">{{ scope.row.pay_status===0?'未打款':'已打款' }}</span>
            <el-popover placement="bottom-end" title="提示" trigger="click">
              <span slot="reference" class="status-btn">修改</span>
              <p>{{ `确定修改为${scope.row.pay_status===0?'已打款':'未打款'}?` }}</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="cancel()">取消</el-button>
                <el-button style="background-color:#3954B3;border-color:#3954B3" type="primary" size="mini" @click="changeStatus(scope.row)">确定</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="create_time" label="结算时间" />
        <el-table-column label="小件结算单价">
          <template slot-scope="scope">¥{{ scope.row.set_price }}</template>
        </el-table-column>
        <el-table-column label="大件结算单价">
          <template slot-scope="scope">¥{{ scope.row.set_price_two }}</template>
        </el-table-column>
        <el-table-column label="小件结算吨数">
          <template slot-scope="scope">
            <span v-convert="scope.row.processed"></span>
          </template>
        </el-table-column>
        <el-table-column label="大件结算吨数">
          <template slot-scope="scope">
            <span v-convert="scope.row.processed_two"></span>
          </template>
        </el-table-column>
        <el-table-column label="结算总金额">
          <template slot-scope="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="结算状态" width="160">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.pay_status===0?'#FF5858':'#01BB00')}">{{ scope.row.pay_status===0?'未打款':'已打款' }}</span>
            <el-popover placement="bottom-end" title="提示" trigger="click">
              <span slot="reference" class="status-btn">修改</span>
              <p>{{ `确定修改为${scope.row.pay_status===0?'已打款':'未打款'}?` }}</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="cancel()">取消</el-button>
                <el-button style="background-color:#3954B3;border-color:#3954B3" type="primary" size="mini" @click="changeStatus(scope.row)">确定</el-button>
              </div>
            </el-popover>
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
import { getSetList, getFactorySetList, paySettlement, payFactorySettlement } from '@/api/settlement'
export default {
  data() {
    return {
      total: 0,
      id: '',
      loading: true,
      page: 1,
      size: 10,
      list: [],
      date: '',
      type: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type || ''
    this.details()
  },
  methods: {
    changeFilterDate(time) {
      time && (this.date = [time[0].getTime(), time[1].getTime()])
    },
    cancel() {
      document.body.click()
    },
    async changeStatus(row) {
      const { code } = this.type ? await payFactorySettlement({ id: row.id, status: row.pay_status === 0 ? 1 : 0 }) : await paySettlement({ id: row.id, status: row.pay_status === 0 ? 1 : 0 })
      if (code === 0) {
        document.body.click()
        this.details()
      }
    },
    async details() {
      const date = this.date
      const params = { id: this.id, page: this.page, size: this.size }
      date && (params.month_begin = date[0].toString().slice(0, -3), params.month_end = date[1].toString().slice(0, -3))
      const { code, data } = this.type ? await getFactorySetList(params) : await getSetList(params)
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.details()
    }
  }
}
</script>
<style lang="scss">
.unsettled-list{
  .select {
    margin: 15px 0 30px;
    .el-button {
      background-color: #3954b3;
      color: #fff;
    }
    .el-button + .el-button {
      background-color: #fff;
      color: #666666;
    }
  }
  .status-btn{
    padding-left: 20px;
    cursor: pointer;
  }
  .comma:not(:last-child){
    &::after{
      content: '，';
    }
  }
  tr:hover{
    background-color: #fff;
  }
  .el-table__expanded-cell{
    padding: 0;
  }
  .expand-box{
    padding: 24px;
    margin-top: -18px;
    border: 1px solid #eee;
    border-top: 0;
  }
}

</style>
