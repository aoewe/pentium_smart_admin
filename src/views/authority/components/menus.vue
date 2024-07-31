<template>
  <div class="tree">
    <div class="clearflex">
      <el-button class="fl-right" type="primary" @click="relation">确 定</el-button>
    </div>
    <el-tree
      ref="menuTree"
      :data="menuTreeData"
      :default-checked-keys="menuTreeIds"
      :props="menuDefaultProps"
      check-strictly
      default-expand-all
      highlight-current
      node-key="id"
      show-checkbox
      @check="nodeChange"
    >
      <template #default="{ node }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import { getAllMenus, editRole } from '@/api/authority'

export default {
  name: 'Menus',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    row: { type: Object }
  },
  data() {
    return {
      menuTreeIds: [],
      menuTreeData: [],
      needConfirm: false,
      menuDefaultProps: {
        children: 'children',
        label: 'meta_title'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 获取所有菜单树
    async init() {
      const res = await getAllMenus()
      this.menuTreeData = res?.data
      this.menuTreeIds = this.row.menus
    },
    nodeChange() {
      this.needConfirm = true
    },
    // 关联树 确认方法
    async relation() {
      const checkArr = this.$refs.menuTree.getCheckedNodes(false, true)
      const res = await editRole({
        ...this.row,
        menus: checkArr?.map((item) => item.id)
      })
      if (res.code === 0) {
        this.$emit('changeRow', 'menus', checkArr?.map((item) => item.id))
        this.$message({
          type: 'success',
          message: '菜单设置成功!'
        })
      }
    }
  }
}
</script>

