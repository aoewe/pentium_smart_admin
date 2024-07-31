<template>
  <div v-loading="loading" class="authority main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <el-button class="add" icon="el-icon-plus" type="primary" @click="addAuthority('0')">新增角色</el-button>
    <!-- 新增角色弹窗 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" width="520px">
      <el-form
        ref="authorityForm"
        :model="form"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item label="角色姓名" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色状态" style="width: 50%">
          <el-select v-model="form.status" placeholder="是否显示">
            <el-option :value="0" label="不显示" />
            <el-option :value="1" label="显示" />
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
    <el-table
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      style="width: 100%"
    >
      <el-table-column label="角色ID" min-width="180" prop="id" />
      <el-table-column label="角色名称" min-width="180" prop="name" />
      <el-table-column label="操作" max-width="300">
        <template slot-scope="props">
          <el-button icon="el-icon-setting" type="text" @click="opdendrawer(props.row)">设置权限</el-button>
          <el-button
            icon="el-icon-connection"
            size="small"
            type="text"
            @click="copyAuthorityFunc(props.row)"
          >拷贝</el-button>
          <el-button icon="el-icon-edit" type="text" @click="editAuthority(props.row)">编辑</el-button>
          <el-button icon="el-icon-delete" type="text" @click="deleteAuth(props.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer v-if="drawer" :visible.sync="drawer" :with-header="false" size="40%" title="角色配置">
      <!-- <el-tabs :before-leave="autoEnter" class="role-box" type="border-card"> -->
      <el-tabs class="role-box" type="border-card">
        <el-tab-pane label="角色菜单">
          <Menus ref="menus" :row="activeRow" @changeRow="changeRow" />
        </el-tab-pane>
        <el-tab-pane label="角色api">
          <Apis ref="apis" :row="activeRow" @success="success" @changeRow="changeRow" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script>
import { getRoleList, editRole, editRoleStatus } from '@/api/authority'
import Apis from './components/apis.vue'
import Menus from './components/menus.vue'
import _ from 'lodash'
export default {
  name: 'AuthorityRole',
  components: { Apis, Menus },
  data() {
    return {
      dialogFormVisible: false,
      loading: true,
      dialogTitle: '新增角色',
      AuthorityOption: [],
      tableData: [],
      form: {
        name: '',
        remark: '',
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      drawer: false,
      activeRow: {},
      page: 1,
      size: 10,
      list: [
        {
          id: 1,
          name: '22'
        }
      ]
    }
  },
  created() {
    this.getRoleList()
  },

  methods: {
    success() {
      this.getRoleList()
    },
    async getRoleList() {
      const params = {
        filters: {},
        sorts: {},
        type: 0,
        page: this.page,
        size: this.size
      }
      const res = await getRoleList(params)
      if (res.code === 0) {
        this.tableData = res.data.list
        this.loading = false
      }
    },
    initForm() {
      this.$refs['authorityForm'].resetFields()
      this.form = {
        name: '',
        remark: '',
        status: 1
      }
      this.dialogFormVisible = false
    },
    setOptions() {
      this.AuthorityOption = []
      this.setAuthorityOptions(this.tableData, this.AuthorityOption)
    },
    setAuthorityOptions(AuthorityData, optionsData) {
      if (this.form.id) {
        this.form.id = String(this.form.id)
      }
      AuthorityData?.forEach(item => {
        if (item.children?.length) {
          const option = {
            id: item.id,
            name: item.name,
            children: []
          }
          this.setAuthorityOptions(item.children, option.children)
          optionsData.push(option)
        } else {
          const option = {
            id: item.id,
            name: item.name
          }
          optionsData.push(option)
        }
      })
    },
    // 增加角色
    addAuthority() {
      this.dialogTitle = '新增角色'
      this.dialogType = 'add'
      this.activeRow = {}
      this.setOptions()
      this.dialogFormVisible = true
    },
    // 提交
    enterDialog() {
      this.$refs['authorityForm'].validate(async valid => {
        if (valid) {
          const params = { ...this.activeRow.value, ...this.form }
          const res = await editRole(params)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: this.dialogType === 'edit' ? '编辑成功' : '添加成功!'
            })
            this.getRoleList()
            this.initForm()
          }
        }
      })
    },
    closeDialog() {
      this.initForm()
      this.dialogFormVisible = false
      this.apiDialogFlag = false
    },
    // 设置权限
    // autoEnter(activeName, oldActiveName) {
    //   const paneArr = [this.$refs.menus, this.$refs.apis]
    //   if (oldActiveName) {
    //     if (paneArr[oldActiveName].needConfirm) {
    //       paneArr[oldActiveName].relation()
    //       paneArr[oldActiveName].needConfirm = false
    //     }
    //   }
    // },
    changeRow(key, value) {
      this.activeRow[key] = value
    },
    // 编辑角色
    editAuthority(row) {
      this.dialogTitle = '编辑角色'
      this.dialogType = 'edit'
      this.form = { ...row }
      this.activeRow = row
      this.setOptions()
      this.dialogFormVisible = true
    },
    // 拷贝角色
    copyAuthorityFunc(row) {
      this.dialogTitle = '拷贝角色'
      this.dialogType = 'copy'
      for (const k in this.form) {
        this.form[k] = row[k]
      }
      this.activeRow = _.omit(row, ['id'])
      this.setOptions()
      this.dialogFormVisible = true
    },
    // 删除角色
    deleteAuth(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await editRoleStatus({ id: row.id, status: 2 })
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.tableData.length === 1 && this.page > 1) {
              this.page--
            }
            this.getRoleList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    opdendrawer(row) {
      this.drawer = true
      this.activeRow = row
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
