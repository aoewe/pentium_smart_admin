<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="equipment-list main-box">
    <div class="list">
      <el-table :data="list" style="width: 100%" @row-click="handelRow">
        <el-table-column prop="username" label="铺设方" min-width="200" />
        <el-table-column label="20000W设备" min-width="120">
          <template slot-scope="scopes">{{ scopes.row['2w_count'] }}台</template>
        </el-table-column>
        <el-table-column label="30000W设备" min-width="120">
          <template slot-scope="scopes">{{ scopes.row['3w_count'] }}台</template>
        </el-table-column>
        <el-table-column label="40000W设备" min-width="120">
          <template slot-scope="scopes">{{ scopes.row['4w_count'] }}台</template>
        </el-table-column>
        <el-table-column label="企业地址" min-width="300">
          <template slot-scope="scopes">{{ scopes.row.address }}</template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="150">
          <template slot-scope="scopes">{{ scopes.row.mobile }}</template>
        </el-table-column>
        <el-table-column label="营业执照" min-width="150">
          <template slot-scope="scopes">
            <u style="cursor: pointer" @click="showPreview(scopes.row.license)">点击查看</u>
          </template>
        </el-table-column>
        <el-table-column label="切割总量" min-width="150">
          <template slot-scope="scopes">
            <span v-convert="scopes.row.processed_count"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-image-viewer v-if="license" :on-close="()=>{license=false}" :url-list="srcList" />
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getFactoryEquipmentList } from '@/api/equipment'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'EquipmentLayingParty',
  components: { ElImageViewer },
  data() {
    return {
      list: [],
      loading: true,
      license:false,
      srcList: [],
      total: 0,
      size: 10,
      page: 1,
    }
  },
  created() {
    this.getFactoryEquipmentList()
  },
  methods: {
    showPreview(e) {
      const that = this
      const imgres = new Image()
      imgres.src = e
      imgres.onload = function () {
        that.srcList[0] = e
        that.license = true
      }
      imgres.onerror = function () {
        that.$notify({
          title: '提示',
          message: '未上传营业执照/加载失败',
          type: 'warning',
          duration: 1000
        })
      }
    },
    handelRow(row, column) {
      if (column.label === '营业执照') return
      this.$router.push({ path: './layingDetails', query: { id: row.id }})
    },
    async getFactoryEquipmentList() {
      const res = await getFactoryEquipmentList({ filters: {}, sorts: {}, size: this.size, page: this.page })
      if (res.code === 0) {
        this.list = res.data.list
        this.total = res.data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getFactoryEquipmentList()
    }
  }
}
</script>
<style lang="scss" scoped>
.equipment-list {
  .list {
    margin-bottom: 40px;
    padding-top: 10px;
  }
}
</style>