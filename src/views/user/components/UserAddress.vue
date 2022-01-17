<template>
  <tbc-dialog title="用户地址" ref="dialog" basic :close-on-click-modal="true">
    <div class="data-container">
      <tbc-dynamic-table
          v-loading="loading"
          :data="dataList"
          max-height="460"
          :cols="[
            {label: '联系人', prop: 'contact'},
            {label: '默认地址', prop: 'is_default', align: 'center', width: 100}]">
        <template #contact="scope">
          <p>
            <span>{{ scope.row.contact }}</span>
            <span style="margin-left: 10px;color: #999">{{ scope.row.contact_number }}</span>
          </p>
          <p>{{ scope.row.full_address }}</p>
        </template>
        <template #is_default="scope">
          <el-switch
              v-model="scope.row.is_default"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0" @change="changeAddress(scope.row)">
          </el-switch>
        </template>
      </tbc-dynamic-table>
    </div>
    <tbc-pagination :total="total" :config="{page, size}" @change="loadDataList"/>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, reactive, ref, Ref, toRefs} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from "element-plus";

export default defineComponent({

  name: 'user-address-list',

  setup() {
    const state = reactive({
      dataList: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      user: {user_id: ''}
    })
    const dialog: Ref = ref(null)

    const show = (params: { user_id: string }) => {
      if (params.user_id !== state.user.user_id) state.dataList = []
      state.user.user_id = params.user_id
      dialog.value.show()
      loadDataList(1)
    }

    const loadDataList = async (page?: number, size?: number): Promise<void> => {
      state.loading = true
      if (page) state.page = page
      if (size) state.size = size
      const res = await http.get('/user.address', {
        page,
        size,
        user_id: state.user.user_id
      })
      state.loading = false
      const data = res.data.data
      if (res.data.code !== 0) {
        ElMessage.error(res.data.message)
      } else {
        state.total = data.total;
        state.dataList = data.list;
      }
    }

    const changeAddress = async (data: Record<string, string | number>) => {
      if (!data.address_id) return
      data.user_id = state.user.user_id
      const res = await http.post('/user.address/edit', data)
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      await loadDataList(1)
    }

    return {
      ...toRefs(state),
      dialog,
      show,
      loadDataList,
      changeAddress
    }
  }
})
</script>