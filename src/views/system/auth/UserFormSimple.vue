<template>
  <tbc-dialog ref="dialog" :title="(form.user_id ? '编辑':'添加') + '用户'" @confirm="formSubmit" width="600px">
    <tbc-dynamic-form :form="dynamicForm" class="compact" size="large">
      <template #role_name="{item}">
        <el-input placeholder="点击选择角色" v-model="item.value" size="large" readonly @click="$refs.role.show()">
          <template #suffix>
            <el-icon @click="onRoleSelected({})" v-if="item.value"
                     style="top: 50%;margin-top: -6px;">
              <circle-close/>
            </el-icon>
          </template>
        </el-input>
      </template>
    </tbc-dynamic-form>
  </tbc-dialog>
  <role-selector ref="role" @choice="onRoleSelected"/>
</template>
<script>
import {ref, reactive, getCurrentInstance} from 'vue'
import RoleSelector from "@/views/system/auth/RoleSelector";

export default {
  name: 'system-user-form',

  emits: ['success'],

  components: {
    RoleSelector
  },

  setup(_, {emit}) {
    const role = ref(null)

    const {proxy} = getCurrentInstance()
    const dialog = ref(null)
    const form = reactive({user_id: ''})
    const dynamicForm = reactive([
      {
        label: '账号', value: '', type: 'text', field: 'account',
        remark: '（仅限英文字母和数字的组合，且以英文字母开头）', maxLength: 20,
        showWordLimit: true
      },
      {label: '密码', value: '', type: 'password', field: 'password'},
      {label: '昵称', value: '', type: 'input', field: 'nick_name', clearable: true},
      {label: '角色', value: '', type: 'input', field: 'role_name'},
      {label: '角色', value: '', type: 'hidden', field: 'role_id'},
      {
        label: '状态', value: 1, type: 'radio', field: 'status', options: [
          {label: '使用', value: 1},
          {label: '禁用', value: 2}
        ], default: 1
      },
    ])

    const show = (data) => {
      fill(data)
      dialog.value.show()
    }

    const close = () => {
      dialog.value.close()
    }

    const fill = (data) => {
      if (typeof data === 'undefined') data = {}
      form.user_id = data ? data.user_id : ''
      dynamicForm.forEach(item => {
        item.value = item.default || '';
        if (typeof data[item.field] !== 'undefined') item.value = data[item.field]
        if (item.field === 'account') item.disabled = !!form.user_id
      })
    }

    const formSubmit = async () => {
      dynamicForm.forEach(item => form[item.field] = item.value)
      const api = (form.user_id ? 'edit' : 'add')
      const res = await proxy.$http.post('/system.user/' + api, form)
      if (res.data.code !== 0) proxy.$message.error(res.data.message)
      if (res.data.code === 0) proxy.$message.success(res.data.message)
      if (res.data.code !== 0) return;
      close()
      emit('success')
    }

    // 选择角色
    const onRoleSelected = (data) => {
      dynamicForm.forEach(item => {
        if (item.field === 'role_id') item.value = data.role_id || ''
        if (item.field === 'role_name') item.value = data.role_name || ''
      });
      role.value.close()
    }

    return {
      dialog,
      form,
      dynamicForm,
      show,
      close,
      formSubmit,
      role,
      onRoleSelected
    }
  }
}
</script>