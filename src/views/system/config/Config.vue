<template>
  <container title="系统配置">
    <div class="main-card" v-loading="loading">
      <el-tabs v-model="tabIndex">
        <el-tab-pane v-for="(item, index) in tabList"
                     :label="item.label" :name="item.name" :key="index">
          <div style="height: 20px"></div>
          <tbc-dynamic-form :form="item.form" class="compact"/>
        </el-tab-pane>
      </el-tabs>


      <!--      <tbc-dynamic-form :form="dynamicForm" class="compact">-->

      <!--      </tbc-dynamic-form>-->

      <div style="margin-top: 20px">
        <!--        <el-affix position="bottom" :offset="20" ref="affix">-->
        <el-button type="primary" @click="formSubmit" icon="el-icon-edit">保存</el-button>
        <el-button type="info" @click="getSystemSetting" icon="el-icon-refresh">刷新</el-button>
        <!--        </el-affix>-->
      </div>
    </div>
  </container>
</template>
<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from 'element-plus'
import TbcDynamicForm from "@/components/tbc-components/dynamic-form/src/index.vue";

export default defineComponent({
  name: 'system-config',
  components: {TbcDynamicForm},
  setup() {

    const state = reactive({
      dynamicForm: [],
      tabList: [],
      tabIndex: 'base',
      loading: false
    })
    // 获取系统配置
    const getSystemSetting = async () => {
      state.loading = true
      const res = await http.get('/system/getConfig')
      state.loading = false
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      const tabList: Record<string, string | []>[] = []
      const tabForm: Record<string, any> = {}

      res.data.data.forEach(item => {
        if (!tabForm[item.parent_code]) tabForm[item.parent_code] = {form: []}
        if (item.type !== 'tab') tabForm[item.parent_code].form.push(item)
        if (item.type === 'tab') {
          tabList.push({
            label: item.label, name: item.code,
            dynamicForm: []
          })
        }
      })
      tabList.forEach(item => {
        if (tabForm[item.name as string]) item.form = tabForm[item.name as string].form
      })
      state.tabList = tabList as any
      state.dynamicForm = res.data.data
      console.log(res.data.data)
    }

    // 保存
    const formSubmit = async () => {
      const form: Record<string, string | number> = {}
      // state.dynamicForm.forEach(item => form[item.code] = item.value)
      state.tabList.forEach((tab: any) => {
        tab.form.forEach(item => form[item.code] = item.value)
      })
      state.loading = true
      const res = await http.post('/system/setConfig', form)
      state.loading = false
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      ElMessage.success(res.data.message)
    }

    onMounted(getSystemSetting)

    return {
      ...toRefs(state),
      formSubmit, getSystemSetting
    }
  }
})
</script>