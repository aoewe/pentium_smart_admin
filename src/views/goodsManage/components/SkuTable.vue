<template>
  <div class="sku-table">
    <div class="sku_group" v-for="(spec, index) in specification" :key="spec.id">
      <div class="spec_title">
        <span class="label">规格名：</span>
        <el-input size="small" class="input" placeholder="请输入规格名" v-model="spec.value"  style="width: 120px;"></el-input>
      </div>
      <div class="group_container">
        <span>规格值：</span>
        <el-popover placement="bottom" trigger="click" v-for="(option, option_index) in spec.leaf" :key="option_index">
          <el-input size="small" v-model="option.value" style="width: 110px;"></el-input>
          <div class="sku_item" slot="reference">
            <span class="remove" @click="delOption(index, option_index)">x</span>
            <span class="text">{{option.value}}</span>
          </div>
        </el-popover>
        <el-input
          class="input"
          size="small"
          v-model="addValues[index]" 
          placeholder="多个产品属性以空格隔开"
          @keyup.native.enter="addOption(index)"
          @blur="addOption(index)">
          <el-button slot="append" icon="el-icon-check" type="primary" @click="addOption(index)"></el-button>
        </el-input>
        <!-- <el-button @click="delSepc(index)" icon="el-icon-delete" style="color:#ED213A;margin-left: 5px;" type="text">删除</el-button> -->
      </div>
    </div>
    <div class="spec_title">
      <el-button :disabled="disabled" @click="addSpec" style="margin-bottom: 10px;">添加</el-button>
    </div>
    <div class="sku_container">
      <el-table :data="data" border style="width: 100%" :span-method="objectSpanMethod">
        <template v-if="specificationFilter.length">
          <el-table-column min-width="150" fixed="left" v-for="(item,index) in specificationFilter" :key="item.id" :label="item.value">
            <template slot-scope="scope">{{scope.row.properties[index].value}}</template>
          </el-table-column>
        </template>
        <el-table-column label="主图" min-width="150">
          <template slot-scope="scope">
            <el-upload
              :show-file-list="false"
              :action="action"
              name="file[]"
              :before-upload="beforeUpload"
              :on-success="res => imageUpload(res, scope.row)"
              :disabled="!scope.row.publish_status"
              :class="scope.row.publish_status?'':'not-allowed'"
            >
              <el-button
                size="small"
                icon="el-icon-upload2"
                :disabled="!scope.row.publish_status"
                v-if="!scope.row.main_pic[0]"
                >上传图片</el-button
              >
              <el-image
                v-else
                style="width: 80px; height: 50px"
                :src="scope.row.main_pic[0]"
                fit="scale-down"
              />
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="产品编号" min-width="150">
          <template slot-scope="scope">
            <el-input
              size="small"
              type="text"
              :disabled="!scope.row.publish_status || !!scope.row.product_sku_id"
              v-model="scope.row.goods_code"
              placeholder="输入产品编码"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" min-width="150">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.number="scope.row.goods_name"
              placeholder="输入产品名称"
              :disabled="!scope.row.publish_status"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="150">
          <template slot-scope="scope">
            <el-input
              size="small"
              type="number"
              v-model.number="scope.row.price"
              placeholder="输入产品价格"
              :disabled="!scope.row.publish_status"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="积分" min-width="150">
          <template slot-scope="scope">
            <el-input
              size="small"
              type="number"
              v-model.number="scope.row.integral"
              placeholder="输入产品积分"
              :disabled="!scope.row.publish_status"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="150">
          <template slot-scope="scope">
            <el-input
              size="small"
              type="number"
              v-model.number="scope.row.current_cnt"
              placeholder="输入产品库存"
              :disabled="!scope.row.publish_status"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="上下架" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.publish_status"
              active-color="#3954B3"
              inactive-color="#666666"
              active-text="上架"
              inactive-text="下架"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { flatten } from '@/utils/sku'
