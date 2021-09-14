<template>
  <div v-if="!sideMenuList.length && !framework.collapse" class="el-menu-none tbc-flex-col tbc-hover"
       style="align-items:center;justify-content:center;">
    <i class="el-icon-s-grid" style="font-size:30px"></i>
    <span class="el-menu-none-span">没有侧栏菜单</span>
  </div>

  <el-menu v-if="sideMenuList.length" @select="onMenuSelect" :collapse="framework.collapse" :default-active="routeName"
         :collapse-transition="false"  :unique-opened="true">
    <template v-for="(item, index) in sideMenuList" :key="index">
      <sub-menu v-if="item.children" :key="index" :menu="item"></sub-menu>
      <menu-item v-if="!item.children" :key="index" :menu="item"></menu-item>
    </template>
  </el-menu>
</template>
<script lang="ts">
import {defineComponent, ref, computed, defineAsyncComponent} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useStore} from 'vuex'

export default defineComponent({

  // name: 'side-menu',

  components: {
    MenuItem: defineAsyncComponent(() => import('./components/MenuItem.vue')),
    SubMenu: defineAsyncComponent(() => import('./components/SubMenu.vue')),
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const active = ref('')
    const framework = computed(() => store.state.framework)
    const sideMenu = computed(() => store.getters.sideMenu)
    const sideMenuIndex = computed(() => store.getters.sideMenuIndex)
    const routeName = computed(() => {
      console.log(route.matched, 'matched')
      return route.name
    })

    const sideMenuList = computed(() => {
      if (!sideMenu.value.length) return []
      console.log(route.matched)
      return sideMenu.value[0].children
      // if (route.matched.length > 0) {
      //   const _side = sideMenu.value.filter((item) => {
      //     return item.nameList.indexOf(route.matched[1].name) > -1 || item.nameList.indexOf(route.matched[0].name) > -1
      //   })
      //   return _side.length ? _side[0].children : []
      // }
      // return sideMenu.value[sideMenuIndex.value].children
    })


    // 点击按钮
    const onMenuSelect = (name) => {
      const data = sideMenuList.value.find((item) => {
        if (item.name === name) return item
        let findItem = null
        if (item.children) findItem = item.children.find(children =>
            children.name === name)
        if (findItem) return findItem
      })
      console.log(data, name, sideMenuList)
      if (data === null) return
      if (data.path) return router.push({path: data.path});
      if (data.name.indexOf('@#') < 0) {
        const route = {name}
        return router.push(route);
      }
    }


    return {
      framework,
      active,
      sideMenu,
      sideMenuIndex,
      sideMenuList,
      onMenuSelect,
      routeName
    }
  },
})
</script>