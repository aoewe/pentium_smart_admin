<template>
  <div class="config">
    <div v-loading="loading" class="main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <el-tabs v-model="key" @tab-click="handleClick">
        <el-tab-pane label="版本号配置" name="version_number">
          <div class="version-box">
            <el-form ref="version" :model="version" :rules="versionRules" label-width="160px">
              <el-form-item label="Android版本号" prop="android">
                <el-input v-model="version.android" />
              </el-form-item>
              <el-form-item label="Android更新时间" prop="androidUpdate">
                <el-input v-model="version.androidUpdate" />
              </el-form-item>
              <el-form-item label="Android更新类型" prop="androidType">
                <el-radio v-model="version.androidType" :label="1">强制更新</el-radio>
                <el-radio v-model="version.androidType" :label="2">可忽略</el-radio>
              </el-form-item>
              <el-form-item label="Android更新说明" prop="androidInfo">
                <el-input type="textarea" autosize v-model="version.androidInfo" />
              </el-form-item>
              <el-form-item label="Android更新地址" prop="androidLink">
                <el-input v-model="version.androidLink" />
              </el-form-item>
              <el-form-item label="IOS版本号" prop="ios">
                <el-input v-model="version.ios" />
              </el-form-item>
              <el-form-item label="IOS更新时间" prop="iosUpdate">
                <el-input v-model="version.iosUpdate" />
              </el-form-item>
              <el-form-item label="IOS更新类型" prop="iosType">
                <el-radio v-model="version.iosType" :label="1">强制更新</el-radio>
                <el-radio v-model="version.iosType" :label="2">可忽略</el-radio>
              </el-form-item>
              <el-form-item label="IOS更新说明" prop="iosInfo">
                <el-input type="textarea" autosize v-model="version.iosInfo" />
              </el-form-item>
              <el-form-item label="IOS更新地址" prop="iosLink">
                <el-input v-model="version.iosLink" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="oss配置" name="ali_oss">
          <el-form ref="oss" :model="oss" :rules="ossRules" label-width="160px">
              <el-form-item label="AccessKeyID" prop="accessKeyId">
                <el-input v-model="oss.accessKeyId" />
              </el-form-item>
              <el-form-item label="AccessKeySecret" prop="accessKeySecret">
                <el-input v-model="oss.accessKeySecret" />
              </el-form-item>
              <el-form-item label="Bucket" prop="bucket">
                <el-input v-model="oss.bucket" />
              </el-form-item>
              <el-form-item label="Endpoint" prop="endpoint">
                <el-input v-model="oss.endpoint" />
              </el-form-item>
              <el-form-item label="Repalce" prop="repalce">
                <el-input v-model="oss.repalce" />
              </el-form-item>
              <el-form-item label="Search" prop="search">
                <el-input v-model="oss.search" />
              </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="ali_SDK配置" name="ali_sdk">暂无</el-tab-pane>
        <el-tab-pane label="公共配置" name="common_config">
          <el-form ref="config" :model="config" :rules="configRules" label-width="160px">
            <el-form-item label="客服电话" prop="server_mobile">
              <el-input v-model="config.server_mobile" placeholder="请输入客服电话" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footer">
      <el-button @click="getConfigByKey()">重 置</el-button>
      <el-button @click="submit()">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { getConfigByKey, setVersionConfig,setOSSConfig,editConfig } from '@/api/authority'
export default {
  name: 'Config',
  data() {
    return {
      key: 'version_number',
      typeKey: '',
      loading: true,
      oss: {},
      version: {},
      configRules:{
        server_mobile:[{ required: true, message: '请输入客服电话', trigger: 'blur' }]
      },
      ossRules: {
        accessKeyId: [{ required: true, message: '请输入accessKeyId', trigger: 'blur' }],
        accessKeySecret: [{ required: true, message: '请输入accessKeySecret', trigger: 'blur' }],
        bucket: [{ required: true, message: '请输入bucket', trigger: 'blur' }],
        endpoint: [{ required: true, message: '请输入endpoint', trigger: 'blur' }],
        repalce: [{ required: true, message: '请输入repalce', trigger: 'blur' }],
        search: [{ required: true, message: '请输入search', trigger: 'blur' }],
      },
      versionRules: {
        android: [{ required: true, message: '请输入API路径', trigger: 'blur' }],
        androidUpdate: [{ required: true, message: '请输入API描述', trigger: 'blur' }],
        androidType: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        androidInfo: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        androidLink: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        ios: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        iosUpdate: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        iosType: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        iosInfo: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        iosLink: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      aliSDK: {},
      config: {},
      active: 0
    }
  },
  created() {
    this.getConfigByKey()
  },

  methods: {
    handleClick() {
      this.loading = true
      this.getConfigByKey()
    },
    // 提交
    submit() {
      this.loading = true
      switch (this.key) {
        case 'version_number':
          this.submitVersion()
          break;
        case 'ali_oss':
          this.submitOss()
          break;
        case 'common_config':
          this.editConfig()
          break;
        default:
          break;
      }
    },
    editConfig(){
      this.$refs['config'].validate(async valid => {
        if(valid){
          const {code} = await editConfig({common_config:this.config})
          if (code === 0) {
            this.loading = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        }
      })
    },
    submitVersion(){
      this.$refs['version'].validate(async valid => {
        if (valid) {
          const { code } =  await setVersionConfig({ version_number: this.version })
          if (code === 0) {
            this.loading = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        }
      })
    },
    submitOss(){
      this.$refs['version'].validate(async valid => {
        if (valid) {
          const { code } = await setOSSConfig({ ali_oss: this.oss })
          if (code === 0) {
            this.loading = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        }
      })
    },
    async getConfigByKey() {
      let key = this.key
      if(key==='ali_sdk') return this.loading = false
      if(this.active===1){
        key = 'server_version_number'
      }
      const { code, data } = await getConfigByKey({ key })
      if (code === 0) {
        switch (this.key) {
          case 'version_number':
            this.version = data
            break
          case 'ali_oss':
            this.oss = data
            break
          case 'ali_sdk':
            this.aliSDK = data
            break
          case 'common_config':
            this.config = data
            break
          default:
            break
        }
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss">
.config{
  position: relative;
  height: calc(100vh - 85px);
  .main-box{
    min-height: calc(100vh - 173px);
  }
  .version-box{
    display: flex;
    .type{
      border-right: 2px solid #E4E7ED;
      padding-right: 10px;
      height: min-content;
      span{
        display: block;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: 303133;
        cursor: pointer;
        position: relative;
      }
      span.active{
        color: #409eff;
        &::after{
          content: '';
          height: 40px;
          width: 2px;
          background-color: #409eff;
          position: absolute;
          right: -12px;
        }
      }
    }
  }
  .el-input{
    width: 600px;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: -145px;
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
