<template>
  <tbc-dialog ref="dialog" title="操作详情" @confirm="$refs.dialog.close()">
    <el-tabs>
      <el-tab-pane label="请求参数">
        <pre style="padding: 20px;background: #f8f8f8;overflow-x: auto;max-height: 300px">{{info.params}}</pre>
      </el-tab-pane>
    </el-tabs>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, ref, Ref} from 'vue'
import useOperation from "./api/operation";

export default defineComponent({

  name: 'operation-detail',

  setup() {
    const operation = useOperation()
    const dialog: Ref = ref(null)
    const info: Ref = ref({
    })
    const show = async (data: { log_id: string }) => {
      dialog.value.show()
      const res = await operation.loadDataInfo(data.log_id)
      if (res.data.code !== 0) return
      info.value = res.data.data
      info.value.params = JSON.parse(info.value.params)
    }

    return {
      dialog,
      show,
      info
    }
  }

})
</script>