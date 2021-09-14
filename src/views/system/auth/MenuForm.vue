<template>
  <tbc-dialog ref="dialog" :title="(form.user_id ? '编辑':'添加') + '菜单'" @confirm="formSubmit" width="700px">
    <el-form label-position="top" class="compact">

      <el-form-item label="上级菜单">
        <tbc-selector
            ref="cat"
            api="/system.menu"
            field="parent_id"
            v-model="menuPath"
            :check-strictly="true"
            style="width: 100%"/>
      </el-form-item>

      <el-form-item label="菜单名称">
        <el-input v-model="form.menu_name"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="模块">
            <el-input v-model="form.module"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="控制器">
            <el-input v-model="form.controller">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方法">
            <el-input v-model="form.action">

            </el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="排序">
            <el-input v-model="form.sort_weight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="前端路由名称">
            <el-input v-model="form.route_name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="图标">
        <el-input v-model="form.route_name">
          <template v-slot:append>
            <el-button icon="el-icon-upload" @click="$refs.file.show()">选择</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, ref, reactive, Ref} from 'vue'
import useMenu from './api/menu'

export default defineComponent({

  name: 'system-menu-form',

  emits: ['success'],

  setup(props, {emit}) {
    const menu = useMenu()
    const dialog: Ref = ref(null)
    const form = reactive({
      menu_id: '', controller: '', module: '', action: '',
      route_name: '', icon: '', menu_name: ''
    })
    const menuPath = ref([])

    const show = (data: Record<string, any>) => {
      dialog.value.show()
      // form = {...form, ...data}
      // for (let i in form) if (data[i] !== 'undefined') form[i] = data[i]
    }

    const close = () => {
      dialog.value.close()
    }

    const formSubmit = async () => {
      const res = await menu.update(form)
      if (res.data.code === 0) emit('success')
    }

    return {
      dialog,
      form,
      show,
      close,
      menuPath,
      formSubmit
    }
  }
})
</script>