<template>
  <div v-loading="loading" class="edit-view main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <div v-if="submitLoading" class="mask" v-loading="true" element-loading-text="提交中" element-loading-spinner="el-icon-loading"></div>
    <view-module :data="form" v-if="!loading" />
    <div class="edit" v-if="!loading">
      <el-form :list="form" ref="form" label-width="100px" class="demo-form">
        <el-form-item label="banner">
          <el-upload
            class="upload-list-box"
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :file-list="form.banner"
            :on-remove="file => removeImg(file, 'banner')"
            :on-change="file => changeImg(file, 'banner')"
          >
          <i class="el-icon-upload2 avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-row>
          <el-col :span="14">
            <el-form-item label="查看更多图片" label-width="115px">
              <el-upload
              :show-file-list="false"
              :action="action"
              name="file[]"
              :before-upload="beforeUpload"
              :on-success="res => imageUpload(res,form)"
            >
              <el-button
                size="small"
                icon="el-icon-upload2"
                v-if="!form.path"
                >上传图片</el-button
              >
              <el-image
                v-else
                style="width: 180px; height: 74px;display: flex;border: 1px solid #eee;"
                :src="form.path"
                fit="scale-down"
              />
            </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="背景颜色">
              <el-input type="color" v-model="form.bgColor"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="item,index in form.list" :key="index" class="model">
          <div v-if="index===0" class="item row">
            <el-form-item label="幻灯片标题">
              <el-upload
                :show-file-list="false"
                :action="action"
                name="file[]"
                :before-upload="beforeUpload"
                :on-success="res => imageUpload(res,item,1)"
              >
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  v-if="!item.title"
                  >上传图片</el-button
                >
                <el-image
                  v-else
                  style="width: 180px; height: 74px;display: flex;border: 1px solid #eee;"
                  :src="item.title"
                  fit="scale-down"
                />
              </el-upload>
            </el-form-item>
            <el-form-item label="幻灯片商品">
              <ul>
                <li class="item" v-for="row,rowIdex in item.products" :key="row.id">
                  <el-image class="p-img" :src="row.main_pic" />
                  <i class="el-icon-delete" @click="delProduct(rowIdex,'banner')"></i>
                </li>
                <li class="add"><i class="el-icon-upload2" @click="addProduct('banner')"></i></li>
              </ul>
            </el-form-item>
            <el-form-item label="幻灯片主题">
              <div class="flex">
                <el-input v-model="item.color[0]" type="color"><template slot="prepend">背景</template></el-input>
                <el-input v-model="item.color[2]" type="color"><template slot="prepend">按钮left</template></el-input>
                <el-input v-model="item.color[1]" type="color"><template slot="prepend">按钮right</template></el-input>
                <el-input v-model="item.color[3]" type="color"><template slot="prepend">标题字体</template></el-input>
                <el-input v-model="item.color[4]" type="color"><template slot="prepend">按钮字体</template></el-input>
              </div>
            </el-form-item>
          </div>
          <div v-if="index===1" class="item row">
            <el-form-item label="单品标题">
              <el-upload
                :show-file-list="false"
                :action="action"
                name="file[]"
                :before-upload="beforeUpload"
                :on-success="res => imageUpload(res,item,1)"
              >
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  v-if="!item.title"
                  >上传图片</el-button
                >
                <el-image
                  v-else
                  style="width: 180px; height: 74px;display: flex;border: 1px solid #eee;"
                  :src="item.title"
                  fit="scale-down"
                />
              </el-upload>
            </el-form-item>
            <el-form-item label="单品商品">
              <ul>
                <li class="item" v-for="row,rowIndex in item.products" :key="row.id">
                  <el-image class="p-img" :src="row.main_pic" />
                  <i class="el-icon-delete" @click="delProduct(rowIndex,'single')"></i>
                </li>
                <li class="add"><i class="el-icon-upload2" @click="addProduct('single')"></i></li>
              </ul>
            </el-form-item>
            <el-form-item label="单品主题">
              <div class="flex">
                <el-input v-model="item.color[0]" type="color"><template slot="prepend">单数背景</template></el-input>
                <el-input v-model="item.color[1]" type="color"><template slot="prepend">双数背景</template></el-input>
                <el-input v-model="item.color[3]" type="color"><template slot="prepend">按钮left</template></el-input>
                <el-input v-model="item.color[2]" type="color"><template slot="prepend">按钮right</template></el-input>
                <el-input v-model="item.color[4]" type="color"><template slot="prepend">标题字体</template></el-input>
                <el-input v-model="item.color[5]" type="color"><template slot="prepend">按钮字体</template></el-input>
              </div>
            </el-form-item>
          </div>
          <div v-if="index===2" class="item row">
            <el-form-item label="卡片标题">
              <el-upload
                :show-file-list="false"
                :action="action"
                name="file[]"
                :before-upload="beforeUpload"
                :on-success="res => imageUpload(res,item,1)"
              >
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  v-if="!item.title"
                  >上传图片</el-button
                >
                <el-image
                  v-else
                  style="width: 180px; height: 74px;display: flex;border: 1px solid #eee;"
                  :src="item.title"
                  fit="scale-down"
                />
              </el-upload>
            </el-form-item>
            <el-form-item label="卡片商品">
              <ul>
                <li class="item" v-for="row,rowIndex in item.products" :key="row.id">
                  <el-image class="p-img" :src="row.main_pic" />
                  <i class="el-icon-delete" @click="delProduct(rowIndex,'card')"></i>
                </li>
                <li class="add"><i class="el-icon-upload2" @click="addProduct('card')"></i></li>
              </ul>
            </el-form-item>
            <el-form-item label="卡片主题">
              <div class="flex">
                <el-input v-model="item.color[0]" type="color"><template slot="prepend">边top</template></el-input>
                <el-input v-model="item.color[1]" type="color"><template slot="prepend">边bottom</template></el-input>
                <el-input v-model="item.color[2]" type="color"><template slot="prepend">背景</template></el-input>
                <el-input v-model="item.color[3]" type="color"><template slot="prepend">边框</template></el-input>
                <el-input v-model="item.color[4]" type="color"><template slot="prepend">按钮上</template></el-input>
                <el-input v-model="item.color[5]" type="color"><template slot="prepend">按钮中</template></el-input>
                <el-input v-model="item.color[6]" type="color"><template slot="prepend">按钮下</template></el-input>
                <el-input v-model="item.color[7]" type="color"><template slot="prepend">标题字体</template></el-input>
                <el-input v-model="item.color[8]" type="color"><template slot="prepend">按钮字体</template></el-input>
              </div>
            </el-form-item>
          </div>
          <div v-if="index>=3" class="item row">
            <el-button type="danger" class="el-icon-delete del" v-if="index>3" @click="delRow(index)"></el-button>
            <el-form-item label="推荐标题">
              <el-upload
                :show-file-list="false"
                :action="action"
                name="file[]"
                :before-upload="beforeUpload"
                :on-success="res => imageUpload(res,item,1)"
              >
                <el-button
                  size="small"
                  icon="el-icon-upload2"
                  v-if="!item.title"
                  >上传图片</el-button
                >
                <el-image
                  v-else
                  style="width: 180px; height: 74px;display: flex;border: 1px solid #eee;"
                  :src="item.title"
                  fit="scale-down"
                />
              </el-upload>
            </el-form-item>
            <el-form-item label="推荐商品">
              <ul>
                <li class="item" v-for="row,rowIndex in item.products" :key="row.id">
                  <el-image class="p-img" :src="row.main_pic" />
                  <i class="el-icon-delete" @click="delProduct(rowIndex,'recommend',index)"></i>
                </li>
                <li class="add"><i class="el-icon-upload2" @click="addProduct('recommend',index)"></i></li>
              </ul>
            </el-form-item>
            <el-form-item label="推荐主题">
              <div class="flex">
                <el-input v-model="item.color[0]" type="color"><template slot="prepend">背景</template></el-input>
                <el-input v-model="item.color[1]" type="color"><template slot="prepend">按钮left</template></el-input>
                <el-input v-model="item.color[2]" type="color"><template slot="prepend">按钮right</template></el-input>
                <el-input v-model="item.color[3]" type="color"><template slot="prepend">标题字体</template></el-input>
                <el-input v-model="item.color[4]" type="color"><template slot="prepend">按钮字体</template></el-input>
              </div>
            </el-form-item>
          </div>
        </div>
        <el-form-item>
          <div class="footer">
            <el-button type="primary" @click="submit('form')">提交</el-button>
            <el-button @click="addView()">新增</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="90%"
        :before-close="handleClose">
        <product-list :opt="1" @changeProduct="changeProduct" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ViewModule from './components/viewModule.vue'
