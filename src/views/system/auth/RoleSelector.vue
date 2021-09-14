<template>
  <tbc-dialog title="系统角色" ref="dialog" basic width="700px">
    <tbc-pagination :total="total" :config="{page, size}" simple>
      <template v-slot:left>
        <el-input placeholder="关键字" class="short" v-model="keyword" size="small" clearable
                  style="width:300px;margin-right: 10px;">
          <template v-slot:append>
            <el-button icon="el-icon-search" type="primary" size="small" @click="loadDataList(1)">查询
            </el-button>
          </template>
        </el-input>
        <el-button icon="el-icon-refresh" @click="choice({role_id: '', role_name: ''})" style="margin-left: 10px"
                   size="small">
          清空
        </el-button>
      </template>
      <template v-slot:right>
        <el-button
            size="small"
            icon="el-icon-refresh"
            circle
            @click="loadDataList(page)"
        ></el-button>
      </template>
    </tbc-pagination>
    <div class="data-container">
      <tbc-dynamic-table
          v-loading="loading"
          :max-height="400"
          :data="dataList"
          :cols="[
        {label: '角色名称', prop: 'role_name'},
        {label: '状态', prop: 'status', type: 'switch', width: 120},
        {label: '操作', prop: 'action', width: 80, fixed: 'right', type: 'action',
         click: choice,
         button: [
            {type: 'text', label: '选择'}
        ]}]">
      </tbc-dynamic-table>
    </div>
    <tbc-pagination :total="total" :config="{page, size}" @change="loadDataList"/>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, ref, Ref} from 'vue'
import useRole from './api/role'

export default defineComponent({

  name: 'system-role-selector',
  emits: ['choice'],
  setup(props, {emit}) {

    const role: any = useRole()
    const dialog: Ref = ref(null)

    // 显示
    const show = (): void => {
      dialog.value.show()
      if (!role.dataList.length) role.loadDataList()
    }

    // 关闭
    const close = (): void => {
      dialog.value.close()
    }

    // 选择
    const choice = (data: Record<string, any>) => {
      emit('choice', data)
    }

    return {
      ...role,
      dialog,
      show,
      close,
      choice
    }
  }
})
</script>
