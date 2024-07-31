<template>
  <div v-loading="loading" class="unsettled-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <!-- <el-table-column prop="username" label="铺设方" />
        <el-table-column label="2万瓦设备数量">
          <template slot-scope="scope">{{ scope.row.w2 }}台</template>
        </el-table-column>
        <el-table-column label="3万瓦设备数量">
          <template slot-scope="scope">{{ scope.row.w3 }}台</template>
        </el-table-column>
        <el-table-column label="4万瓦设备数量">
          <template slot-scope="scope">{{ scope.row.w4 }}台</template>
        </el-table-column>
        <el-table-column label="待结算产量">
          <template slot-scope="scope">{{ scope.row.need_set }}（吨）</template>
        </el-table-column> -->
        <!-- <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button style="padding:0;" type="text" @click="handelRow(scope.row)">结算</el-button>
            <el-button style="padding:0;" type="text" @click="details(scope.row.id)">结算列表</el-button>
          </template>
        </el-table-column> -->
        <el-table-column prop="username" label="铺设方" min-width="300" />
        <el-table-column label="总原料" min-width="250" >
          <template slot-scope="scope">
            <span v-convert="scope.row.raw"></span>
          </template>
        </el-table-column>
        <el-table-column label="总产量" min-width="250" >
          <template slot-scope="scope">
            <span v-convert="scope.row.processed_count"></span>
          </template>
        </el-table-column>
        <el-table-column label="大件产量" min-width="250" >
          <template slot-scope="scope">
            <span v-convert="scope.row.processed_two"></span>
          </template>
        </el-table-column>
        <el-table-column label="小件产量" min-width="250" >
          <template slot-scope="scope">
            <span v-convert="scope.row.processed"></span>
          </template>
        </el-table-column>
        <el-table-column label="板材数量" min-width="150" >
          <template slot-scope="scope">{{ scope.row.board_nub }}张</template>
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
// import { factorySettlementList } from '@/api/settlement'
import { factoryDataList } from '@/api/production'
export default {
  name: 'EquipmentParty',
  data() {
    return {
      loading: true,
      total: 0,
      page: 1,
      size: 10,
      list: []
    }
  },
  created() {
    this.factoryDataList()
  },
  methods: {
    details(id) {
      this.$router.push({ path: './settlementList', query: { id, type: 1 }})
    },
    async factoryDataList() {
      const params = {
        filters: {},
        sorts: {},
        size: this.size,
        page: this.page
      }
      const { code, data } = await factoryDataList(params)
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handelRow(row) {
      this.$router.push({ path: './factoryDetails', query: { info: row }})
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.factoryDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.list{
  padding-top: 10px;
}
</style>
