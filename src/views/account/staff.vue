<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" class="account main-box">
    <!-- <div class="select">
      <span>类型筛选</span>
      <el-select v-model="type">
        <el-option :value="4" label="岗位1" />
        <el-option :value="3" label="岗位2" />
      </el-select>
      <el-button>查 询</el-button>
      <el-button>重 置</el-button>
    </div> -->
    <el-button icon="el-icon-plus" type="primary" plain @click="dialogVisible = true, text = '添加岗位'">添 加</el-button>
    <el-dialog :title="text" :visible.sync="dialogVisible" width="428px">
      <el-form ref="form" :model="form" :rules="rules" label-width="102px">
        <el-form-item label="岗位名称" prop="post_name">
          <el-input v-model="form.post_name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="薪资" prop="salary">
          <el-input v-model="form.salary" placeholder="请输入实际薪资" />
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
        <el-table-column prop="create_time" label="添加时间" />
        <el-table-column prop="post_name" label="岗位" />
        <el-table-column prop="salary" label="薪资">
          <template slot-scope="scope">{{ scope.row.salary }}（元）</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button icon="edit" type="text" @click="editUser(scope.row)">编辑</el-button>
            <el-button icon="delete" type="text" @click="deleteUser(scope.row)">删除</el-button>
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
import { getMemberList, editMember } from '@/api/user'
export default {
  name: 'Staff',
  data() {
    return {
      dialogVisible: false,
      loading: true,
      text: '添加岗位',
      type: '',
      list: [],
      page: 1,
      size: 10,
      total: 0,
      form: {
        post_name: '',
        salary: ''
      },
      rules: {
        post_name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        salary: [
          { required: true, message: '请输入薪资', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getMemberList()
  },
  methods: {
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          const params = this.form
          params.create_time && delete params.create_time
          params.update_time && delete params.update_time
          const res = await editMember(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: this.text === '添加岗位' ? '添加成功' : '编辑成功'
            })
            this.initForm()
            this.getMemberList()
          }
        }
      })
    },
    initForm() {
      this.$refs['form'].resetFields()
      this.dialogVisible = false
      this.form = {
        post_name: '',
        salary: ''
      }
    },
    async getMemberList() {
      const params = {
        filters: {},
        sorts: {},
        page: this.page,
        size: this.size
      }
      const { code, data } = await getMemberList(params)
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    // 编辑
    editUser(row) {
      this.text = '编辑岗位'
      this.form = { ...row }
      this.dialogVisible = true
    },
    // 删除岗位
    deleteUser(row) {
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.list.length === 1 && this.page > 1) {
            this.page--
          }
          this.getUserList()
        })
        .catch(() => {})
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getMemberList()
    }
  }
}
</script>
<style lang="scss" scoped>
.account {
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
  .dialog-footer {
    display: flex;
    justify-content: center;
    .el-button {
      height: 32px;
      width: 88px;
      padding: 0;
    }
    .el-button + .el-button {
      background-color: #3954b3;
      border-color: #3954b3;
      &:hover{
        background-color: rgba($color: #3954b3, $alpha: .8);
      }
    }
  }
}
</style>
<style lang="scss">
// element ui
.account {
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
  .avatar-uploader {
    height: 60px;
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 18px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .avatar {
      width: 60px;
      height: 60px;
      display: block;
    }
  }
}
</style>
