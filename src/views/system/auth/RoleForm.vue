<template>
  <tbc-dialog :title="(form.role_id ? '编辑':'添加') + '角色'" ref="dialog" @confirm="formSubmit">
    <el-form label-width="80px" label-position="top" class="compact">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="角色名称">
            <el-input v-model="form.role_name"></el-input>
          </el-form-item>
          <el-form-item label="角色说明">
            <el-input type="textarea" v-model="form.role_desc" rows="3"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="option.value"
                        v-for="(option, idx) in  [{label: '使用', value: 1}, {label: '禁用', value: 2}]" :key="idx">
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="权限配置">
            <div style="height:300px;overflow:auto;width: 100%">
              <el-tree ref="tree" :props="props" node-key="menu_code" :highlight-current="true" :data="menuList"
                       :default-checked-keys="defaultChecked" show-checkbox>
              </el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, ref, reactive, toRefs, Ref} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from 'element-plus'

export default defineComponent({

  name: 'system-role-form',

  emits: ['success'],

  setup(props, {emit}) {
    const state = reactive({
      menuList: [],
      defaultChecked: [],
      form: {role_id: ''},
      base: {role_id: '', role_name: '', role_desc: '', menu: '', status: 1},
      props: {
        label: 'menu_name',
        children: 'children',
        isLeaf: 'isLeaf'
      },
    })
    const tree: Ref = ref(null)
    const dialog: Ref = ref(null)

    // 显示
    const show = (data: Record<string, string | number>) => {
      // tree.value.setCheckedKeys([])
      state.defaultChecked = []
      state.form = {...state.base}
      if (typeof data === 'object') {
        state.form = {...state.form, ...data}
        // for (let i in state.form) state.form[i] = data[i]
        let defaultChecked: string[] = data.menu_code ? (data.menu_code as string).split(',') : []
        state.defaultChecked = defaultChecked as []
      }
      dialog.value.show()
      getRoleInfo()
      // if (!this.menuList.length || true)
      getSystemMenuList()
    }

    const close = () => {
      dialog.value.close()
    }

    const getRoleInfo = async () => {
      if (!state.form.role_id) return
      const res = await http.get('/system.role/detail', {
        role_id: state.form.role_id
      })
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      state.defaultChecked = res.data.data.menu_code
    }

    // 菜单列表
    const getSystemMenuList = async () => {
      const res = await http.get('/system.menu/tree')
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      let data = res.data.data
      state.menuList = data
    }

    const formSubmit = async () => {
      let form: Record<string, string | number | string[]> = {...state.form}
      let checkedNodes = tree.value.getCheckedNodes()
      let checkedValue: string[] = []
      for (let i in checkedNodes) checkedValue.push(checkedNodes[i].menu_code)
      form.menu = checkedValue
      const api = form.role_id ? 'edit' : 'add'
      const res = await http.post('/system.role/' + api, form)
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      emit('success')
      close()
    }


    return {
      ...toRefs(state),
      tree,
      dialog,
      show,
      formSubmit
    }
  }
})
</script>