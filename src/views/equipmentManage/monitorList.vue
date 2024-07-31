<template>
  <div v-loading="loading" class="monitor-list main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <!-- <div class="select">
      <el-input placeholder="请输入设备简称" size="small" v-model="name" style="margin-right: 3px">
        <template slot="prepend">简称</template>
      </el-input>
      <el-select size="small" placeholder="请选择设备功率" v-model="" style="margin-right: 30px">
        <el-option value="2" label="20000W" />
        <el-option value="3" label="30000W" />
        <el-option value="4" label="40000W" />
      </el-select>
      <el-button size="small" @click="loading=true,getVideoList()">查 询</el-button>
      <el-button size="small" @click="'">重 置</el-button>
    </div> -->
    <el-button class="add" icon="el-icon-plus" type="primary" @click="dialogVisible = true,text='添加'">添加</el-button>
    <el-dialog :title="text" :before-close="initForm" :visible.sync="dialogVisible" width="528px">
      <el-form ref="form" :model="form" :rules="rules" label-width="102px">
        <el-form-item label="设备封面" prop="banner">
          <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="changeBanner">
            <img v-if="form.banner" :src="form.banner" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="设备名称" prop="device_name" v-if="!type">
          <el-input v-model="form.device_name" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="通道名称" prop="channel_name" v-else>
          <el-input v-model="form.channel_name" placeholder="通道名称" />
        </el-form-item>
        <el-form-item label="关联设备ID" prop="equipment_id" v-if="!type && dialogVisible === true">
          <el-cascader :placeholder="form.equipment_name || '请选择关联设备ID'" :props="props" style="width: 100%;" v-model="form.equipment_id"></el-cascader>
        </el-form-item>
        <el-form-item label="设备项目ID" prop="project_id">
          <el-input :disabled="text==='编辑'" v-model="form.project_id" placeholder="设备项目ID" />
        </el-form-item>
        <el-form-item label="设备序列号" prop="device_serial">
          <el-input :disabled="text==='编辑'" v-model="form.device_serial" placeholder="设备序列号" />
        </el-form-item>
        <el-form-item label="设备验证码" prop="validate_code" v-if="!type">
          <el-input :disabled="text==='编辑'" v-model="form.validate_code" placeholder="设备验证码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initForm()">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <div class="list">
      <el-table :data="list" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="e-table">
              <div>
                <span>通道号</span>
                <span>封面图</span>
                <span>通道名</span>
                <span>操作</span>
              </div>
              <div class="l-table" v-for="item in props.row.camera_list" :key="item.channelName">
                <span>{{ item.channelNo || '- -'}}</span>
                <el-image fit="cover" :src="item.banner" :preview-src-list="[item.banner]">
                  <div slot="error" class="image-slot">
                    <img src="../../assets/ic_default.jpg" alt="">
                  </div>
                </el-image>
                <span>{{ item.channel_name || '- -' }}</span>
                <el-button style="width: 52px;" type="text" @click="edit(item,1)">修改</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="equipment_id" label="设备ID" min-width="100px" />
        <el-table-column label="设备封面" min-width="200">
          <template slot-scope="scopes">
            <div class="demo-image__preview">
              <el-image fit="cover" :src="scopes.row.banner" :preview-src-list="[scopes.row.banner]">
                <div slot="error" class="image-slot">
                  <img src="../../assets/ic_default.jpg" alt="">
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="device_name" label="设备名称" min-width="200px" />
        <el-table-column prop="device_serial" label="设备序列" min-width="200px" />
        <el-table-column prop="validate_code" label="设备验证码" min-width="200px" />
        <el-table-column prop="validate_code" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button style="padding:0" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button style="padding:0" type="text" @click="del(scope.row.device_serial,scope.row.project_id)">删除</el-button>
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
import { getVideoList, addVideo,changeDevice,delVideo,changeCamera } from '@/api/equipment'
import { getAllFactory,getEquipmentByFactory } from '@/api/public'
import { compressAccurately } from '@/utils'
import {uploadImgs} from '@/api/public'
export default {
  name: 'MonitorList',
  data() {
    return {
      player:null,
      loading: true,
      dialogVisible:false,
      text:'添加',
      total: 0,
      size: 10,
      page: 1,
      type: '', //no修改通道
      list: [],
      file:null,
      form: {
        banner:'',
        equipment_id: '',
        device_serial: '',
        project_id:'',
        channel_name:'',
        validate_code:'',
        device_name:'',
        treaty_type:'ezviz_net',
        device_category:'Video'
      },
      rules: {
        equipment_id: [{ required: true, message: '请输入关联设备ID', trigger: 'blur' }],
        project_id: [{ required: true, message: '请输入ProjectID', trigger: 'blur' }],
        device_serial: [{ required: true, message: '请输入设备序列号', trigger: 'blur' }],
        channel_name: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
        validate_code: [{ required: true, message: '请输入设备验证码', trigger: 'blur' }],
        device_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
      },
      props: {
        lazy: true,
        label:'username',
        value:'id',
        async lazyLoad (node, resolve) {
          const nodes = []
          if(node.level === 0 ){
           const {code,data} = await getAllFactory()
              if(code===0) resolve(data)
          }else{
            const {code,data} = await getEquipmentByFactory({id:node.value})
            if(code===0){
              data.map(i=>{
                let obj = {
                  id: i.id,
                  username: i.name,
                  leaf: node.level >= 1
                }
                nodes.push(obj)
              })
              resolve(nodes)
            }
          }
        }
      }
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    async changeBanner(file) {
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') return this.$notify({ title: '提示', message: '图片只允许为PNG/JPG/JPEG格式', type: 'warning', duration: 2000 })
      this.file = file
      this.form.banner = URL.createObjectURL(file.raw)
    },
    del(device_serial,project_id){
      this.$confirm('此操作将永久删除该监控, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await delVideo({ device_serial,project_id })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.list.length === 1 && this.page > 1) {
            this.page--
          }
          this.getVideoList()
        })
        .catch(() => {})
    },
    initForm(){
      this.file = null
      this.form= {
        equipment_id: '',
        device_serial: '',
        project_id:'',
        channel_name: '',
        validate_code:'',
        device_name:'',
        banner:'',
        treaty_type:'ezviz_net',
        device_category:'Video'
      }
      this.type = ''
      this.dialogVisible = false
      this.$refs['form'].resetFields()
    },
    edit(row,no) {
      this.text = '编辑'
      this.form.device_serial = row.device_serial
      this.form.id = row.id
      this.form.banner = row.banner
      if(no){
        this.type = 'no'
        this.form.channelNo = row.channelNo
        this.form.channel_name = row.channel_name
      }else{
        this.type = ''
        this.form.validate_code = row.validate_code
        this.form.equipment_id = row.equipment_id
        this.form.equipment_name=row.equipment_name
        this.form.device_name = row.device_name
        // this.fprm.project_id = row.project_id
        this.form.treaty_type = 'ezviz_net',
        this.form.device_category = 'Video'
      }
      this.dialogVisible = true
    },
    submit() {
      this.$refs['form'].validate(async value => {
        if (value) {
          let params = JSON.parse(JSON.stringify(this.form))
          if (this.file && this.file.raw) {
            const res = await compressAccurately(this.file.raw,500)
            const formData = new FormData()
            formData.append('file[]', res)
            formData.append('path_name', `system/${this.file.name}`)
            const { code, data } = await uploadImgs(formData)
            if (code === 0) params.banner = `${data.url[0]}`
          }
          let res = null
          if(this.type==='no'){
            delete params.validate_code
            delete params.equipment_id
            delete params.device_name
            res = await changeCamera(params)
          }else{
            params.equipment_id = params.equipment_id[1]
            delete params.channel_name
            delete params.equipment_name
            res = this.text==='添加'?await addVideo(params):await changeDevice(params)
          }
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: this.text+'成功'
            })
            this.getVideoList()
            this.initForm()
          }
        }
      })
    },
    async getVideoList() {
      const filters = {}
      const params = { page: this.page, size: this.size, sorts: {}, filters }
      const { code, data } = await getVideoList(params)
      if (code === 0) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.getVideoList()
    }
  }
}
</script>
<style lang="scss" scoped>
.monitor-list {
  .add.el-button {
    background-color: #3954b3;
    margin-bottom: 20px;
    border-color:#3954b3;
    color: #fff;
  }
  .select {
    margin: 5px 0 40px;
    .el-input{
      width: 300px;
    }
    .el-select{
      width: 224px;
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
    margin-bottom: 60px;
  }
  .e-table{
    width: 100%;
    border: 1px solid #eee;
    &>div{
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 2fr 2.5fr 1fr;
      align-items: center;
      padding-bottom: 10px;
      span{
        padding: 10px;
        display: block;
      }
    }
  }
}
</style>
<style lang="scss">
.monitor-list {
  .avatar-uploader {
    height: 120px;
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
      width: 260px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .avatar {
      width: 260px;
      height: 120px;
      display: block;
    }
  }
}
</style>

