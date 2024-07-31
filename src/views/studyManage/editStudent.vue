<template>
  <div v-loading="loading" class="edit-student main-box" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
    <p class="title">基本信息</p>
    <el-form label-width="102px" :model="form" :rules="rules" ref="form" >
      <el-form-item label="题目标题" prop="question">
        <el-input v-model="form.question" placeholder="请输入题目标题"/>
      </el-form-item>
      <el-form-item label="试题分类" prop="lesson_info_id">
        <el-cascader v-model="form.lesson_info_id" :props="props" :placeholder="form.lesson_title?form.lesson_title:'请选择试题分类'" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="试题类型" prop="question_type">
        <el-radio-group v-model="form.question_type">
          <el-radio :label="1">选择题</el-radio>
          <el-radio :label="2">问答题</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="form.question_type===1">
        <el-form-item label="单选/多选" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">单选</el-radio>
            <el-radio :label="2">多选</el-radio>
          </el-radio-group>
        </el-form-item>   
        <el-form-item label="A" prop="a">
          <el-input v-model="form.a" placeholder="请输入选项A内容"/>
        </el-form-item>
        <el-form-item label="B" prop="b">
          <el-input v-model="form.b" placeholder="请输入选项B内容"/>
        </el-form-item>
        <el-form-item label="C" prop="c">
          <el-input v-model="form.c" placeholder="请输入选项C内容"/>
        </el-form-item>
        <el-form-item label="D" prop="d">
          <el-input v-model="form.d" placeholder="请输入选项D内容"/>
        </el-form-item>
        <el-form-item label="正确答案" prop="right_answer">
          <el-checkbox-group v-model="form.right_answer">
            <el-checkbox label="A" key="A">A</el-checkbox>
            <el-checkbox label="B" key="B">B</el-checkbox>
            <el-checkbox label="C" key="C">C</el-checkbox>
            <el-checkbox label="D" key="D">D</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="问答题内容" prop="right_answer">
          <el-input type="textarea" autosize v-model="form.right_answer" placeholder="请输入问答题内容"/>
        </el-form-item>
      </div>
      <el-form-item label="答案解析" prop="answer_info">
        <el-input type="textarea" autosize placeholder="请输入答案解析" v-model="form.answer_info"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="back">取消</el-button>
      <el-button type="primary" @click="submit">发布</el-button>
    </div>
  </div>
</template>
<script>
import {editExamination,getLessonSelect} from '@/api/study'
export default {
  name: 'EditStudent',
  data() {
    return {
      loading: false,
      form:{
        type:'',
        question_type:1,
        lesson_info_id:'',
        answer_info:'',
        a:'',
        b:'',
        c:'',
        d:'',
        question:'',
        content:'',
        right_answer:[]
      },
      rules:{
        right_answer: [{ required: true, message: '请选择正确答案', trigger: 'blur' }],
        question: [{ required: true, message: '请输入题目标题', trigger: 'blur' }],
        lesson_info_id: [{ required: true, message: '请选择试题分类', trigger: 'blur' }],
        question_type: [{ required: true, message: '请选择试题类型', trigger: 'blur' }],
        // answer_info: [{ required: true, message: '请输入答案解析', trigger: 'blur' }],
        content: [{ required: true, message: '请输入选项', trigger: 'blur' }],
        type: [{ required: true, message: '请选择试题类型', trigger: 'blur' }],
        a: [{ required: true, message: '请输入选项A内容', trigger: 'blur' }],
        b: [{ required: true, message: '请输入选项B内容', trigger: 'blur' }],
        c: [{ required: true, message: '请输入选项C内容', trigger: 'blur' }]
        // d: [{ required: true, message: '请输入选项D内容', trigger: 'blur' }]
      },
      props: {
        lazy: true,
        label:'title',
        value:'id',
        async lazyLoad (node, resolve) {
          const nodes = []
          if(node.level === 0 ){
           const {code,data} = await getLessonSelect()
              if(code===0) resolve(data)
          }else{
            const {code,data} = await getLessonSelect({lesson_id:node.value})
            if(code===0){
              data.map(i=>{
                let obj = {
                  id: i.id,
                  title: i.title,
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
  watch:{
    "$route.query": {
      immediate: true,
      handler(value) {
        if(value.info){
          let form = JSON.parse(value.info)
          if(form.question_type===1){
            form.a=form.content[0].value
            form.b=form.content[1].value
            form.c=form.content[2].value
            form.d=form.content[3].value
            form.content = ''
            form.right_answer=form.right_answer.split(',')
          }
          this.form = form
        }else{
          this.initForm()
        }
      }
    }
  },
  created() {},
  methods: {
    initForm(){
      this.form={
        type:'',
        question_type:1,
        lesson_info_id:'',
        answer_info:'',
        a:'',
        b:'',
        c:'',
        d:'',
        question:'',
        content:'',
        right_answer:[]
      }
    },
    back(){
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    },
    submit(){
      this.$refs['form'].validate(async valid=>{
        if(valid){
          const params = JSON.parse(JSON.stringify(this.form))
          params.lesson_info_id = params.lesson_info_id.length?params.lesson_info_id[params.lesson_info_id.length-1]:params.lesson_info_id
          if(params.question_type===1){
            params.content=[]
            params.content[0]={key:'A',value:`${params.a}`}
            params.content[1]={key:'B',value:`${params.b}`}
            params.content[2]={key:'C',value:`${params.c}`}
            params.content[3]={key:'D',value:`${params.d}`}
            params.right_answer=params.right_answer.join()
          }else{
            delete params.type
            params.content = params.right_answer
          }
          delete params.create_time
          delete params.lesson_title
          delete params.a
          delete params.b
          delete params.c
          delete params.d
          const {code} = await editExamination(params)
          if(code===0){
            this.$message({
              message:params.id?'编辑成功':'添加成功',
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
    }
  }
}
</script>
<style lang="scss">
.edit-student {
  padding: 0 32px 10px;
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    margin: 0;
    padding: 30px;
    font-size: 20px;
  }
  .el-input,.el-textarea{
    width: 380px;
  }
  .upload-demo{
    line-height: initial;
  }
  .dialog-footer{
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

