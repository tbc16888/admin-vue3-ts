<template>

  <div style="margin: 0 12px;padding: 6px 50px 6px 0;position: relative">
    <el-tabs type="card" v-model="current" @contextmenu.prevent="onTabContextMenu"
             @tab-click="handleTabClick" @edit="handleTabEdit">
      <el-tab-pane v-for="(route, index) in opened" :key="route.fullPath" :label="route.meta.title || '未命名'"
                   :name="route.fullPath" :closable="index > 0">
      </el-tab-pane>
    </el-tabs>
    <el-button size="small" icon="el-icon-arrow-down"
               style="padding:0;border:0;width: 32px;position: absolute;right: 0;top:50%;margin-top: -16px"
               @click="showContextMenu"></el-button>
  </div>
  <tbc-context-menu :menu="contextMenuList" ref="contextMenu"
                    @click="onContextMenuClick"/>
</template>
<script lang="ts">
import {defineComponent, computed, reactive, ref, Ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'

export default defineComponent({

  setup() {
    const store = useStore()
    const contextMenu: Ref = ref(null)
    const state = reactive({
      tagName: ''
    })
    const contextMenuList = [
      {icon: 'el-icon-refresh', title: '刷新页面', value: 'refresh'},
      {icon: 'arrow-left', title: '关闭左侧', value: 'left'},
      {icon: 'arrow-right', title: '关闭右侧', value: 'right'},
      {icon: 'times', title: '关闭其它', value: 'other'},
      {icon: 'times-circle', title: '关闭全部', value: 'all'}
    ]

    const opened = computed(() => store.state.tbc.opened)
    const current = computed(() => store.state.tbc.current)

    const router = useRouter()
    const route = useRoute()

    // 选项卡点击
    const handleTabClick = (tab) => {
      const page = opened.value.find(page => page.fullPath === tab.props.name)
      const {name, params, query} = page
      if (page && route.fullPath !== tab.name) {
        router.push({name, params, query})
      }
    }

    // 选项卡编辑
    const handleTabEdit = (tagName, action) => {
      if (action === 'remove') {
        store.dispatch('tbc/close', {tagName}).then((routes) => {
          if (routes) router.push(routes)
        })
      }
    }

    // 选项卡右键点击
    const onTabContextMenu = (event) => {
      let target = event.target;
      let flag = false;
      if (target.className.indexOf('el-tabs__item') > -1) {
        flag = true;
      } else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode
        flag = true
      }
      if (!flag) return;
      event.preventDefault()
      event.stopPropagation()
      state.tagName = target.getAttribute('aria-controls').slice(5)
      contextMenu.value.active(event)
    }

    // 右键菜单被点击
    const onContextMenuClick = (command: string) => {
      if (command === 'left') {
        store.dispatch('tbc/closeLeft', {tagName: state.tagName}).then((routes) => {
          if (routes) router.push(routes)
        })
      }
      if (command === 'right') {
        store.dispatch('tbc/closeRight', {tagName: state.tagName}).then((routes) => {
          if (routes) router.push(routes)
        })
      }
      if (command === 'other') {
        store.dispatch('tbc/closeLeft', {tagName: state.tagName}).then((r1) => {
          let routes = r1
          store.dispatch('tbc/closeRight', {tagName: state.tagName}).then((r2) => {
            routes = r2 || routes
            if (routes) router.push(routes)
          })
        })
      }
      if (command === 'all') {
        store.dispatch('tbc/closeAll').then((routes) => {
          if (routes) router.push(routes)
        })
      }
    }

    const showContextMenu = (e) => {
      state.tagName = route.fullPath
      contextMenu.value.active(e, 100)
    }


    return {
      opened,
      current,
      handleTabClick,
      handleTabEdit,
      onTabContextMenu,
      contextMenu,
      contextMenuList,
      onContextMenuClick,
      showContextMenu
    }
  }
})
</script>
<style>
.layout-tabs .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 0;
}

.layout-tabs .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: 0;
}

.layout-tabs .el-tabs--card > .el-tabs__header {
  border: 0;
  margin: 0;
}

.layout-tabs .el-tabs__item {
  background: #fff;
  border-radius: 3px;
  border: none;
  margin-right: 6px;
  color: #808695;
  height: 32px;
  font-weight: normal;
  line-height: 32px;
}

.layout-tabs .el-tabs__nav-next,
.layout-tabs .el-tabs__nav-prev {
  line-height: 32px;
}
</style>