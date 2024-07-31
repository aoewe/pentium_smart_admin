<template>
  <div v-loading="loading" class="menu main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <el-button class="add" icon="el-icon-plus" type="primary" @click="addMenu('0')">新增一级菜单</el-button>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="950px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :title="dialogTitle"
    >
      <el-form
        v-if="dialogFormVisible"
        ref="menuForm"
        :inline="true"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="85px"
      >
        <el-form-item label="路由Name" prop="path" style="width: 30%">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="唯一英文字符串"
          />
        </el-form-item>
        <el-form-item prop="path" style="width: 30%">
          <template #label>
            <div style="display: inline-flex">
              路由Path
              <!-- <el-checkbox v-model="checkFlag" style="float: right; margin-left: 20px">添加参数</el-checkbox> -->
            </div>
          </template>

          <!-- <el-input
            v-model="form.path"
            :disabled="!checkFlag"
            autocomplete="off"
            placeholder="建议只在后方拼接参数"
          /> -->
          <el-input
            v-model="form.path"
            autocomplete="off"
            placeholder="建议只在后方拼接参数"
          />
        </el-form-item>
        <el-form-item label="是否显示" style="width: 30%">
          <el-select v-model="form.is_hidden" placeholder="是否显示">
            <el-option :value="0" label="否" />
            <el-option :value="1" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label="父节点ID" style="width: 30%">
          <el-cascader
            v-model="form.parent_id"
            style="width: 100%"
            :disabled="!isEdit"
            :options="menuOption"
            :props="{
              checkStrictly: true,
              label: 'title',
              value: 'id',
              disabled: 'disabled',
              emitPath: false
            }"
            :show-all-levels="false"
            filterable
          />
        </el-form-item>
        <el-form-item label="文件路径" prop="component" style="width: 60%">
          <el-input v-model="form.component" autocomplete="off" />
          <!-- <span style="font-size: 12px; margin-right: 12px">如果菜单包含子菜单，请创建router-view二级路由页面或者</span>
          <el-button style="margin-top:5px" @click="form.component = 'view/'">点我设置</el-button> -->
        </el-form-item>
        <el-form-item label="展示名称" prop="meta_title" style="width: 30%">
          <el-input v-model="form.meta_title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图标" prop="meta_icon" style="width: 30%">
          <el-input v-model="form.meta_icon" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序标记" prop="sort" style="width: 30%">
          <el-input v-model.number="form.sort" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="KeepAlive"
          prop="meta_keep_alive"
          style="width: 30%"
        >
          <el-select
            v-model="form.meta_keep_alive"
            style="width: 100%"
            placeholder="是否keepAlive缓存页面"
          >
            <el-option :value="0" label="否" />
            <el-option :value="1" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label="closeTab" prop="meta_close_tab" style="width: 30%">
          <el-select
            v-model="form.meta_close_tab"
            style="width: 100%"
            placeholder="是否自动关闭tab"
          >
            <el-option :value="0" label="否" />
            <el-option :value="1" label="是" />
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" icon="edit" @click="addParameter(form)">新增菜单参数</el-button>
        <el-table :data="form.parameters" style="width: 100%">
          <el-table-column
            align="left"
            prop="type"
            label="参数类型"
            width="180"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" placeholder="请选择">
                <el-option key="query" value="query" label="query" />
                <el-option key="params" value="params" label="params" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="key" label="参数key" width="180">
            <template slot-scope="scope">
              <div>
                <el-input v-model="scope.row.key" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="value" label="参数值">
            <template slot-scope="scope">
              <div>
                <el-input v-model="scope.row.value" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template slot-scope="scope">
              <div>
                <el-button type="danger" size="small" icon="delete" @click="deleteParameter(form.parameters, scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-table :data="tableData" height="calc(100vh - 200px)" row-key="id">
      <el-table-column label="ID" width="80" prop="id" />
      <el-table-column
        width="150"
        label="路由Name"
        show-overflow-tooltip
        prop="name"
      />
      <el-table-column
        min-width="150"
        label="路由Path"
        show-overflow-tooltip
        prop="path"
      />
      <el-table-column min-width="120" label="是否显示" prop="is_hidden">
        <template slot-scope="scope">
          <span>{{ scope.row.is_hidden ? '显示' : '隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父节点" min-width="100" prop="parent_id" />
      <el-table-column label="排序" min-width="100" prop="sort" />
      <el-table-column label="文件路径" min-width="150" prop="component" />
      <el-table-column label="展示名称" min-width="120" prop="authorityName">
        <template slot-scope="scope">
          <span>{{ scope.row.meta_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" min-width="120" prop="authorityName">
        <template slot-scope="scope">
          <div v-if="scope.row.meta_icon" class="icon-column">
            <el-icon>
              <component :is="scope.row.meta_icon" />
            </el-icon>
            <span>{{ scope.row.meta_icon }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-plus" @click="addMenu(scope.row.id)">添加子菜单</el-button>
          <el-button type="text" icon="el-icon-edit" @click="setEditMenu(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteMenu(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { editMenu, getMenus, editMenuStatus } from '@/api/authority'
export default {
  name: 'AuthorityMenu',
  data() {
    return {
      dialogFormVisible: false,
      loading: true,
      checkFlag: false,
      isEdit: false,
      dialogTitle: '新增菜单',
      tableData: [],
      menuOption: [
        {
          id: 0,
          title: '根菜单'
        }
      ],
      form: {
        // id: 0,
        path: '',
        name: '',
        is_hidden: 0,
        parent_id: '',
        component: '',
        meta_title: '',
        meta_icon: '',
        meta_default_menu: 0,
        meta_close_tab: 0,
        meta_keep_alive: 0,
        parameters: []
      },
      rules: {
        path: [{ required: true, message: '请输入菜单name', trigger: 'blur' }],
        component: [{ required: true, message: '请输入文件路径', trigger: 'blur' }],
        meta_title: [{ required: true, message: '请输入菜单展示名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getMenus()
  },

  methods: {
    // 菜单列表
    async getMenus() {
      const res = await getMenus({ sorts: {}})
      if (res.code === 0) {
        this.tableData = res.data
        this.loading = false
      }
    },
    handleClose() {
      this.initForm()
    },
    closeDialog() {
      this.initForm()
      this.dialogFormVisible = false
    },
    // 提交
    enterDialog() {
      this.$refs['menuForm'].validate(async(valid) => {
        if (valid) {
          this.form.type = 0// 菜单
          const res = await editMenu(this.form)
          const { code, msg } = res
          if (code === 0) {
            this.$message({
              type: 'success',
              message: this.isEdit ? '编辑成功' : '添加成功!'
            })
            this.getMenus()
            this.initForm()
          } else {
            this.$message({
              type: 'success',
              message: msg
            })
          }
        }
      })
    },
    setOptions() {
      this.menuOption = [
        {
          id: 0,
          title: '根目录'
        }
      ]
      this.setMenuOptions(this.tableData, this.menuOption, false)
    },
    // 初始化表单
    initForm() {
      this.checkFlag = false
      this.dialogFormVisible = false
      this.$refs['menuForm'].resetFields()
      this.form = {
        // id: 0,
        path: '',
        name: '',
        is_hidden: 0,
        parent_id: '',
        component: '',
        meta_title: '',
        meta_icon: '',
        meta_default_menu: 0,
        meta_keep_alive: 0,
        meta_close_tab: 0,
        parameters: []
      }
    },
    // 新增参数
    addParameter(form) {
      if (!form.parameters) {
        this.form.parameters = []
      }
      this.form.parameters.push({
        type: 'query',
        key: '',
        value: ''
      })
    },
    // 删除参数
    deleteParameter(parameters, index) {
      parameters.splice(index, 1)
    },
    // 编辑菜单
    async setEditMenu(row) {
      this.dialogTitle = '编辑菜单'
      this.form = row
      this.isEdit = true
      this.setOptions()
      this.dialogFormVisible = true
    },
    // 新增菜单
    addMenu(id) {
      this.dialogTitle = '新增菜单'
      this.form.parent_id = String(id)
      this.isEdit = false
      this.setOptions()
      this.dialogFormVisible = true
    },
    // 删除菜单
    deleteMenu(id) {
      this.$confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await editMenuStatus({ id, is_hidden: 2 })
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMenus()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    setMenuOptions(menuData, optionsData, disabled) {
      menuData &&
        menuData.forEach((item) => {
          if (item.children && item.children.length) {
            const option = {
              title: item.meta_title,
              id: item.id,
              disabled: disabled || item.id === this.form.id,
              children: []
            }
            this.setMenuOptions(
              item.children,
              option.children,
              disabled || item.id === this.form.id
            )
            optionsData.push(option)
          } else {
            const option = {
              title: item.meta_title,
              id: item.id,
              disabled: disabled || item.id === this.form.id
            }
            optionsData.push(option)
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu {
  .add {
    background-color: #3954b3;
    border: 0;
  }
}
</style>
<style lang="scss">
.menu {
  // .el-table{
  //   .cell{
  //     padding-left: 0;
  //   }
  // }
  .el-table__indent{
    padding-left: 0 !important;
  }
  .el-table__row--level-1{
    .cell:first-child{
      .el-table__indent{
        padding: 0 !important;
      }
    }
  }
  .el-dialog{
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .el-table {
    margin-top: 20px;
    th {
      background-color: rgba($color: #3954b3, $alpha: 0.1);
      color: #333333;
    }
  }
}
</style>
