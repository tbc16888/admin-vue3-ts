<template>
  <teleport to="body">
    <tbc-dialog title="文件管理" ref="dialog" basic width="950px">
      <div style="display: flex;flex-direction: row">
        <el-input placeholder="文件名" class="short" v-model="keyword" clearable style="width:260px;" prefix-icon="search">
          <template #append>
            <el-button
                icon="search" type="primary"
                @click="getFileList(1)">查询
            </el-button>
          </template>
        </el-input>
        <el-button-group style="margin:0 10px;flex:1">
          <el-tooltip class="item" effect="dark" :content="item.tips" placement="top" v-for="(item, index) in [
{label: '全选', tips: '本页面所有文件全部选择', code: 'all', icon: 'circle-check'},
{label: '反选', tips: '反向勾选当前页的文件', code: 'reverse', icon: 'refresh-left'},
{label: '取消', tips: '取消本页已经选择的文件', code: 'cancel', icon: 'remove'},
{label: '清除', tips: '清除所有已经选择的文件', code: 'remove', icon: 'delete'},
              ]" :key="index">
            <el-button :icon="item.icon" @click="onQuickSelectClick(item)">
              {{ item.label }}
            </el-button>
          </el-tooltip>
        </el-button-group>

        <el-button-group>
          <el-button icon="upload" @click.stop="$refs.uploadComponent.show()"
                     type="success">
            上传
          </el-button>
          <el-button icon="rank" @click.stop="showMovePanel()"
                     type="info">
            移动
          </el-button>
          <el-button icon="delete" @click.stop="deleteFile"
                     type="danger">
            删除
          </el-button>
          <el-button size="default" icon="success-filled" type="primary"
                     @click="confirmSelect">确认({{ selectedFiles.length }})
          </el-button>
        </el-button-group>
      </div>

      <div style="margin-top: 20px;display: flex;flex-direction: row;    align-items: center;">
        <el-breadcrumb separator-class="arrow-right" style="flex:1">
          <el-breadcrumb-item v-for="(item, index) in directoryPath" :key="index">
            <template v-if="index === directoryPath.length - 1">{{ item.label }}</template>
            <a href="javascript:void(0)" style="cursor: pointer" @click="onPathItemClick(item, index)"
               v-if="index < directoryPath.length - 1">{{ item.label }}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-button icon="plus" type="text" style="line-height: normal;min-height: 0;padding:0"
                   @click="showAddPanel">
          添加目录
        </el-button>
      </div>


      <div v-loading="loading"
           style="display: flex;flex-direction: row;flex-wrap: wrap;padding-top: 1px;padding-left: 1px;height: 400px;overflow-y: auto;margin: 20px 0">
        <div
            v-for="(item) in fileList"
            :key="item.file_id"
            class="tbc-list-item"
            :style="item.checked ? 'background:#F1F1F1':''" @click="onFileItemClick(item)">
          <div style="position:absolute;top:10px  ;right:10px;" @click.stop="">
            <el-checkbox v-model="item.checked" style="height:auto"
                         @change="onFileCheckboxChange(item)"></el-checkbox>
          </div>

          <div style="width:60px; height:60px;margin: 10px auto;cursor:pointer;text-align: center"
               @click.stop="onFileCoverClick(item)">
            <el-image
                style="width:60px; height:60px;"
                :src="item.file_cover" fit="contain"
            ></el-image>
          </div>

          <p style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:12px;text-align: center;cursor: pointer"
             @click.stop="showFileDetail(item)">
            {{ item.file_title }}
          </p>
        </div>
      </div>
      <tbc-pagination :total="total" :config="{size, page}" :page-sizes=[size] @change="getFileList"/>
    </tbc-dialog>
    <tbc-image-viewer ref="viewerComponent" :z-index="9999"/>
    <tbc-dialog ref="fileForm" title="文件信息">
      <tbc-dynamic-form :form="file" class="compact"></tbc-dynamic-form>
      <template #footer>
        <div style="text-align: right">
          <el-button @click="$refs.fileForm.close()">关闭</el-button>
          <el-button type="success" @click="updateFileSubmit">更新</el-button>
        </div>
      </template>
    </tbc-dialog>

    <tbc-dialog ref="directoryComponent" :title="directoryPanelFormType === 1 ? '添加目录': '移动文件到'"
                @confirm="onDirectoryPanelConfirm">
      <div>
        <el-form label-position="top" class="compact" v-show="directoryPanelFormType === 1">
          <el-form-item label="上级目录">
            <el-cascader v-model="directoryMove" :options="directoryTree" style="width: 100%"
                         :props="{ checkStrictly: true }" :clearable="true"></el-cascader>
          </el-form-item>
          <el-form-item label="目录名称">
            <el-input type="text" v-model="directoryForm.file_title"/>
          </el-form-item>
        </el-form>
        <el-form label-position="top" class="compact" v-show="directoryPanelFormType === 2">
          <el-form-item>
            <el-cascader v-model="directoryMove" :options="directoryTree" style="width: 100%"
                         :props="{ checkStrictly: true }" :clearable="true"></el-cascader>
          </el-form-item>
        </el-form>
      </div>

    </tbc-dialog>
    <tbc-file-upload ref="uploadComponent" @select="getFileList(1)"/>
  </teleport>
