<template>
  <tbc-dialog title="导出设置" ref="dialogVisible">
    <div style="margin-bottom: 20px">
      <el-button-group>
        <el-tooltip class="item" effect="dark" :content="item.tips" placement="top" v-for="(item, index) in [
                      {label: '全选', tips: '本页面所有文件全部选择', code: 'all', icon: 'circle-check'},
                      {label: '反选', tips: '反向勾选当前页的文件', code: 'reverse', icon: 'refresh-left'},
                      {label: '清除', tips: '清除所有已经选择的文件', code: 'remove', icon: 'delete'},
                  ]" :key="index">
          <el-button :icon="item.icon" size="small" @click="onQuickSelectClick(item)">
            {{ item.label }}
          </el-button>
        </el-tooltip>
      </el-button-group>
    </div>

    <tbc-dynamic-form :form="dynamicForm" class="compact">
      <template #fields>
        <el-checkbox :label="item.label" v-model="item.checked" v-for="(item, index) in fields" :key="index">
        </el-checkbox>
      </template>
    </tbc-dynamic-form>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, ref, Ref} from 'vue'

const XLSX = (window as any).XLSX

interface ExportField {
  label: string,
  field: string,
  checked: boolean
}

export default defineComponent({

  name: 'tbc-dynamic-export',

  setup() {
    const dialogVisible: Ref = ref(null)
    const dynamicForm = ref([
      {label: '导出文件名', field: 'file_name', value: '', type: 'input'},
      {label: '导出字段', field: 'fields', value: '', type: 'input'}
    ])

    const fields: Ref = ref<Record<string, string | boolean>[]>([
      {label: '订单号', field: 'order_sn', checked: true},
      {label: '订单金额', field: 'order_amount', checked: true}
    ])

    const show = (fileName?: string, fieldList?: ExportField[]) => {
      dialogVisible.value.show()
      if (fileName) setFileName(fileName)
      if (fieldList) setFields(fieldList)
    }

    // 获取当前时间
    const getCurrentTime = (): string => {
      let date = new Date()
      return [
        date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
        date.getMinutes(), date.getSeconds()
      ].join('')
    }

    // 设置文件名
    const setFileName = (fileName: string): void => {
      dynamicForm.value.forEach(item => {
        if (item.field === 'file_name') item.value = fileName.replace('{time}', getCurrentTime())
      })
    }

    // 设置导出字段
    const setFields = (fieldsList: ExportField[]) => {
      fields.value = fieldsList
    }

    // 快捷选择按钮
    const onQuickSelectClick = (button) => {
      fields.value.forEach(item => {
        let checked = item.checked
        if (button.code === 'remove') checked = false
        if (button.code === 'reverse') checked = !checked
        if (button.code === 'all') checked = true
        item.checked = checked
      })
    }

    // 获取表单数据
    const getFormData = (): Record<string, string> => {
      const form: Record<string, string> = {}
      dynamicForm.value.forEach(item => form[item.field] = item.value)
      return form
    }

    // 开始导出
    const start = (data: Record<string, string>[], duringCallback?: CallableFunction) => {
      const header: string[] = []
      const fieldList: string[] = [];
      fields.value.forEach((item: ExportField) => {
        if (item.checked) {
          header.push(item.label)
          fieldList.push(item.field)
        }
      });

      const exportData: string[][] = []
      data.forEach((item: Record<string, string | number | boolean>) => {
        const rowData: string[] = [];
        fieldList.forEach((field: string) => {
          let str: string = item[field] as string
          if (duringCallback) item[field] = duringCallback(field, item)
          rowData.push(str)
        });
        exportData.push(rowData)
      });
      exportData.unshift(header)
      const worksheet = XLSX.utils.aoa_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SheetJS");
      XLSX.writeFile(workbook, getFormData().file_name + '.xlsx');
    }

    return {
      dialogVisible,
      dynamicForm,
      fields,
      setFields,
      setFileName,
      onQuickSelectClick,
      getCurrentTime,
      start,
      show
    }
  }
})
</script>