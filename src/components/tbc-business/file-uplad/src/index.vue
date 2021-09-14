<template>
  <tbc-dialog title="文件上传" ref="dialog" basic>
    <el-tabs v-model="tabName">
      <el-tab-pane name="local" label="本地上传">
        <div style="height: 10px"></div>
        <div style="padding-bottom: 10px;">
          <el-upload
              ref="upload"
              :action="uploadConfig.upload_url"
              :name="uploadConfig.field"
              :limit="limit"
              :multiple="limit> 1"
              :data="uploadExtData"
              :accept="accept"
              :before-upload="onBeforeUpload"
              :on-success="onUploadSuccess">
            <template v-slot:trigger>
              <el-button size="small" icon="el-icon-upload" type="info">上传</el-button>
            </template>
            <el-button style="margin-left: 10px;" icon="el-icon-remove" size="small" type="danger"
                       @click="onClickClear">清空
            </el-button>
            <el-button style="margin-left: 10px;" icon="el-icon-success" size="small" type="primary"
                       @click="confirmSelected">确定
            </el-button>
          </el-upload>
        </div>
      </el-tab-pane>
      <el-tab-pane name="network" label="网络文件">
        <div style="height: 10px"></div>
        <tbc-dynamic-form :form="file" class="compact">
          <template v-slot:file_url>
            <el-input v-model="networkFile" clearable>
              <template #append>
                <el-button icon="el-icon-search el-icon" @click="getNetworkFileInfo">查询信息</el-button>
              </template>
            </el-input>
          </template>
        </tbc-dynamic-form>
        <el-checkbox v-model="append" :label="true">
          添加到文件库
        </el-checkbox>
        <el-button type="primary" size="small" @click="addToFileManager" style="float: right
">确定
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, defineAsyncComponent, reactive, Ref, ref, toRefs, computed} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from "element-plus";

export default defineComponent({

  name: 'tbc-file-upload',

  props: {
    limit: {
      type: Number,
      default: 99
    }
  },

  emits: ['select'],

  setup(props, {emit}) {

    const dialog: Ref = ref(null)
    const upload: Ref = ref(null)
    const state = reactive({
      tabName: 'local',
      uploadConfig: {
        upload_url: '',
        upload_token: ''
      },
      append: true,
      fileList: [],
      file: [
        {label: '文件地址', value: '', type: 'input', field: 'file_url'},
        {label: '文件名', value: '', type: 'input', field: 'file_title'},
        {label: '文件类型', value: '', type: 'input', field: 'file_type'},
        {label: '文件MIME', value: '', type: 'input', field: 'file_mime'},
      ],
      fileName: '',
      selectable: [],
      networkFile: '',
      accept: '',
      maxSelect: 99999, checked: []
    })

    const uploadExtData = computed(() => {
      return {token: state.uploadConfig.upload_token}
    })


    // 显示弹窗
    const show = (): void => {
      dialog.value.show()
    }

    // 上传配置
    const getUploadConfig = async () => {
      const res = await http.get('/upload/config')
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      state.uploadConfig = res.data.data
    }

    const onBeforeUpload = async () => {
      const res = await getUploadConfig()
      if (!state.uploadConfig.upload_url) return false
      console.log('beforeUpload', state.uploadConfig)
    }

    const onUploadSuccess = (data) => {
      state.fileList.push(data.data)
    }

    const onClickClear = () => {
      upload.value.clearFiles()
      state.fileList = []
    }

    // 确认文件上传
    const confirmSelected = () => {
      if (!state.fileList.length) return
      // const files: string[] = []
      // console.log(state.fileList)
      // state.fileList.forEach((item: { file_url: string }) => files.push(item.file_url))
      emit('select', JSON.parse(JSON.stringify(state.fileList)))
      dialog.value.close()
    }


    // 获取网络文件信息
    const getNetworkFileInfo = async () => {
      const form: Record<string, string> = {}
      state.file.forEach(item => form[item.field] = item.value)
      form.file_url = state.networkFile
      if (!form.file_url) return ''
      const res = await http.get('/file/getNetworkFileInfo', form)
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      let data = res.data.data
      state.file.forEach(item => {
        if (typeof data[item.field] !== "undefined") item.value = data[item.field]
      })
    }


    const addToFileManager = async () => {
      const form: Record<string, string> = {}
      state.file.forEach((item: Record<string, string>) => form[item.field] = item.value)
      form.file_url = state.networkFile
      if (state.append) {
        const res = await http.post('/file/add', form)
        if (res.data.code !== 0) return ElMessage.error(res.data.message)
        ElMessage.success(res.data.message)
      }
      emit('select', [form])
    }

    return {
      ...toRefs(state),
      dialog,
      upload,
      show,
      uploadExtData,
      getNetworkFileInfo,
      onBeforeUpload,
      onUploadSuccess,
      addToFileManager,
      onClickClear,
      confirmSelected
    }
  }
})
</script>