import { diffArary,createUniqueString, uniqueArr,compressAccurately } from '@/utils'
export default {
  props: {
    specification: {
      type: Array,
      default() {return []}
    },
    productSkus: {
      type: Array,
      default() { return []}
  }},
  data (){
    return{
      addValues: [],
      data: [],
      action: `/api/backend/upload/uploadImg`
    }
  },
  computed: {
    // 合并单元规格
    skusList() {
      return flatten(this.specificationFilter).map(item => ({
        properties: item.properties,
        ids: item.properties.reduce(
          (total, prev, index) =>
            `${total}${prev.k_id}-${prev.v_id}${
              index === item.properties.length - 1 ? '' : '_'
            }`,
          '',
        )
      }))
    },
    disabled() {
      return (
        this.specification.length > 3 ||
        this.specification.some((item) => !item.value)
      )
    },

    // 过滤掉属性名和属性值为空的数据规格项目
    specificationFilter() {
      return this.specification.filter(
        (item) => item.value && item.leaf.length
      )
    }
  },
  watch: {
    skusList: {
      deep: true,
      immediate: true,
      handler(newSkus, oldSkus) {
        if (!newSkus.length) return (this.data = [])
        if (!oldSkus || !oldSkus.length) return this.initData(newSkus)
        if (newSkus.length === oldSkus.length) {
          // 当规格名和规格值数量未发生变化，更新 skus 即可
          return (this.data = newSkus.map((item, index) => ({
            ...this.data[index],
            ...item,
          })))
        }

        // 当规格名的数量发生了变化
        if (newSkus[0].properties.length !== oldSkus[0].properties.length)
          return this.initData(newSkus)

        const diffIds = this.diffIds(newSkus, oldSkus)
        if (newSkus.length > oldSkus.length) {
          // 当添加了规格值
          let data = []
          newSkus.forEach(item => {
            const sku = this.data.find(_item => _item.ids === item.ids)
            if (sku) {
              data.push(sku)
            } else {
              data.push({
                ...item,
                main_pic: [],
                product_sku_id: null,
                goods_code: '',
                current_cnt: '',
                price: '',
                integral: '',
                goods_name: '',
                publish_status: 1
              })
            }
          })
          this.data = data
        } else {
          // 当删除了规格值
          this.data = this.data.filter(_item => !diffIds.includes(_item.ids))
        }
      },
    }
  },
  methods: {
    // sku主图
    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        const isJPG = file.type === 'image/jpeg'
        const isPng = file.type === 'image/png'
        if (!isJPG && !isPng) {
          this.$message.warning('上传图片只能是 JPG 或者 PNG 格式!')
          return reject(false)
        }
        let compress = 600 // 假设图片限制不能大于1M
        let sizeOver = file.size / 300 > compress //文件大小 是否大于指定大小
        if (sizeOver && compress) {
          const res = await compressAccurately(file, sizeOver)
          file = res
        }
        resolve(true)
      })
    },
    imageUpload(res, data) {
      data.main_pic = res.data.url
    },
    // 两个数据的 ids 进行相差
    diffIds(skusList1, skusList2) {
      skusList1 = skusList1.map(item => item.ids)
      skusList2 = skusList2.map(item => item.ids)
      return diffArary(skusList1, skusList2)
    },
    flitterData(){
      let spanArr1 = [],spanArr2=[],spanArr3=[]
      let concat1 = 0,concat2=0,concat3=0
      this.data.forEach((item,index)=>{
        if(index === 0){
          spanArr1.push(1)
          spanArr2.push(1)
          spanArr3.push(1)
        }else{
          if(this.specification[0]?.leaf.length && item.properties[0].value === this.data[index - 1].properties[0].value){
            spanArr1[concat1] += 1
            spanArr1.push(0)
          }else{
            spanArr1.push(1)
            concat1 = index
          }
          if(this.specification[1]?.leaf.length && item.properties[1].value === this.data[index - 1].properties[1].value){
            spanArr2[concat2] += 1
            spanArr2.push(0)
          }else{
            spanArr2.push(1)
            concat2 = index
          }
          if(this.specification[2]?.leaf.length && item.properties[2].value === this.data[index - 1].properties[2].value){
            spanArr3[concat3] += 1
            spanArr3.push(0)
          }else{
            spanArr3.push(1)
            concat3 = index
          }
        }
      })
      return [
        spanArr1,
        spanArr2,
        spanArr3
      ]
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}){
      if(columnIndex <=this.specification.length-1 ) {
        if(columnIndex===3) return
        const _row = (this.flitterData()[columnIndex])[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 初始化数据
    initData(skusList) {
      if (this.productSkus && this.productSkus.length) {
        this.data = this.productSkus
        this.data.forEach(i=>{
          i.main_pic = [i.main_pic]
        })
        this.$emit('update:productSkus', [])
        return
      }
      this.data = skusList.map(item => ({
        ...item,
        main_pic: item.main_pic?[item.main_pic]:[],
        product_sku_id: null,
        goods_code: '',
        current_cnt: '',
        price: '',
        integral: '',
        goods_name: '',
        publish_status: 1
      }))
    },

    addSpec() {
      this.specification.push({
        id: createUniqueString() + "_id",
        value: "",
        leaf: [],
      });
    },

    delSepc(index) {
      this.specification.splice(index, 1);
    },

    addOption(index) {
      let str = this.addValues[index] || "";
      str = str.trim();
      if (!str) return;
      const oldArr = this.specification[index].leaf;
      const arr = str
        .split(/\s+/) // 使用空格分割成数组
        .filter((value) => !oldArr.some((option) => option.value === value)) // 过滤掉 oldArr 已存在的 value
        .map((value) => ({ id: createUniqueString() + "_id", value })); // 把 value 转成对象，id 设置为 null
      this.specification[index].leaf = uniqueArr([...oldArr, ...arr]);
      this.$set(this.addValues, index, "");
    },

    delOption(spec_index, option_index) {
      this.specification[spec_index].leaf.splice(option_index, 1);
    }
  }
}
</script>
<style lang="scss">
.sku-table{
  .el-table{
    .cell{
      text-align: center;
    }
    th{
      padding: 0;
    }
  }
  .sku_container{
    margin-bottom: 30px;
    font-size: 12px;
    color: #666;
  }
  .remove{
    display: none;
    position: absolute;
    z-index: 2;
    width: 15px;
    height: 15px;
    font-size: 12px;
    line-height: 15px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    background: rgba($color: #ED213A, $alpha: 0.8);
    border-radius: 50%;
  }
  .sku_group{
    margin-bottom: 10px;
    display: flex;
    color: #666;
    &:hover{
      .spec_title .remove{
        display: block
      }
    }
  }
  .spec_title{
    margin-right: 10px;
    position: relative;
    font-weight: 400;
    .input{
      width: 200px;
    }
    .remove{
      top: 12px;
      right: 10px;
    }
  }
  .group_container{
    display: flex;
    align-items: center;
    .input{
      width: 250px;
    }
    .sku_item{
      background-color: rgba($color: #3954B3, $alpha: .1);
      height: 31px;
      color: #3954B3;
      display: inline-block;
      margin-right: 10px;
      vertical-align: middle;
      text-align: center;
      position: relative;
      border-radius: 3px;
      cursor: pointer;
      &:hover{
        .remove{
          display: block;
        }
      }
      .remove{
        top: -6px;
        right: -5px;
      }
      .text{
        display: block;
        line-height: initial;
        width: 74px;
        height: 31px;
        line-height: 31px;
        margin: 0 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .flex{
    display: flex;
  }
  .el-input__inner{
    padding-right: 0;
  }
  .not-allowed{
    .el-upload{
      cursor: not-allowed;
    }
  }
}
</style>
