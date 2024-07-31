<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="salesman main-box">
    <!-- <div class="select">
      <span>类型筛选</span>
      <el-select v-model="type">
        <el-option :value="4" label="岗位1" />
        <el-option :value="3" label="岗位2" />
      </el-select>
      <el-button>查 询</el-button>
      <el-button>重 置</el-button>
    </div> -->
    <el-button icon="el-icon-plus" type="primary" plain @click="dialogVisible = true, text = '添加'">添 加</el-button>
    <el-dialog :title="text" :visible.sync="dialogVisible" width="428px">
      <el-form ref="form" :model="form" :rules="rules" label-width="102px">
        <el-form-item label="业务等级" prop="level_name">
          <el-input v-model="form.level_name" placeholder="请输入业务等级" />
        </el-form-item>
        <el-form-item label="提成比例" prop="ratio">
          <el-input v-model="form.ratio" type="number" placeholder="请输入提成比例">
            <span slot="suffix" style="padding-right: 20px;">%</span>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="id" label="编号" width="100" />
        <el-table-column prop="create_time" label="添加时间" min-width="200" />
        <el-table-column prop="level_name" label="业务等级" min-width="200" />
        <el-table-column label="提成比例" min-width="200">
          <template slot-scope="scope">{{ toParseInt(scope.row.ratio*100) }}%</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button icon="edit" type="text" @click="edit(scope.row)">编辑</el-button>
            <!-- <el-button icon="delete" type="text" @click="onDelete(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { businessList, editBusinessLev,delBusinessLev } from '@/api/user'
export default {
  name: 'Salesman',
  data() {
    return {
      dialogVisible: false,
      loading: true,
      text: '添加',
      list: [],
      form: {
        level_name: '',
        ratio: ''
      },
      rules: {
        level_name: [
          { required: true, message: '请输入业务等级', trigger: 'blur' }
        ],
        ratio: [
          { required: true, message: '请输入提成比例', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.businessList()
  },
  methods: {
    toParseInt(num){
      return parseInt(num)
    },
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const params = this.form
          params.ratio = params.ratio/100
          const res = await editBusinessLev(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: this.text +'成功'
            })
            this.initForm()
            this.businessList()
          }
        }
      })
    },
    initForm() {
      this.$refs['form'].resetFields()
      this.dialogVisible = false
      this.form = {
        level_name: '',
        ratio: ''
      }
    },
    async businessList() {
      const params = {
        filters: {},
        sorts: {},
      }
      const { code, data } = await businessList(params)
      if (code === 0) {
        this.list = data
        this.loading = false
      }
    },
    // 编辑
    edit(row) {
      this.text = '编辑'
      this.form.level_name=row.level_name
      this.form.ratio= parseInt(row.ratio*100)
      this.form.id=row.id
      this.dialogVisible = true
    },
    // 删除岗位
    onDelete(row) {
      this.$confirm('此操作将永久删除该业务等级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const {code} = await delBusinessLev({id:row.id})
          if(code!==0) return
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.businessList()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.salesman {
  .select {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .el-select {
      width: 224px;
      margin-right: 60px;
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
  .list {
    margin: 20px 0 60px 0;
  }
 
}
</style>
<style lang="scss">
// element ui
.salesman {
  .el-input--suffix .el-input__inner{
    padding-right: 0;
  }
  .el-select{
    width: 100%;
  }
  .el-button--text{
    padding: 0;
  }
  .el-dialog {
    position: absolute;
    margin-top: 0 !important;
    top: 50%;
    left: 50%;
    border-radius: 4px;
    transform: translate(-50%,-50%);
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
    .el-dialog__body{
      padding-bottom: 10px;
    }
  }
  .el-form-item{
    margin-bottom: 30px;
  }
  .el-button--primary.is-plain {
    color: #fff;
    background-color: #3954b3;
    border: 0;
  }
}
</style>
