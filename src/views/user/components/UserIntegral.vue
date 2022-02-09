<template>
  <tbc-dialog title="积分明细" ref="dialog" basic :close-on-click-modal="true" width="900px">
    <tbc-pagination :total="total" :config="{page, size}" simple @change="loadDataList">
      <template #left>
        <el-select v-model="type" style="margin-right: 10px;width:120px">
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input v-model="keyword" style="margin-right: 10px;width:160px" placeholder="关键词" clearable>
        </el-input>
        <el-button
            icon="search" type="primary"
            @click="loadDataList(1)">查询
        </el-button>
      </template>
    </tbc-pagination>
    <div class="data-container">
      <tbc-dynamic-table
          v-loading="loading"
          max-height="460"
          :data="dataList"
          :cols="[
            {label: '编号/类型', prop: 'log_id', width: 200},
            {label: '数量', prop: 'change_amount', width: 200},
            {label: '时间', prop: 'change_time', width: 200},
            {label: '描述', prop: 'change_desc'}]">
        <template #log_id="scope">
          <p>{{ scope.row.log_id }}</p>
          <p>{{ scope.row.change_type_name }}</p>
        </template>
        <template #change_amount="scope">
          <p v-if="scope.row.change_amount > 0">
            <el-tag type="success">{{ scope.row.change_amount }}</el-tag>
          </p>
          <p v-if="scope.row.change_amount < 0">
            <el-tag type="danger">{{ scope.row.change_amount }}</el-tag>
          </p>
        </template>
      </tbc-dynamic-table>
    </div>
    <tbc-pagination :total="total" :config="{page, size}" @change="loadDataList"/>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, reactive, ref, toRefs, Ref} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from 'element-plus'

export default defineComponent({
  name: 'user-integral',
  setup() {
    const state = reactive({
      dataList: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      user: {user_id: ''},
      typeList: [],
      type: '',
      keyword: ''
    })
    const dialog: Ref = ref(null)
    const show = (data: { user_id: string }) => {
      if (data.user_id !== state.user.user_id) state.dataList = []
      state.user = data
      dialog.value.show()
      if (!state.dataList.length) initDataList()
      getTypeList()
    }
    const initDataList = () => {
      state.page = 1
      state.dataList = []
      loadDataList()
    }

    const loadDataList = async (page?: number, size?: number): Promise<void> => {
      state.loading = true
      if (page) state.page = page
      if (size) state.size = size
      const res = await http.get('/user.integral', {
        page,
        size,
        user_id: state.user.user_id
      })
      state.loading = false
      if (res.data.code !== 0) {
        ElMessage.error(res.data.message)
      } else {
        const data = res.data.data
        state.total = data.total;
        state.dataList = data.list;
      }
    }

    const getTypeList = async () => {
      const res = await http.get('/user.integral/typeList')
      if (res.data.code !== 0) return
      const list = res.data.data.list
      list.unshift({label: '全部', value: ''})
      state.typeList = list
    }

    return {
      ...toRefs(state),
      dialog, show, loadDataList
    }
  },
})
</script>