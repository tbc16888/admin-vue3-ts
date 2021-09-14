<template>
  <tbc-dialog title="优惠券" ref="dialog" basic :close-on-click-modal="true" width="900px">
    <div class="data-container">
      <tbc-dynamic-table
          v-loading="loading"
          :data="dataList"
          max-height="460"
          :cols="[
            {label: '基本信息', prop: 'coupon_name', width: 220},
            {label: '优惠 / 门槛', prop: 'discount', width: 200},
            {label: '有效期', prop: 'time',width: 220},
            {label: '状态', prop: 'status'},
            {label: '使用情况', prop: 'use_time', width: 220}]">
        <template #coupon_name="scope">
          <p>{{ scope.row.user_coupon_id }}</p>
          <p>{{ scope.row.coupon_name }}</p>
        </template>
        <template #discount="scope">
          <p>优惠：￥{{ scope.row.discount }}</p>
          <p>门槛：￥{{ scope.row.minimum }}</p>
        </template>
        <template #time="scope">
          <template>
            <p>开始：{{ scope.row.effective_start_time }}</p>
            <p>结束：{{ scope.row.effective_end_time }}</p>
          </template>
        </template>
        <template #status="scope">
          <el-tag v-if="scope.row.status == 0">待使用</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">已过期</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">已使用</el-tag>
        </template>
        <template #use_time="scope">
          <template>
            <p>订单：{{ scope.row.order_sn }}</p>
            <p>时间：{{ scope.row.use_time }}</p>
          </template>
        </template>
      </tbc-dynamic-table>
    </div>
    <tbc-pagination ref="page" :total="total" :config="{page, size}" @change="loadDataList"/>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, reactive, ref, Ref, toRefs} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from "element-plus";

export default defineComponent({

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
      initDataList()
    }

    const initDataList = async () => {
      await loadDataList(1)
    }

    const loadDataList = async (page?: number, size?: number): Promise<void> => {
      state.loading = true
      if (page) state.page = page
      if (size) state.size = size
      const res = await http.get('/coupon/received', {
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


    return {
      ...toRefs(state),
      dialog,
      show,
      loadDataList
    }
  }
})
</script>