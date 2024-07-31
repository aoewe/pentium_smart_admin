<template>
  <div class="tree">
    <div class="clearflex">
      <el-button class="fl-right" type="primary" @click="relation">确 定</el-button>
    </div>
    <el-tree
      ref="apiTree"
      :data="apiTreeData"
      :default-checked-keys="apiTreeIds"
      :props="apiDefaultProps"
      default-expand-all
      highlight-current
      node-key="id"
      show-checkbox
      @check="nodeChange"
    />
  </div>
</template>
<script>
import { getApis, editRole } from '@/api/authority'
export default {
  name: 'Apis',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    row: { type: Object }
  },
  data() {
    return {
      apiTreeData: [],
      apiTreeIds: [],
      needConfirm: false,
      activeUserId: '',
      apiDefaultProps: {
        children: 'children',
        label: 'description'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const apiRes = await getApis()
      const apis = apiRes?.data || []
      this.apiTreeData = this.buildApiTree(apis)
      this.activeUserId = this.row.authorityId
      this.apiTreeIds = this.row.apis
    },
    nodeChange() {
      this.needConfirm = true
    },
    // 创建api树方法
    buildApiTree(apis) {
      const apiTree = []
      apis?.forEach((item) => {
        const treeNode = {
          id: item.id,
          description: item.name
        }
        apiTree.push(treeNode)
      })

      return apiTree
    },

    // 关联关系确定
    async relation() {
      const checkArr = this.$refs.apiTree.getCheckedNodes(true)
      const res = await editRole({
        ...this.row,
        apis: checkArr?.map((item) => item.id)
      })
      if (res.code === 0) {
        this.$message({ type: 'success', message: 'api设置成功' })
        this.$emit('success', true)
      }
    }
  }
}
</script>
<style lang="scss">
.tree{
  .clearflex{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .el-tree{
    font-size: 15px;
    height: 80vh;
    overflow-y: scroll;
  }
}
</style>
