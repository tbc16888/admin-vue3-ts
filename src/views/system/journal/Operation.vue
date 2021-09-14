<template>
  <container title="操作日志" tips="后台用户操作日志">

    <div class="main-card">
      <div style="margin-bottom: 10px">
        <el-date-picker
            v-model="datetime"
            type="datetimerange"
            size="small"
            style="margin-right: 10px">
        </el-date-picker>
        <el-button
            icon="el-icon-search" type="primary" size="small"
            @click="loadDataList(1)">查询
        </el-button>
      </div>
      <div class="data-container">
        <tbc-dynamic-table
            stripe
            v-loading="loading"
            :data="dataList"
            :cols="[
          {type: 'selection', width: 55},
          {label: '账号', prop: 'account', width: 100},
          {label: '昵称', prop: 'nick_name', width: 100},
          {label: '操作', prop: 'full_menu_name'},
          {label: '时间', prop: 'create_time'},
          {label: 'IP地址', prop: 'ipv4'},
          {label: '结果', prop: 'code'},
          {label: '操作', prop: 'action', width: 100, type: 'action', fixed: 'right',
            click: onButtonClick, button: [
                  {type: 'text', label: '详情', code: 'info'},
            ]}]">
          <template v-slot:expand="scope">
            <div style="text-wrap: none">{{ scope.row.params }}</div>
          </template>
          <template v-slot:code="scope">
            <el-tag type="success" v-if="scope.row.code === 0">成功</el-tag>
            <el-tag type="danger" v-if="scope.row.code !== 0">失败</el-tag>
          </template>
        </tbc-dynamic-table>
      </div>
      <tbc-pagination :total="total" :config="{page, size}" @change="loadDataList"/>
    </div>
  </container>
  <operation-detail ref="detail"/>
</template>
<script lang="ts">
import {
  defineComponent, ref, onMounted, Ref,
  defineAsyncComponent
} from 'vue'
import useOperation from './api/operation'

export default defineComponent({

  name: 'journal-operation-list',

  components: {
    OperationDetail: defineAsyncComponent(
        () => import('./OperationDetail.vue'))
  },

  setup() {
    const operation = useOperation()
    const detail: Ref = ref(null)
    const onButtonClick = (data: Record<string, any>) => {
      detail.value.show(data)
    }

    onMounted(() => {
      operation.loadDataList(1)
    })

    return {
      ...operation,
      detail,
      onButtonClick
    }
  }
})
</script>
