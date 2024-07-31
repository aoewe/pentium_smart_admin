<template>
  <div v-loading="loading" class="authority main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <el-button class="add" icon="el-icon-plus" type="primary" @click="setEditApi(form)">新增</el-button>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <el-form ref="apiForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="API路径" prop="path">
          <el-input placeholder="请输入API路径" v-model="form.path" autocomplete="off" />
        </el-form-item>
        <el-form-item label="API描述" prop="name">
          <el-input placeholder="请输入API描述" v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否显示" style="width: 30%">
          <el-select v-model="form.is_hidden" placeholder="是否显示">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <div>
      <el-table :data="tableData" row-key="id" style="margin-bottom:38px" height="calc(100vh - 260px)">
        <el-table-column label="ID" min-width="60" prop="id" sortable="custom" />
        <el-table-column label="API路径" min-width="150" prop="path" sortable="custom" />
        <el-table-column label="API描述" min-width="150" prop="name" sortable="custom" />
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="text" @click="setEditApi(scope.row)">编辑</el-button>
            <el-button icon="el-icon-delete" type="text" @click="deleteApiFunc(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :page-size="size"
      :total="total"
      layout="prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getAllApis, editApi, editMenuStatus } from '@/api/authority'
export default {
  name: 'AuthorityApi',
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogTitle: '新增API',
      isEdit: false,
      form: {
        path: '',
        name: '',
        is_hidden: 1
      },
      rules: {
        path: [{ required: true, message: '请输入API路径', trigger: 'blur' }],
        name: [{ required: true, message: '请输入API描述', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      page: 1,
      size: 10,
      total: 0
    }
  },
  created() {
    this.getAllApis()
  },

  methods: {
    // 获取列表
    async getAllApis() {
      const params = {
        filters: {},
        sorts: {},
        type: 0,
        page: this.page,
        size: this.size
      }
      const res = await getAllApis(params)
      if (res.code === 0) {
        this.total = res.data.total
        this.tableData = res.data.list
        this.loading = false
      }
    },
    // 新增or编辑
    async setEditApi(row) {
      this.form = { ...row }
      if (row.id) {
        this.dialogTitle = '编辑API'
        this.isEdit = true
      } else {
        this.dialogTitle = '新增API'
        this.isEdit = false
      }
      this.dialogFormVisible = true
    },
    // 初始化表单
    initForm() {
      this.$refs['apiForm'].resetFields()
      this.form = {
        path: '',
        name: '',
        is_hidden: 1
      }
      this.dialogFormVisible = false
    },
    closeDialog() {
      this.initForm()
      this.dialogFormVisible = false
    },
    // 提交
    async enterDialog() {
      this.$refs['apiForm'].validate(async valid => {
        if (valid) {
          this.form.type = 1// api
          const res = await editApi(this.form)
          const { code, msg } = res
          if (code === 0) {
            this.$message({
              type: 'success',
              message: this.isEdit ? '编辑成功' : '添加成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.getAllApis()
          this.initForm()
        }
      })
    },
    // 删除
    async deleteApiFunc(row) {
      this.$confirm('删除选中API, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await editMenuStatus({ id: row.id, is_hidden: 2 })
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.tableData.length === 1 && this.page > 1) {
              this.page--
            }
            this.getAllApis()
          }
        })
    },
    // 分页
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getAllApis()
    }
  }
}
</script>
<style lang="scss" scoped>
.authority {
  .add {
    background-color: #3954b3;
    border: 0;
  }
  .list{
    margin-bottom: 55px;
  }
}
</style>
<style lang="scss">
.authority {
  .el-table {
    margin-top: 20px;
    th {
      background-color: rgba($color: #3954b3, $alpha: 0.1);
      color: #333333;
    }
  }
  .el-tabs--border-card{
    border: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
</style>
