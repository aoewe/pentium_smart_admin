<template>
  <div
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    class="goods-details main-box"
  >
    <p class="title">基本信息</p>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      class="form"
    >
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="产品名称" prop="product_name">
            <el-input
              v-model="form.product_name"
              placeholder="请输入产品名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品分类" prop="category_id">
            <el-cascader v-model="form.category_id" :options="categoryList" :props="{checkStrictly: true,label: 'title'}"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="产品排序" prop="sort">
            <el-input
              type="number"
              class="sort"
              v-model="form.sort"
              placeholder="请输入产品排序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上下架" prop="publish_status">
            <el-radio-group v-model="form.publish_status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- sku -->
      <el-form-item label="产品SKU">
        <sku-form ref="skuForm" :specification.sync="specification" :productSkus.sync="productSkus" />
      </el-form-item>

      <el-form-item label="产品描述" prop="descript">
        <span>对产品的具体描述，字数控制在200字内</span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 10}"
          v-model="form.descript"
          placeholder="请输入产品描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="产品简介" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 10}"
          v-model="form.content"
          placeholder="请输入产品简介"
        ></el-input>
      </el-form-item>

      <el-form-item label="产品主图" prop="main_pic">
        <span>图片大小建议600x600，1:1比例的图片，不满则自动拉伸铺满</span>
        <el-upload
          :class="form.main_pic.length?'hide':''"
          class="upload-list-box"
          list-type="picture-card"
          action="#"
          :auto-upload="false"
          :file-list="form.main_pic"
          :on-change="file => changeImg(file, 'main')"
          :on-remove="file => removeImg(file, 'main')"
        >
          <i class="el-icon-picture-outline avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="产品Banner图" prop="banner_pic">
        <span>建议尺寸750x440，图片体积不超过在1M/张，可批量上传</span>
        <el-upload
          class="upload-list-box"
          action="#"
          :multiple="true"
          :auto-upload="false"
          list-type="picture-card"
          :file-list="form.banner_pic"
          :on-remove="file => removeImg(file, 'banner')"
          :on-change="file => changeImg(file, 'banner')"
        >
        <i class="el-icon-picture-outline avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="产品详情图" prop="details_pic">
        <span>建议尺寸750x440，图片体积不超过在1M/张，可批量上传</span>
        <el-upload
          class="upload-list-box"
          action="#"
          :auto-upload="false"
          list-type="picture-card"
          :multiple="true"
          :file-list="form.details_pic"
          :on-remove="file => removeImg(file, 'details_pic')"
          :on-change="file => changeImg(file, 'details_pic')"
        >
          <i class="el-icon-picture-outline avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <!-- 产品参数 -->
      <el-form-item label="产品参数">
        <el-form :model="parameter" label-width="80px" ref="parameter" v-if="parameter.list.length">
          <el-row v-for="(item,index) in parameter.list" :key="index">
            <el-col :span="6" style="margin-bottom:25px;">
              <el-form-item label="参数名" :prop="'list.'+index+'.name'" :rules="{required: true, message: '请输入参数名', trigger: 'blur'}">
                <el-input placeholder="请输入参数名" v-model="item.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="参数值" :prop="'list.'+index+'.value'" :rules="{required: true, message: '请输入参数值', trigger: 'blur'}">
                <el-input placeholder="请输入参数值" v-model="item.value" />
              </el-form-item>
            </el-col>
            <el-button icon="el-icon-delete" @click="delParameter(index)"></el-button>
          </el-row>
        </el-form>
        <el-col :span="12">
          <el-button style="width:102px;" @click="addParameter" icon="el-icon-plus"></el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="resetForm('form')" :disabled="loading">重置</el-button>
      <el-button @click="submitForm('form')" :loading="loading">提交</el-button>
    </div>
  </div>
