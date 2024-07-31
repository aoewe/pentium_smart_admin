<template>
  <div
    v-loading="loading"
    class="apply-list main-box"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="select">
      <el-select size="small" clearable placeholder="请选择状态" v-model="status" style="margin-right: 30px">
        <el-option value="0" label="待审核" />
        <el-option value="1" label="已同意" />
        <el-option value="2" label="已拒绝" />
      </el-select>
      <el-button size="small" @click="loading=true,applyMessageList()">查 询</el-button>
    </div>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="申请人" prop="name" min-width="120"/>
        <el-table-column label="联系方式" prop="mobile" min-width="200"/>
        <el-table-column label="申请时间" prop="create_time" min-width="200"/>
        <el-table-column label="所在地区" min-width="200">
          <template slot-scope="scope">{{scope.row.city || '- -'}}</template>
        </el-table-column>
        <el-table-column label="详细地址" min-width="200">
          <template slot-scope="scope">{{scope.row.address || '- -'}}</template>
        </el-table-column>
        <el-table-column label="状态" fixed="right" width="200">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
              active-color="#3954B3"
              inactive-color="#666666"
              :disabled="switchId===scope.row.id"
              active-text="已处理" inactive-text="未处理"
              :active-value="1"
              :inactive-value="0"
              @change="e=>changeStatus(e,scope.row)"></el-switch>
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
import { applyMessageList,setMessageStatus } from '@/api/equipment'
export default {
  name: 'EquipmentApply',
  data() {
    return {
      list: [],
      status: '',
      size: 10,
      page: 1,
      total: 0,
      switchId:'',
      loading: true
    }
  },
  created() {
    this.applyMessageList()
  },
  methods: {
    async changeStatus(val,row) {
      this.switchId = row.id
      const { code } = await setMessageStatus({ id: row.id, status: val })
      if(code===0){
        this.switchId = ''
        row.status = val
      }
    },
    async applyMessageList() {
      const filters = {}
      this.status && (filters.status = this.status)
      const { code, data } = await applyMessageList({
        page: this.page,
        size: this.size,
        filters,
        sorts: {}
      })
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.applyMessageList()
    }
  }
}
</script>
<style lang="scss">
.apply-list {
  .select {
    margin: 5px 0 40px;
    .el-select{
      width: 224px;
    }
    .el-button {
      background-color: #3954b3;
      color: #fff;
    }
  }
  .list {
    margin-bottom: 60px;
    .el-switch .el-switch__core,
    .el-switch .el-switch__label {
      width: 70px !important;
      margin:  0;
    }
  }
}
</style>

