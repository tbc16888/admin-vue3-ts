<template>
  <container title="系统菜单">
    <template #tips>
      <div style="padding-bottom: 20px">
        <tbc-pagination :total="total" :config="{page, size}" simple @change="loadDataList">
          <template #left>
            <tbc-selector
                field="parent_id"
                v-model="menuPath"
                api="/system.menu"
                check-strictly
                style="width:240px;margin-right:10px;"
                @change="changePath"/>
          </template>
          <template #right>
            <el-button icon="plus" circle @click="$refs.form.show()"></el-button>
            <el-button icon="refresh" circle @click="loadDataList(page)"></el-button>
          </template>
        </tbc-pagination>
      </div>
    </template>

    <div class="main-card" v-loading="loading">
      <div class="data-container">
        <tbc-dynamic-table
            v-loading="loading"
            :data="dataList"
            :cols="[
            {type: 'selection', width: 55},
            // {label: '图标', prop: 'icon', type: 'image', width: 60, style: 'width:40px;height:40px;'},
            {label: '名称', prop: 'menu_name', width: 300},
            {label: '接口', prop: 'api', width: 300},
            {label: '排序', prop: 'sort_weight', align: 'center', width: 140},
            {label: '子菜单', prop: 'children', align: 'center', width: 140},
            {label: '状态', prop: 'status', type: 'switch', width: 200, align: 'center'},
            {label: '操作', width: 140, type: 'action', fixed: 'right',
            click: onButtonClick,
            button: [
                {label: '子菜单', type: 'text', code: 'children'},
                {label: '编辑', type: 'text', code: 'edit'},
                {label: '删除', type: 'text', code: 'delete'},
        ]}]">
          <template #cat_name="scope">
            <p>{{ scope.row.cat_id }}</p>
            <p>{{ scope.row.cat_name }}</p>
          </template>
          <template #api="scope">
            <p>
              <span>{{ scope.row.module }}</span>
              <span v-if="scope.row.controller">/{{ scope.row.controller }}</span>
              <span v-if="scope.row.action">/{{ scope.row.action }}</span>
            </p>
          </template>
        </tbc-dynamic-table>
      </div>
      <tbc-pagination :total="total" @change="loadDataList"/>
    </div>
  </container>
  <menu-form ref="form"/>
</template>
<script lang="ts">
import {
  defineComponent, onMounted, defineAsyncComponent,
  ref, Ref
} from 'vue'
import useMenu from './api/menu'

export default defineComponent({

  name: 'system-menu',

  components: {
    MenuForm: defineAsyncComponent(() =>
        import('./MenuForm.vue'))
  },

  setup() {

    const menu = useMenu()
    const form: Ref = ref(null)

    const onButtonClick = (data: { menu_id: string }, action: string) => {
      if (action === 'children') {
        menu.parentId.value = data.menu_id;
        (menu.menuPath.value as string[]) = [...menu.menuPath.value, data.menu_id]
        menu.loadDataList(1)
      }
      if (action === 'edit') form.value.show(data)
      if (action === 'delete') return menu.deleteDataItem(data)
    }

    const changePath = (data) => {
      menu.parentId.value = data ? data[data.length - 1] : ''
      menu.loadDataList(1)
    }

    onMounted(() => {
      menu.loadDataList(1)
    })

    return {
      ...menu,
      form,
      onButtonClick,
      changePath
    }
  }
})
</script>
