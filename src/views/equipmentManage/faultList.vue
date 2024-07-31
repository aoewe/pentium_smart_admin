<template>
  <div v-loading="loading" class="fault-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div class="select">
      <el-input placeholder="请输入设备简称" size="small" v-model="name" style="margin-right: 3px">
        <template slot="prepend">简称</template>
      </el-input>
      <el-select size="small" placeholder="请选择设备功率" v-model="type" style="margin-right: 30px">
        <el-option value="2" label="20000W" />
        <el-option value="3" label="30000W" />
        <el-option value="4" label="40000W" />
      </el-select>
      <el-button size="small" @click="loading=true,getRepairList()">查 询</el-button>
      <el-button size="small" @click="type = '', status = ''">重 置</el-button>
    </div>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="name" label="设备简称" min-width="10%" />
        <el-table-column prop="number" label="设备编号" min-width="10%" />
        <el-table-column prop="type" label="设备型号" min-width="10%">
          <template slot-scope="scope">{{ scope.row.type }}0000W</template>
        </el-table-column>
        <el-table-column prop="factory_user_name" label="铺设方" min-width="15%" />
        <el-table-column label="故障原因" min-width="15%">
          <template slot-scope="scopes">{{ scopes.row.remarks || '未知' }}</template>
        </el-table-column>
        <el-table-column prop="fault_time" label="故障时间" min-width="15%"/>
        <el-table-column label="设备状态" min-width="9%">
          <template slot-scope="scope">
            <span style="padding-right:10px" :style="{color:(scope.row.status === 2 ? '#EC2C26' : '#FFA238')}">{{ scope.row.status === 2 ? '故障' : scope.row.status === 3 ? '维修中' : '其他' }}</span>
            <el-popover placement="top" width="300">
              <div>
                <div style="font-size: 16px;font-weight: 600;margin-bottom: 20px;">修改状态</div>
                <el-form ref="form" :rules="rules" :model="form">
                  <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status">
                      <el-option :value="0" label="空闲" />
                      <el-option :value="1" label="工作中" />
                      <el-option :value="2" label="故障" />
                      <el-option :value="3" label="维修中" />
                    </el-select>
                  </el-form-item>
                </el-form>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" @click="cancel()">取消</el-button>
                  <el-button style="background-color:#3954B3;border-color:#3954B3" type="primary" size="mini" @click="handelStatus(scope.row.id)">确定</el-button>
                </div>
              </div>
              <span slot="reference" style="cursor: pointer;" @click="changeRow(scope.row)">修改</span>
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
import { getRepairList, setEquipmentStatus } from '@/api/equipment'
export default {
  name: 'FaultList',
  data() {
    return {
      loading: true,
      total: 0,
      size: 10,
      page: 1,
      name: '',
      type: '',
      list: [],
      form: {
        status: 0,
        id: ''
      },
      rules: {
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRepairList()
  },
  methods: {
    changeRow(row) {
      this.form.status = row.status
      this.form.id = row.id
    },
    cancel() {
      document.body.click()
    },
    handelStatus() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const { code } = await setEquipmentStatus(this.form)
          if (code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.getRepairList()
            document.body.click()
            this.$refs['form'].resetFields()
          }
        }
      })
    },
    async getRepairList() {
      const filters = {}
      this.name && (filters.name = this.name)
      this.type && (filters.type = this.type)
      const params = { page: this.page, size: this.size, sorts: {}, filters }
      const { code, data } = await getRepairList(params)
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getRepairList()
    }
  }
}
</script>
<style lang="scss" scoped>
.fault-list {
  .select {
    margin: 5px 0 40px;
    .el-input{
      width: 300px;
    }
    .el-select{
      width: 224px;
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
  .list {
    margin-bottom: 40px;
  }

}
</style>
