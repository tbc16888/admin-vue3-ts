<template>
  <container :title="(form.user_id ? '编辑': '添加') + '用户'">
    <div class="main-card">
      <el-tabs v-model="tabPaneIndex">
        <el-tab-pane label="账号信息" name="account">
          <div style="height: 20px"></div>
          <tbc-dynamic-form :form="dynamicForm1" class="compact" size="large"/>
        </el-tab-pane>
        <el-tab-pane label="资料信息" name="information">
          <div style="height: 20px"></div>
          <tbc-dynamic-form :form="dynamicForm2" class="compact" size="large">
            <template #avatar>
              <tbc-thumbnail v-model="images" width="80px" height="80px" :max="1" @click="$refs.file.show()"/>
            </template>
          </tbc-dynamic-form>
        </el-tab-pane>
      </el-tabs>
      <div>
        <el-button type="primary" @click="formSubmit">保存</el-button>
        <el-button @click="toUserList()">返回列表</el-button>
      </div>
    </div>
  </container>
  <tbc-file-manager ref="file" @select="onFileSelected"/>
</template>
<script lang="ts">
import {defineComponent, reactive, onMounted, toRefs, ref, Ref} from 'vue'
import useUser from './api/user'
import {useRoute, useRouter, onBeforeRouteUpdate} from 'vue-router'
import {useStore} from "vuex";

export default defineComponent({

  name: 'user-form',

  setup() {
    const user = useUser()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const tabPaneIndex: Ref<string> = ref('account')
    const state = reactive({
      images: [],
      form: {
        user_id: route.query.id as string || ''
      },
      dynamicForm1: [
        {
          label: '账号', value: '', type: 'input', field: 'account',
          remark: '（仅限英文字母和数字的组合，且以英文字母开头）', disabled: false
        },
        {label: '密码', value: '', type: 'password', field: 'password'},
        {
          label: '状态', value: 1, type: 'radio', field: 'status', options: [
            {label: '使用', value: 1},
            {label: '禁用', value: 2}
          ]
        },
      ],
      dynamicForm2: [
        {label: '头像', value: '', field: 'avatar', type: 'file'},
        {label: '真实姓名', value: '', field: 'real_name', type: 'input'},
        {label: '昵称', value: '', field: 'nick_name', type: 'input'},
        {
          label: '性别', value: 1, field: 'gender', type: 'radio',
          options: [
            {label: '男', value: 1},
            {label: '女', value: 2},
            {label: '保密', value: 3}
          ]
        },
        {label: '出生日期', value: '', field: 'birthday', type: 'date'},
        {label: '电话', value: '', field: 'mobile', type: 'input'},
        {label: '邮箱', value: '', field: 'email', type: 'input'},
      ]
    })


    const formSubmit = async () => {
      const form: Record<string, any> = state.form
      state.dynamicForm1.forEach(item => form[item.field] = item.value)
      state.dynamicForm2.forEach(item => form[item.field] = item.value)
      if (state.images.length) form.avatar = state.images[0]
      const res = await user.update(state.form)
      if (res.data.code === 0) toUserList(new Date().getTime())
    }

    const toUserList = (t?: number) => {
      if (t) store.dispatch('tbc/close', {tagName: route.fullPath})
      router.push(({name: 'user-list', params: {t}}))
    }

    const getUserInfo = async (userId?: string) => {
      if (!userId) return
      state.form.user_id = userId
      const res = await user.getInfo(state.form.user_id as string)
      if (res.data.code !== 0) return
      let data: any = res.data.data
      state.dynamicForm1.forEach(item => item.value = data[item.field])
      state.dynamicForm2.forEach(item => item.value = data[item.field])
      if (data.avatar) state.images = [data.avatar]
    }

    const onFileSelected = (files: { file_url: string }[]) => {
      state.images = [files[0].file_url]
    }

    onMounted(() => {
      getUserInfo(route.query.id as string)
    })

    onBeforeRouteUpdate(() => {
      getUserInfo(route.query.id as string)
    })

    return {
      ...toRefs(state),
      formSubmit,
      tabPaneIndex,
      toUserList,
      onFileSelected
    }
  }
})
</script>