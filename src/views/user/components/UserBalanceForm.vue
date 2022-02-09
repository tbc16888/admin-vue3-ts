<template>
  <tbc-dialog title="账户调整" ref="dialog" @confirm="formSubmit">
    <el-form label-width="80px" label-position="top" class="compact">
      <el-form-item label="账户余额">
        <el-input v-model="userInfo.balance" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="调整数量">
        <el-input-number v-model="form.amount"></el-input-number>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :rows="4" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs, ref, Ref} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from 'element-plus'

export default defineComponent({

  name: 'user-balance-adjustment',

  emits: ['success'],

  setup(props, {emit}) {
    const dialog: Ref = ref(null)
    const state = reactive({
      userInfo: {
        user_id: ''
      },
      form: {amount: 0, remark: '', user_id: ''},
    })

    const show = (data: { user_id: string }): void => {
      dialog.value.show()
      state.userInfo = data
    }

    const formSubmit = async () => {
      state.form.user_id = state.userInfo.user_id
      const res = await http.post('/user.balance/change', state.form)
      if (res.data.code !== 0) return ElMessage.error(res.data.message);
      ElMessage.success(res.data.message)
      state.form.amount = 0
      state.form.remark = ''
      dialog.value.close()
      emit('success')
    }
    return {
      ...toRefs(state),
      dialog,
      show,
      formSubmit
    }
  }
})
</script>