import ProductList from './list.vue'
import {editProductPattern,getProductPattern} from '@/api/goods'
import {compressAccurately} from '@/utils'
import {uploadImgs} from '@/api/public'
export default {
  name: 'EditView',
  components:{ViewModule,ProductList},
  data() {
    return {
      action: `/api/backend/upload/uploadImg`,
      loading:true,
      dialogVisible:false,
      submitLoading:false,
      addIndex:3,
      addType:'',
      form: {
        bgColor: '',
        path:'',
        banner: [],
        list:[],
      }
    }
  },
  created() {
    this.getProductPattern()
  },
  methods: {
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
    imageUpload(res, data,type) {
      if(type){
        data.title = res.data.url[0]
      }else{
        data.path = res.data.url[0]
      }
    },
    delRow(index){
      this.form.list.splice(index,1)
    },
    addProduct(type,index){
      if(index) this.addIndex = index
      this.addType=type
      this.dialogVisible = true
    },
    async getProductPattern(){
      const {code,data} = await getProductPattern()
      if(code===0){
        data.banner=data.banner.map(i=>{return{url:i}})
        this.form = data
        this.loading = false
      }
    },
    delProduct(index,type,rowIndex){
      switch (type) {
        case 'banner':
          this.form.list[0].products.splice(index,1)
          break;
        case 'single':
          this.form.list[1].products.splice(index,1)
          break;
        case 'card':
          this.form.list[2].products.splice(index,1)
          break;
        case 'recommend':
          this.form.list[rowIndex].products.splice(index,1)
          break;
      
        default:
          break;
      }
    },
    handleClose(){
      this.dialogVisible=false
      this.show = false
    },
    changeProduct(data){
      switch (this.addType) {
        case 'banner':
          this.form.list[0].products.push(...data)
          break;
        case 'single':
          this.form.list[1].products.push(...data)
          break;
        case 'card':
          this.form.list[2].products.push(...data)
          break;
        case 'recommend':
          this.form.list[this.addIndex].products.push(...data)
          break;
      
        default:
          break;
      }
      this.dialogVisible=false
    },
    changeImg(file, type) {
      return new Promise(async (resolve, reject) => {
        if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png'){
          this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
          this.form.banner.splice(0,this.form.banner.length-1)
          return
        }
        switch (type) {
          case 'banner':
            let item = {}
            item.name = file.name
            item.url = URL.createObjectURL(file.raw)
            item.raw = file.raw
            this.form.banner.push(item)
            break;

          default:
            break;
        }
        resolve(true)
      })
    },
    removeImg(file, type){
      switch (type) {
        case 'banner':
          this.form.banner.forEach((j,k)=>{
            if(j.uid===file.uid) this.form.banner.splice(k,1)
          })
          break;
        default:
          break;
      }
    },
    handelImg(row){
      return new Promise((resolve,reject)=>{
        const formData = new FormData()
        let num = 0
        let list = []
        row.forEach(async i=>{
          if(i.raw){
            ++num
            const res = await compressAccurately(i.raw,500)
            formData.append('file[]',res)
          }else{
            list.push(i.url)
          }
        })
        formData.append('path_name',`adminImg/default`)
        const data = {formData,num,list}
        resolve(data)
      })
    },
    async submit(formName) {
      this.submitLoading = true
      let banner = []
      let params = JSON.parse(JSON.stringify(this.form))
      const bannerData = await this.handelImg(this.form.banner)
      if(bannerData.num>0){
        const b = await uploadImgs(bannerData.formData)
        if(b.code===0) {
          banner=[...b.data.url]
        }else{
          this.submitLoading = false
        }
      }
      params.banner.forEach(i=>{
        if(!i.raw)banner.push(i.url)
      })
      params.banner = banner
      const {code} = await editProductPattern(params)
      if(code===0){
        this.$message({
          message:'提交成功',
          type:'success'
        })
        this.submitLoading = false
      }
      this.$refs[formName].validate((valid) => {
        
      });
    },
    addView() {
      let item  = {
        color: ["#ffffff", "#ffffff", "#ffffff"],
        products: [],
        title: ""
      }
      this.form.list.push(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-view {
  display: grid;
  grid-template-columns: 580px 1fr;
  .edit {
    max-height: calc(100vh - 128px);
    overflow-y: scroll;
    border-left: 2px solid #eee;
    .row{
      padding-top: 15px;
    }
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        height: 80px;
        line-height: 80px;
        width: 80px;
        border-radius: 6px;
        overflow: hidden;
        margin: 0 10px 10px 0;
        position: relative;
        border: 1px dashed #eee;
        text-align: center;
      }
      .add{
        color: #8c939d;
        font-size: 28px;
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        &:hover{
          cursor: pointer;
          border-color: #409EFF;
        }
      }
      
      .item{
        &:hover{
          i{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            color:#fff;
            font-size: 20px;
            cursor: pointer;
            z-index: 999;
          }
          &::after{
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background-color: rgba($color: #000000, $alpha: .5);
          }
        }
      }
      .p-img{
        background-color: #eee;
        width: 100%;
        height: 100%;
      }
    }
    .flex{
      display: flex;
    }
    .el-button--primary{
      background-color: #3954B3;
      border-color: #3954B3;
      &:active{
        border-color: rgba($color: #3954B3, $alpha: .7);
        background-color: rgba($color: #3954B3, $alpha: .7);
      }
    }
  }
}
</style>
<style lang="scss">
.edit-view{
  .mask{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    .el-loading-mask{
      background-color: rgba(0,0,0,.3);
    }
  }
  .el-form{
    .el-input{
      width: 40px;
      margin-right: 10px;
      .el-input__inner{
        padding: 0;
        min-width: 40px;
      }
    }
    .str{
      width: 500px;
      .el-input__inner{
        padding: 0 10px;
      }
    }
    .upload-list-box,.el-upload-list__item,.el-upload--picture-card{
      height: 80px;
      line-height: 86px;
    }
    .el-upload-list__item,.el-upload--picture-card{
      width: 80px;
    }
    .upload-list-box{
      display: flex;
    }
    .el-upload-list__item-status-label{
      display: none !important;
    }
    .el-input-group__prepend{
      padding: 0 6px;
      text-align: center;
    }
  }
  .el-dialog__body{
    padding: 0;
  }
  .model{
    .item{
      position: relative;
      border-top: 10px solid #eee;
      .del{
        position: absolute;
        top: 20px;
        right: 10px;
        z-index: 99;
      }
    }
  }
}
</style>

