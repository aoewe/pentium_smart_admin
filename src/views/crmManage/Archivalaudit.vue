<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="post-review main-box"
  >
    <el-dialog :visible.sync="dialogVisible" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="客户分类" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="更新业务员提成金额"
          :prop="
            form.commission_money > money ? 'no_commission' : 'commission_money'
          "
        >
          <el-input
            type="number"
            v-model="form.commission_money"
            placeholder="请输入业务员提成金额"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVtow" width="700px">
      <el-form ref="parm" :model="parm" :rules="rules" label-width="142px">
        <el-form-item
          label="更新打款金额"
          :prop="parm.get_money > money ? 'exceed_limit' : 'get_money'"
        >
          <el-input
            type="number"
            v-model="parm.get_money"
            placeholder="请输入打款金额"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForms()">取 消</el-button>
        <el-button type="primary" @click="submits">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 列表 -->
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="用户名" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.user_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="归档设备" min-width="220">
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
            <div style="padding: 0px 10px">{{ scope.row.equipment_num }}</div>
          </template>
        </el-table-column>
        <el-table-column label="金额" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="已打款金额" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.get_money">{{ scope.row.get_money }}</div>
            <div v-else>无</div>
          </template>
        </el-table-column>
        <el-table-column label="未打款金额" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.no_money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同编号" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.contract_num }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="handover_time"
          label="签约时间"
          min-width="120"
        />
        <el-table-column prop="create_time" label="交机时间" min-width="150" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-button
              icon="edit"
              v-if="scope.row.edit_status === 0"
              type="text"
              @click="Audit(scope.row)"
              >待审核</el-button
            >
            <el-button
              icon="delete"
              v-if="scope.row.edit_status === 1"
              type="text"
              @click="editGetMoney(scope.row)"
              >更新</el-button
            >
            <el-button
              icon="delete"
              v-if="scope.row.edit_status === 1"
              type="text"
              @click="editStatus(scope.row.id)"
              >验收</el-button
            >
            <el-button
              icon="delete"
              v-if="scope.row.edit_status === 2"
              type="text"
              >已验收</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { Archivalaudit, editFinish, editStatus, editGetMoney } from '@/api/crm'
export default {
  name: 'PostReview',
  data() {
    return {
      loading: true,
      dialogVisible: false,
      dialogVtow: false,
      list: [],
      total: 0,
      page: 1,

      form: {
        id: '',
        type: '',
        commission_money: ''
      },
      parm: {
        id: '',
        get_money: ''
      },
      money: '',
      options: [
        {
          value: 1,
          label: '销售 '
        },
        {
          value: 2,
          label: '铺设'
        }
      ],
      rules: {
        type: [{ required: true, message: '请选择签约类型', trigger: 'blur' }],
        commission_money: [
          { required: true, message: '请输入业务员提成金额', trigger: 'blur' }
        ],
        no_commission: [
          { required: true, message: '提成金额超出上限', trigger: 'blur' }
        ],
        get_money: [
          { required: true, message: '请输入打款金额', trigger: 'blur' }
        ],
        exceed_limit: [
          { required: true, message: '打款金额超出上限', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.Archivalaudit()
  },
  methods: {
    async Archivalaudit(filters = {}) {
      const params = {
        page: this.page,
        size: 10,
        sorts: {},
        filters
      }
      const { code, data } = await Archivalaudit(params)
      if (code === 0) {
        for (let i = 0; i < data.list.length; i++) {
          if (data.list[i].handover_time) {
            const time = new Date(data.list[i].handover_time)
            const newtiem = new Date(time * 1000)
            const year = newtiem.getFullYear()
            const month = newtiem.getMonth() + 1
            const day = newtiem.getDate()
            const hour = newtiem.getHours()
            const minute =
              newtiem.getMinutes() < 10
                ? '0' + newtiem.getSeconds()
                : newtiem.getSeconds()
            const second =
              newtiem.getSeconds() < 10
                ? '0' + newtiem.getSeconds()
                : newtiem.getSeconds()
            const times = `${year}-${month}-${day} ${hour}:${minute}:${second}`
            data.list[i].handover_time = times
          }
          data.list[i].no_money = data.list[i].money - data.list[i].get_money
        }
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    //审核
    Audit(e) {
      this.money = e.money
      this.form.id = e.id
      this.dialogVisible = true
    },
    //取消
    initForm() {
      this.form = {
        id: '',
        type: '',
        commission_money: ''
      }
      this.$refs['form'].resetFields()
      this.dialogVisible = false
    },
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const params = JSON.parse(JSON.stringify(this.form))
          console.log(params)
          const res = await editFinish(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '审核成功'
            })
            this.Archivalaudit()
            this.dialogVisible = false
          }
        }
      })
    },
    //客户归档验收
    async editStatus(e) {
      const params = {
        id: e
      }
      const res = await editStatus(params)
      if (res.code === 0) {
        this.$message({
          type: 'success',
          message: '验收成功'
        })
        this.Archivalaudit()
      }
    },
    //金额更新
    editGetMoney(e) {
      this.money = e.money
      this.parm.id = e.id
      this.dialogVtow = true
    },
    initForms() {
      this.parm = {
        id: '',
        get_money: ''
      }
      this.$refs['parm'].resetFields()
      this.dialogVtow = false
    },
    submits() {
      this.$refs['parm'].validate(async value => {
        if (value) {
          const params = JSON.parse(JSON.stringify(this.parm))
          console.log(params)
          const res = await editGetMoney(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.Archivalaudit()
            this.dialogVtow = false
          }
        }
      })
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.Archivalaudit()
    }
  }
}
</script>
<style lang="scss" scoped>
.post-review {
  .select {
    display: flex;
    align-items: center;
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
  .methods {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0;
    span {
      color: #666666;
      font-size: 13px;
    }
  }
  .list {
    margin: 20px 0 60px 0;
    .btns {
      .el-button {
        border-radius: 4px;
        padding: 6px 12px;
      }
    }
  }
}
</style>