</template>
<script>
import SkuForm from './components/SkuTable.vue'
import {getCategory,editProduct,getProductdetail} from '@/api/goods'
import {uploadImgs} from '@/api/public'
import {compressAccurately} from '@/utils'
import {param2Data} from '@/utils/skuparams'
export default {
  name: 'GoodsDetails',
  components: {SkuForm},
  data() {
    return {
      loading: false,
      loadingText:'加载中',
      categoryList:[],//分类列表
      // 产品表单
      form: {
        product_name: '', //产品名称
        sort: '', //排序
        one_category_id: '',
        two_category_id: '',
        // three_category_id: '',
        descript: '', //描述
        content: '', //简介
        publish_status: '', //上下架
        category_id: [], //产品分类
        skuList: [], //sku
        main_pic: [], //主图
        banner_pic: [], //产品Banner图
        details_pic: [], //产品详情图
        parameter:[] //商品参数
      },
      rules: {
        product_name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择产品分类', trigger: 'blur' }
        ],
        publish_status: [
          { required: true, message: '请选择上下架', trigger: 'blur' }
        ],
        main_pic: [{ required: true, message: '请上传主图', trigger: 'blur' }],
        banner_pic: [
          { required: true, message: '请上传产品Banner图', trigger: 'blur' }
        ],
        details_pic: [
          { required: true, message: '请上传产品详情图', trigger: 'blur' }
        ]
      },
      // sku数据
      productSkus:[],
      specification:[],
      // 参数数据
      parameter:{list:[]},
    }
  },
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        this.initProductInfo()
        if(value.product_id){
          this.loading = true
          this.getProductdetail(value.product_id)
        }
      }
    }
  },
  computed:{
    product_id(){return this.$route.query.product_id}
  },
  created() {
    this.getCategory()
  },
  methods: {
    initProductInfo(){
      this.loadingText='加载中'
      this.parameter = {list:[]}
      this.form = {
        product_name: '', //产品名称
        sort: '', //排序
        one_category_id: '',
        two_category_id: '',
        // three_category_id: '',
        descript: '', //描述
        content: '', //简介
        publish_status: '', //上下架
        category_id: [], //产品分类
        skuList: [], //sku
        main_pic: [], //主图
        banner_pic: [], //产品Banner图
        details_pic: [] //产品详情图
      }
      this.productSkus=[],
      this.specification=[]
    },
    async getProductdetail(id){
      const {code,data} = await getProductdetail({id})
      if(code===0){
        const {specification,productSkus} = param2Data(data.skuList)
        this.specification = specification
        this.productSkus = productSkus
        let details_pic=[]
        let banner_pic=[]
        data.details_pic.forEach(i=>{
          details_pic.push({name:'details',url:i})
        })
        data.banner_pic.forEach(i=>{
          banner_pic.push({name:'banner',url:i})
        })
        this.parameter.list = data.parameter
        this.form = {
          id:data.id,
          product_name: data.product_name,
          sort: data.sort,
          descript: data.descript,
          content: data.content,
          publish_status: data.publish_status,
          category_id: [data.one_category_id,data.two_category_id],
          skuList: [],
          main_pic: [{name:'main',url:data.main_pic}],
          banner_pic,
          details_pic,
          parameter:[]
        }
        this.loading = false
      }
    },
    async getCategory(){
      const {code,data} = await getCategory()
      if(code===0){
        data.forEach((i,j)=>{
          if(!i.children) data.splice(j,1)
        })
        this.categoryList = data
      }
    },
    addParameter(){
      this.parameter.list.push({name:'',value:''})
    },
    delParameter(index){
      this.parameter.list.splice(index,1)
    },
    // 重置表单
    resetForm() {
      this.$refs['form'].resetFields()
      this.initProductInfo()
    },
    // 提交
    submitForm() {
      const skuList = JSON.parse(JSON.stringify(this.$refs['skuForm'].data))
      const key = ['current_cnt','goods_code','goods_name','integral','main_pic','price','product_sku_id','properties','publish_status']
      skuList.forEach(i=>{
        i.properties.forEach(i=>{
          i.k_id && delete i.k_id
          i.v_id && delete i.v_id
        })
        for(const k in i){
          if(key.indexOf(k)===-1 || i[k]==null){
            delete i[k]
          }
        }
      })
      this.submit(skuList)
    },
    submit(skuList){
      this.$refs['parameter']?this.$refs['parameter'].validate(value=>{
        if(value){
          this.form.parameter=this.parameter.list
          this.onOk(skuList)
        }
      }):this.onOk(skuList)
    },
    onOk(skuList){
      this.$refs['form'].validate(async valeu=>{
        if(valeu){
          this.loadingText = '提交中'
          this.loading = true
          const imgData = await this.uploadFun()
          let params = JSON.parse(JSON.stringify(this.form))
          params.one_category_id=params.category_id[0]
          params.two_category_id=params.category_id[1]
          params.main_pic = imgData.main_pic
          params.banner_pic = imgData.banner_pic
          params.details_pic = imgData.details_pic
          params.skuList = skuList
          // params.skuList.forEach(i=>{
          //   for(let k in i){
          //     if(k==='price' && params.one_category_id===1){
          //       i["price"] = 'integral'
          //     }
          //   }
          // })
          if(params.parameter && !params.parameter.length)delete params.parameter
          delete params.category_id
          const {code} = await editProduct(params)
          if(code===0){
            this.$message({
              message:params.id?'编辑成功':'新增成功',
              type:'success'
            })
            let timer = setTimeout(()=>{
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.go(-1)
              clearTimeout(timer)
            },200)
          }else{
            this.loading = false
          }
        }
      })
    },
    // upload
    changeImg(file, type) {
      return new Promise(async (resolve, reject) => {
        if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') return this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
        switch (type) {
          case 'main':
            this.form.main_pic = [{name:type,url:URL.createObjectURL(file.raw),raw:file.raw}]
            break;
        
          case 'banner':
            let item = {}
            item.name = file.name
            item.url = URL.createObjectURL(file.raw)
            item.raw = file.raw
            this.form.banner_pic.push(item)
            break;

          case 'details_pic':
            // if(file.size/1024 /1024 > 1){
            //   this.$notify({title:'提示',message: '当前图片大小大于1M，请压缩上传', type: 'warning', duration: 2000})
            //   return reject(false)
            // }else{
              let details_pic = {}
              details_pic.name = file.name
              details_pic.url = URL.createObjectURL(file.raw)
              details_pic.raw = await compressAccurately(file.raw,500)
              this.form.details_pic.push(details_pic)
            // }
            break;
        
          default:
            break;
        }
        resolve(true)
      })
    },
    removeImg(file, type){
      switch (type) {
        case 'main':
          this.form.main_pic = []
          break;
        case 'banner':
          this.form.banner_pic.forEach((j,k)=>{
            if(j.uid===file.uid) this.form.banner_pic.splice(k,1)
          })
          break;
        case 'details_pic':
          this.form.details_pic.forEach((j,k)=>{
            if(j.uid===file.uid) this.form.details_pic.splice(k,1)
          })
          break;
        default:
          break;
      }
    },
    // 图片上传
    async uploadFun(){
      const {banner_pic,main_pic,details_pic} = this.form
      let data = {
        banner_pic:[],
        details_pic:[],
        main_pic:[]
      }
      // 主图
      if(main_pic[0].raw){
        const res = await compressAccurately(main_pic[0].raw,600)
        const main = new FormData()
        main.append('file[]', res)
        main.append('path_name', `adminImg/default`)
        const m = await uploadImgs(main)
        if(m.code===0){ 
          data.main_pic=m.data.url
        }else{
          this.loading = false
        }
      }else{
        data.main_pic=[main_pic[0].url]
      }
      // banner
      const bannerData = await this.imgFn(banner_pic)
      if(bannerData.num>0){
        const b = await uploadImgs(bannerData.formData)
        if(b.code===0) {
          bannerData.list=[...b.data.url]
        }else{
          this.loading = false
        }
      }
      data.banner_pic = bannerData.list
      // 详情
      const detailsData = await this.imgFn(details_pic)
      if(detailsData.num>0){
        const b = await uploadImgs(detailsData.formData)
        if(b.code===0){
          detailsData.list=[...b.data.url]
        }else{
          this.loading = false
        }
      }
      data.details_pic = detailsData.list
      return data
    },
    imgFn(row){
      return new Promise((resolve,reject)=>{
        const formData = new FormData()
        let num = 0
        let list = []
        row.forEach(async i=>{
          if(i.raw){
            num++
            const res = await compressAccurately(i.raw,500)
            // var reader = new FileReader()
            // reader.onload = function (event) {
            //   var txt = event.target.result
            //   var img = document.createElement("img")
            //   img.src = txt
            //   img.onload = async function () {
            //     if(img.height>1000){
            //       formData.append('file[]',i.raw)
            //     }else{
                  formData.append('file[]',res)
            //     }
            //   }
            // }
            // reader.readAsDataURL(i.raw)
          }else{
            list.push(i.url)
          }
        })
        formData.append('path_name',`adminImg/default`)
        const data = {formData,num,list}
        resolve(data)
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.goods-details {
  padding: 0 32px 10px;
  margin-bottom: 88px;
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    margin: 0;
    padding: 30px 0;
    font-size: 20px;
    border-bottom: 2px solid #f3f5f7;
  }
  .form {
    width: 90%;
    margin-top: 30px;
    span {
      color: rgb(230, 162, 60);
    }
    .el-input,
    .el-cascader {
      width: 100%;
    }
    .sku {
      display: flex;
      margin-bottom: 10px;
      .el-button{
        height: 40px;
      }
      .ok {
        color: #ffffff;
        background-color: #3954b3;
        margin-left: 30px;
      }
      .el-input {
        width: 252px;
        height: 40px;
      }
      .el-image{
        width: 100px;
      }
      .el-input + .el-input {
        margin-left: 10px;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 76px;
    z-index: 1999;
    line-height: 76px;
    text-align: center;
    background-color: #ffffff;
    .el-button {
      width: 98px;
    }
    .el-button:last-child {
      color: #ffffff;
      background-color: #3954b3;
    }
  }
}
</style>
<style lang="scss">
.goods-details {
  .el-loading-mask{
    z-index: 4 !important;
  }
  .el-loading-spinner{
    position: fixed !important;
    margin-left: 6%;
  }
  .upload-box-flex{
    display: flex;
    justify-content: center;
  }
  .not-content {
    .sku-list{
      display: none;
    }
  }
  .el-table__append-wrapper{
    .el-table__body-wrapper{
      display: none;
    }
  }
  .el-input__inner{
    padding-right: 0;
  }
  .el-upload{
    width: 102px;
    height: 102px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-uploader-icon{
    font-size: 25px;
    color: #999;
  }
  .el-upload-list--picture-card{
    .el-upload-list__item{
      width: 102px;
      height: 102px;
    }
  }

  .el-table__append-wrapper{
    .upload-box{
      width: 80px !important;
      height: 80px !important;
    }
    th{
      padding: 0;
      color: #333;
    }
    .el-switch {
      .el-switch__label--right span {
        margin-left: -11px;
      }
      .el-switch__label--left span {
        margin-left: 10px;
      }
    }
  }
  .upload-list-box{
    display: flex;
    .el-upload-list{
      display: flex;
      flex-wrap: wrap;
    }
    .avatar-uploader-icon{
      padding: 38px;
    }
    .el-upload--picture-card{
      background-color: #ffffff;
    }
  }
  .el-switch {
    .el-switch__label--right span {
      margin-left: -14px;
    }
    .el-switch__label--left span {
      margin-left: 10px;
    }
  }
  .hide {
    .el-upload{
      display: none;
    }
  }
}
</style>