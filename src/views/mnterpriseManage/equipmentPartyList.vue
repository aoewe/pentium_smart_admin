<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="equipment-list main-box">
    <div class="list">
      <el-table :data="list" style="width: 100%" @row-click="handelRow">
        <el-table-column prop="username" label="购买方" min-width="200" />
        <el-table-column label="企业地址" prop="address" min-width="300" />
        <el-table-column label="联系人" prop="delegate_name" min-width="150" />
        <el-table-column label="联系方式" prop="mobile" min-width="200" />
        <el-table-column label="营业执照" min-width="200">
          <template slot-scope="scopes">
            <u style="cursor: pointer;" @click="showPreview(scopes.row.license)">点击查看</u>
          </template>
        </el-table-column>
        <el-table-column label="总收益" min-width="200">
          <template slot-scope="scopes"><span style="color:#3954B3">{{ scopes.row.profit_count }}（元）</span></template>
        </el-table-column>
        <el-table-column label="设备数量"  min-width="150">
          <template slot-scope="scopes">{{ scopes.row.equipment_count }}台</template>
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
import { getEquipmentList } from '@/api/equipment'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'EquipmentPartyList',
  components: { ElImageViewer },
  data() {
    return {
      list: [],
      license: false,
      loading: true,
      srcList: [],
      total: 0,
      size: 10,
      page: 1
    }
  },
  created() {
    this.getEquipmentList()
  },
  methods: {
    handelRow(row, column) {
      if (column.label === '营业执照') return
      this.$router.push({ path: './equipmentDetails', query: { id: row.id }})
    },
    showPreview(e) {
      const that = this
      const imgres = new Image()
      imgres.src = e
      imgres.onload = function() {
        that.srcList[0] = e
        that.license = true
      }
      imgres.onerror = function() {
        that.$notify({
          title: '提示',
          message: '未上传营业执照/加载失败',
          type: 'warning',
          duration: 1000
        })
      }
    },
    async getEquipmentList() {
      const res = await getEquipmentList({ filters: {}, sorts: {}, size: this.size, page: this.page })
      if (res.code === 0) {
        this.list = res.data.list
        this.total = res.data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getEquipmentList()
    }
  }
}
</script>
<style lang="scss" scoped>
.equipment-list {
  .list {
    margin-bottom: 40px;
  }
  .table{
    padding: 20px 50px;
  }

}
</style>
<style lang="scss">
// element ui
.el-icon-circle-close:before{
  color: #fff;
}
.equipment-list {
  .el-drawer{
    overflow-y: scroll;
  }
  .table{
    .el-table{
      font-size: 18px;
      &::before{
        background-color: #fff;
      }
      td,th.is-leaf{
        border: none;
      }
      color: #333;
      thead{
        color: #333;
      }
    }
  }
  .list{
    padding-top: 10px;
  }
  .el-drawer__header{
    padding-left: 60px;
    font-size: 22px;
    color: #333;
    margin-bottom: 0;
    font-weight: bold;
    .el-drawer__close-btn{
      position: fixed;
      right: 20px;
      top: 10px;
      font-size: 30px;
    }
  }
}
</style>
