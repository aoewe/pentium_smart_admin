<template>
  <div v-loading="loading" class="unsettled-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="username" label="购买方" min-width="300" />
        <el-table-column label="20000W设备数量" min-width="300">
          <template slot-scope="scope">{{ scope.row.w2 }}台</template>
        </el-table-column>
        <el-table-column label="30000W设备数量" min-width="300">
          <template slot-scope="scope">{{ scope.row.w3 }}台</template>
        </el-table-column>
        <el-table-column label="40000W设备数量" min-width="300">
          <template slot-scope="scope">{{ scope.row.w4 }}台</template>
        </el-table-column>
        <el-table-column label="待结算产量" min-width="150">
          <template slot-scope="scope">
            <span v-convert="scope.row.need_set"></span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button style="padding:0;" type="text" @click="handelRow(scope.row)">结算</el-button>
            <el-button style="padding:0;" type="text" @click="details(scope.row.id)">结算列表</el-button>
          </template>
        </el-table-column> -->
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
import { getSettlementList } from '@/api/settlement'
export default {
  name: 'Purchaser',
  data() {
    return {
      total: 0,
      loading: true,
      page: 1,
      size: 10,
      list: []
    }
  },
  created() {
    this.getSettlementList()
  },
  methods: {
    details(id) {
      this.$router.push({ path: './settlementList', query: { id }})
    },
    async getSettlementList() {
      const params = {
        filters: {},
        sorts: {},
        size: this.size,
        page: this.page
      }
      const { code, data } = await getSettlementList(params)
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handelRow(row) {
      this.$router.push({ path: './purchaserDetails', query: { info: row }})
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getSettlementList()
    }
  }
}
</script>
<style lang="scss">
.unsettled-list{
  .list{
    padding-top: 10px;
  }
  .el-drawer{
    width: 100vw !important;
    .el-drawer__header{
      position: absolute;
      right: 0;
    }
  }
}
</style>