</template>
<script lang="ts">
import {defineComponent, reactive, Ref, ref, toRefs, PropType} from 'vue'
import http from '@/plugin/http'
import {ElMessage, ElMessageBox} from "element-plus";

interface File {
  file_id: string,
  file_url: string,
  file_cover: string,
  file_title: string,
  file_type: string,
  checked?: boolean
}

export default defineComponent({

  name: 'tbc-file-manager',

  emits: ['select'],

  props: {
    selectable: {
      type: Array as PropType<string[]>,
      default() {
        return []
      }
    },

    config: {
      type: Object as PropType<{ [k: string]: any }>,
      default() {
        return {}
      }
    }
  },

  setup(props: any, {emit}) {

    const dialog: Ref = ref(null)
    const viewerComponent: Ref = ref(null)
    const fileForm: Ref = ref(null)
    const directoryComponent: Ref = ref(null)

    const state = reactive({
      keyword: '',
      fileList: [],
      total: 0,
      page: 1,
      size: 27,
      loading: false,
      directoryPath: [{label: '全部', value: ''}],
      directoryMove: [],
      selectedFiles: [],
      uploadConfig: {
        upload_url: '',
        field: 'file'
      },
      uploadFileList: [],
      uploadChecked: [],
      file: [
        {label: '文件ID', value: '', type: 'hidden', field: 'file_id'},
        {label: '文件名', value: '', type: 'input', field: 'file_title'},
        {label: '文件类型', value: '', type: 'input', field: 'file_type'},
        {label: '文件MIME', value: '', type: 'input', field: 'file_mime'},
        {label: '文件地址', value: '', type: 'input', field: 'file_url'},
      ],
      clickItemData: {},
      fileName: '',
      selectable: [],
      directoryForm: {file_title: '', directory_path: []},
      accept: 'image',
      maxSelect: 2, checked: [],
      directory: [],
      directoryTree: [],
      files: [],
      directoryPanelFormType: 1
    })

    // 显示弹窗
    const show = (config): void => {
      dialog.value.show();
      (state.selectable as string[]) = [...state.selectable, ...props.selectable]
      if (!state.fileList.length) getFileList()
      clearAllChecked()
      getDirectoryTree()
    }

    // 点击文件封面
    const onFileCoverClick = (data: File): void => {

      if (data.file_type === 'image') {
        const fileList: string[] = []
        state.fileList.forEach((item: File) => fileList.push(item.file_url))
        const position: number = fileList.findIndex((item: string) => item === data.file_url)
        viewerComponent.value.show(fileList, position)
      }

      if (data.file_type === 'directory') {
        state.directoryPath.push({
          value: data.file_id,
          label: data.file_title as string,
        })
        getFileList(1)
      }
    }

    // 显示文件信息
    const showFileDetail = (file: File) => {
      state.file.forEach((item: Record<string, string>) => {
        item.value = file[item.field]
      })
      fileForm.value.show()
    }

    const onFileItemClick = () => {
      console.log('onFileItemClick')
    }


    const onPathItemClick = (data: { label: string, value: string }, index: number): void => {
      state.directoryPath.splice(index + 1)
      getFileList(1)
    }

    const getFileList = async (page?: number, size?: number): Promise<void> => {
      state.loading = true
      if (page) state.page = page
      if (size) state.size = size
      const res = await http.get('/file', {
        page: state.page,
        size: state.size,
        keyword: state.keyword,
        directory: state.directoryPath[state.directoryPath.length - 1].value
      })
      state.loading = false
      if (res.data.code !== 0) {
        ElMessage.error(res.data.message)
      } else {
        const data = res.data.data
        state.total = data.total
        state.fileList = data.list
      }
    }

    const onFileCheckboxChange = (data: File) => {
      if (state.selectable.length && (state.selectable as string[]).indexOf(data.file_type) === -1) {
        return data.checked = false
      }

      if (state.selectedFiles.length > state.maxSelect && data.checked) {
        return data.checked = false
      }

      if (data.checked) return (state.selectedFiles as File[]).push(data)
      let index = state.selectedFiles.findIndex((file: File) => {
        return (file.file_url === data.file_url)
      })
      state.selectedFiles.splice(index, 1)
    }

    // 清除所有选择的文件
    const clearAllChecked = () => {
      clearPageChecked()
      state.selectedFiles = []
    }

    // 清除本页选择的文件
    const clearPageChecked = () => {
      state.fileList.forEach((item: File) => {
        let index = state.selectedFiles.findIndex((selected: string) => selected == item.file_url)
        state.selectedFiles.splice(index, 1)
        item.checked = false
      })
    }

    const onQuickSelectClick = (button: { code: string }) => {
      if (button.code === 'cancel') return clearPageChecked()
      if (button.code === 'remove') return clearAllChecked()

      const selectable: string[] = state.selectable
      const selectedFiles: File[] = state.selectedFiles
      state.fileList.forEach((item: File) => {
        if (state.selectable.length && selectable.indexOf(item.file_type) === -1) return
        let index = selectedFiles.findIndex(choose => {
          return choose.file_id === item.file_id
        })
        if (index === -1) {
          if (selectedFiles.length >= state.maxSelect) return
          selectedFiles.push(item)
        } else {
          if (button.code !== 'all') selectedFiles.splice(index, 1)
        }
        item.checked = (button.code !== 'all') ? !item.checked : true
      })
    }

    const confirmSelect = () => {
      if (!state.selectedFiles.length) return
      let files = JSON.parse(JSON.stringify(state.selectedFiles))
      files.splice(state.maxSelect, 100000)
      emit('select', files)
      dialog.value.close()
    }

    const updateFileSubmit = async () => {
      const form: Record<string, string> = {}
      state.file.forEach((item: Record<string, string>) => form[item.field] = item.value)
      const res = await http.post('/file/edit', form)
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      ElMessage.success(res.data.message)
      fileForm.value.close()
      await getFileList()
    }

    // 删除文件
    const deleteFile = async () => {
      if (!state.selectedFiles.length) return ElMessage.error('没有选中文件')
      const fileId = []
      state.selectedFiles.forEach((item: File) => fileId.push(item.file_id))
      ElMessageBox.confirm('确定要删除选择的文件吗？（注：目录被删除时不会删除底下的文件）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await http.post('/file/delete', {file_id: fileId.join(',')})
        if (res.data.code !== 0) return ElMessage.error(res.data.message)
        ElMessage.success(res.data.message)
        await getFileList()
        clearAllChecked()
      }).catch(() => console.log('cancel delete files'));
    }

    const getDirectoryTree = async () => {
      const res = await http.get('/file/tree')
      if (res.data.code !== 0) return ElMessage.success(res.data.message)
      const data = res.data.data
      state.directoryTree = data.list
    }

    // 移动文件到文件夹
    const showMovePanel = () => {
      if (!state.selectedFiles.length) return ElMessage.error('没有选中文件')
      state.directoryPanelFormType = 2
      directoryComponent.value.show()
    }

    const showAddPanel = () => {
      state.directoryPanelFormType = 1
      directoryComponent.value.show()
    }

    const addDirectorySubmit = async () => {
      const form: Record<string, string | number> = JSON.parse(JSON.stringify(state.directoryForm))
      form.file_type = 'directory'
      form.is_directory = 1
      if (state.directoryMove.length) form.directory_id = state.directoryMove[state.directoryMove.length - 1]
      const res = await http.post('/file/add', form)
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      ElMessage.success(res.data.message)
      state.directoryForm.file_title = ''
      directoryComponent.value.close()
      await getDirectoryTree()
      await getFileList()
    }

    const onDirectoryPanelConfirm = async () => {
      if (state.directoryPanelFormType === 1) await addDirectorySubmit()
      if (state.directoryPanelFormType === 2) await moveFileToDirectory()
    }

    const moveFileToDirectory = async () => {
      const fileId: string[] = []
      state.selectedFiles.forEach((item: File) => fileId.push(item.file_id))
      const form: Record<string, string> = {}
      form.file_id = fileId.join(',')
      form.directory_id = ''
      if (state.directoryMove.length) form.directory_id = state.directoryMove[state.directoryMove.length - 1]
      const res = await http.post('/file/move', form)
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      ElMessage.success(res.data.message)
      directoryComponent.value.close()
      clearAllChecked()
      await getFileList()
      await getDirectoryTree()
    }

    return {
      ...toRefs(state),
      dialog,
      show,
      viewerComponent,
      directoryComponent,
      fileForm,
      onFileCoverClick,
      onPathItemClick,
      getFileList,
      onQuickSelectClick,
      onFileCheckboxChange,
      confirmSelect,
      showFileDetail,
      updateFileSubmit,
      deleteFile,
      onFileItemClick,
      showMovePanel,
      moveFileToDirectory,
      showAddPanel,
      onDirectoryPanelConfirm
    }
  }
})
</script>
<style scoped>
.el-button{
  font-size: 12px
}
.tbc-list-item {
  position: relative;
  padding: 10px;
  width: 80px;
  height: 100px;
  border: 1px solid #DDD;
  margin-left: -1px;
  margin-top: -1px;
  box-sizing: content-box
}

.tbc-list-item:hover {
  background: #F5F5f5;
}

.tbc-image-outer {
  position: relative;
  width: 100px;
  height: 80px;
  overflow: hidden;
}

.tbc-image-outer:hover {
  cursor: pointer
}

.tbc-checkbox-outer {
  position: absolute;
  top: 4px;
  right: 4px;
}

.tbc-checkbox-outer .el-checkbox {

}

.tbc-image-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
  margin-bottom: 6px
}
</style>