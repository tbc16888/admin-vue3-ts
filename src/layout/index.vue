<template>
  <div class="layout fixed">
    <div class="layout-side" :style="{'width': leftWidth}">
      <layout-sidebar :mini="framework.collapse"/>
    </div>

    <div class="layout-main" style="padding-left: 220px;"
         :style="{'padding-left': leftWidth}">

      <!-- 顶部菜单 -->
      <div class="layout-header light fixed" :style="{'left': leftWidth}">
        <layout-header/>
      </div>

      <div class="layout-main-container" style="padding-top:60px;">
        <!-- 多页标签-->
        <div class="layout-tabs" style="position: fixed;top: 60px;right: 0;z-index: 99;background: #f5f7f9;"
             :style="{'left': leftWidth}">
          <layout-router-tabs/>
        </div>

        <div style="padding-top:44px;margin: 0 12px">
          <router-view v-slot="{ Component }">
            <keep-alive :include="keepAlive">
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </div>
      </div>


      <div class="footer" style="height: 60px;line-height: 60px">
        <div class="copyright">
          <p style="text-indent: 20px;font-size: 14px;color:#808695">© 2018 - tongbaochun.com</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, computed, defineAsyncComponent} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from "vue-router";

export default defineComponent({

  name: 'layout',

  components: {
    'layout-sidebar': defineAsyncComponent(() =>
        import('./components/sidebar/index.vue')),
    'layout-header': defineAsyncComponent(() =>
        import('./components/header/index.vue')),
    'layout-router-tabs': defineAsyncComponent(() =>
        import('./components/multiple-tabs/index.vue')),
  },

  setup() {
    const route = useRoute()
    const store = useStore()
    const framework = computed(() => store.getters.framework)
    const keepAlive = computed(() => store.state.tbc.keepAlive)
    const leftWidth = computed(() => (framework.value.collapse ? 70 : 220) + 'px')
    const routeKey = computed(() => route.fullPath)

    return {
      framework,
      keepAlive,
      routeKey,
      leftWidth
    }
  },
})
</script>
