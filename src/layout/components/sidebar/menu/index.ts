import { useStore } from 'vuex'
import { elMenuItem, elSubmenu } from './libs/util.menu'
import {reactive, computed, h, ref} from 'vue'

export default {

  name: 'side-menu',

  setup() {
    const store = useStore()
    const active = ref('')
    const sideMenu = computed(() => store.getters.sideMenu)
    console.log(sideMenu.value, "+++++++++++++++")
    const sideMenuIndex = computed(() => store.getters.sideMenuIndex)
    const sideMenuList = computed(() => {
      if (!sideMenu.value.length) return []
      return sideMenu.value[sideMenuIndex.value].routes
    })
    console.log(sideMenu.value[sideMenuIndex.value])
    console.log(sideMenuIndex.value)
    sideMenuList.value.forEach(element => {
      console.log(element.label)
    });

    const onMenuSelect = () => {
      console.log('onMenuSelect')
    }

    const framework = computed(() => store.getters.framework)
    store.state.sideMenuIndex = 4

    console.log(sideMenuList.value.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, h, menu)))
    console.log(sideMenuList.value)
    const a = 1
    if (a == 1) {
      return () => {
        return h('div', {
          class: 'hello'
        }, [
          h("el-menu", {
            class: 'el-menu',
          }, sideMenuList.value.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, h, menu))),
        ])
      }
    }



    return () => {
      h('div', { attrs: { class: 'hello' } }, [
        h('el-menu', {
          props: {
            collapse: framework.value.collapse,
            uniqueOpened: true,
            defaultActive: active,
            collapseTransition: false,
          },
          ref: 'menu',
          on: {
            select: onMenuSelect
          },
        }, sideMenuList.value.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, h, menu))),
        ...sideMenuList.value.length === 0 && !framework.value.collapse ? [
          h('div', {
            attrs: {
              class: 'el-menu-none tbc-flex-col tbc-hover',
              style: 'align-items:center;justify-content:center;',
            }
          }, [
            h('i', {
              class: 'el-icon-s-grid',
              style: 'font-size:30px'
            }, ''),
            h('span', {
              class: 'el-menu-none-span'
            }, '没有侧栏菜单')
          ])
        ] : []
      ])
    }
  },




  // watch: {
  //     // 监听路由 控制侧边栏激活状态
  //     '$route.name': {
  //         handler(value) {
  //             this.active = value
  //         },
  //         immediate: true
  //     }
  // },



  // methods: {
  //     // 点击按钮
  //     onMenuSelect(index) {
  //         const data = index
  //         if (data.indexOf('@#') < 0) {
  //             const route = { name: data }
  //             return this.$router.push(route)
  //         }
  //         this.$message({ message: '非路由菜单', type: 'warning' })
  //     }
  // }
}
