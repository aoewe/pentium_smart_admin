<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="equipment-details main-box">
    <div class="select">
      <el-select placeholder="请选择设备功率" size="small" v-model="type" style="margin-right: 3px">
        <el-option :value="2" label="20000W" />
        <el-option :value="3" label="30000W" />
        <el-option :value="4" label="40000W" />
      </el-select>
      <el-select placeholder="请选择设备状态" size="small" v-model="status" style="margin-right: 30px">
        <el-option :value="0" label="空闲" />
        <el-option :value="1" label="工作中" />
        <el-option :value="2" label="故障" />
        <el-option :value="3" label="维修中" />
      </el-select>
      <el-button size="small" @click="getEquipmentInfo()">查 询</el-button>
      <el-button size="small" @click="reset()">重 置</el-button>
      <span style="padding-left: 60px;">企业名称：{{ userName }}</span>
      <span style="padding-left: 40px">设备数量：{{ equipmentList.length || '0' }}台</span>
    </div>
    <div class="list">
      <el-table :data="equipmentList" style="width: 100%" @cell-click="handelRow">
        <el-table-column prop="number" label="设备编号" width="150" />
        <el-table-column prop="number" label="设备功率" width="120">
          <template slot-scope="scope">{{ scope.row.type }}0000W</template>
        </el-table-column>
        <el-table-column prop="factory_user_name" label="铺设方" min-width="250" />
        <el-table-column label="铺设时间" width="160">
          <template slot-scope="scope">{{ handelDate(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column label="总切割产量" min-width="300">
          <template slot-scope="scope">{{ scope.row.processed_count<1000?scope.row.processed_count+'kg':scope.row.processed_count/1000+'吨' }}（大件{{ scope.row.processed_two<1000?scope.row.processed_two+'kg':scope.row.processed_two/1000+'吨' }}；小件{{ scope.row.processed<1000?scope.row.processed+'kg':scope.row.processed/1000+'吨' }}）</template>
        </el-table-column>
        <el-table-column label="总切割原料" min-width="120">
          <template slot-scope="scope">
            <span v-convert="scope.row.raw"></span>
          </template>
        </el-table-column>
        <el-table-column label="总切割板材" min-width="120">
          <template slot-scope="scope">{{ scope.row.board_nub }}张</template>
        </el-table-column>
        <el-table-column label="设备日志" min-width="120">
          <template slot-scope="scope"><u @click="log(scope.row.id)">点击查看</u></template>
        </el-table-column>
        <el-table-column prop="number" label="设备状态" width="130">
          <template slot-scope="scope">
            <span :style="{'color':(scope.row.status===0?'#01BB00': scope.row.status===1?'#3954B3':scope.row.status===2 ? '#FF5858': scope.row.status===3?'#FFA238': '')}">
              {{ scope.row.status===0?'空闲': scope.row.status===1?'工作中':scope.row.status===2 ? '故障': scope.row.status===3?'维修中': '未知' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="设备日志" :visible.sync="dialogVisible" width="500px">
      <div v-for="item in logs" :key="item.create_time">
        <p style="font-size:16px;padding-bottom: 10px;margin-bottom: 0;">
          <span style="color:#666666">{{ item.user_name }}</span> <span style="color:#333333">{{ item.remark }}</span>
          <span v-if="!item.content.status"> 设备型号：{{ item.content.equipment_nub }}；设备类型：{{ item.content.equipment_type }}0000W；大件产量：{{ item.content.processed_two<1000?item.content.processed_two+'kg':item.content.processed_two/1000+'吨' }}；小件产量：{{ item.content.processed<1000?item.content.processed+'kg':item.content.processed/1000+'吨' }}；原料重量：{{ item.content.raw<1000?item.content.raw+'kg':item.content.raw/1000+'吨' }}；板材数量：{{ item.content.board_nub }}张；余料重量：{{ item.content.remain<1000?item.content.remain+'kg':item.content.remain/1000+'吨' }}；废料重量：{{ item.content.wasted<1000?item.content.wasted+'kg':item.content.wasted/1000+'吨' }}；</span>
        </p>
        <p style="margin-top:0"><span>{{ item.create_time }}</span></p>
      </div>
      <div v-if="logs.length<1" style="padding:24px">暂无日志</div>
      <span slot="footer" class="dialog-footer">
        <el-pagination
          :page-size="logSize"
          layout="prev, pager, next, jumper"
          :total="logTotal"
          @current-change="handleCurrent"
        />
      </span>
    </el-dialog>
    <el-pagination
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getEquipmentInfo, getEquipmentLog } from '@/api/equipment'
export default {
  data() {
    return {
      loading: true,
      dialogVisible: false,
      equipmentID: '',
      page: 1,
      logSize: 6,
      size: 10,
      total: 0,
      type: '',
      status: '',
      logPage: 1,
      logTotal: 0,
      logs: [],
      userName: '',
      equipmentList: []
    }
  },
  created() {
    this.equipmentID = this.$route.query.id
    this.getEquipmentInfo()
  },
  methods: {
    async log(id) {
      this.logid = id || this.logid
      const { code, data } = await getEquipmentLog({ id: this.logid, page: this.logPage, size: this.logSize })
      if (code === 0) {
        this.logs = data.list
        this.logTotal = data.total
      }
      this.dialogVisible = true
    },
    reset() {
      this.type = ''
      this.status = ''
      this.getEquipmentInfo()
    },
    handelRow(row, column) {
      if (column.label === '设备日志') return
      this.$router.push({ path: '../dataManage/form', query: { eid: row.id }})
    },
    changeRow(row) {
      this.form.status = row.status
      this.form.id = row.id
    },
    cancel() {
      document.body.click()
    },
    handelDate(time) {
      return time.slice(0, -8)
    },
    async getEquipmentInfo() {
      const params = {
        id: this.equipmentID,
        page: this.page,
        size: this.size
      }
      this.type && (params.type = this.type)
      this.status && (params.status = this.status)
      const { code, data } = await getEquipmentInfo(params)
      if (code === 0) {
        this.userName = data.username
        this.equipmentList = data.equipment_list.list
        this.loading = false
        this.total = data.equipment_list.total
      }
    },
    handleCurrent(val) {
      this.logPage = val
      this.log()
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getEquipmentInfo()
    }
  }
}
</script>
<style lang="scss">
.equipment-details{
  .list{
    margin-bottom: 50px;
  }
  .el-dialog__header{
    font-weight: bold;
    text-align: center;
  }
  .el-dialog__body{
    padding-top: 0;
  }
  u{
    cursor: pointer;
  }
  .select {
    margin: 15px 0 30px;
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
}
</style>
