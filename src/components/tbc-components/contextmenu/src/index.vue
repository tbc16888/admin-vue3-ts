<template>
  <teleport to="body">
    <div class="tbc-context-menu" v-show="visible" :style="style" ref="el">
      <slot>
        <div class="tbc-context-menu-list" @click="onMenuItemClick">
          <div v-for="(item) in menu" :key="item.value" :data-value="item.value" class="tbc-context-menu-item">
            <div>{{ item.title }}</div>
          </div>
        </div>
      </slot>
    </div>
  </teleport>
</template>

<script lang="ts">
import {defineComponent, ref, computed, Ref, PropType} from 'vue'

interface ComponentProps {
  x: number,
  y: number,
  menu?: Menu[]
}

interface Menu {
  title: string,
  value: string
}

export default defineComponent({

  name: 'tbc-context-menu',

  emits: ['click'],

  props: {

    x: {
      type: Number,
      default: 0
    },

    y: {
      type: Number,
      default: 0
    },

    menu: {
      type: Array as PropType<Menu[]>,
      default() {
        return []
      }
    }
  },


  setup(props: any, {emit}) {

    const el: Ref = ref(null)
    const contextMenuX = ref(0)
    const contextMenuY = ref(0)
    const visible = ref(false)

    const watchContextmenu = (event: MouseEvent) => {
      if (!el.value.contains(event.target) || event.button !== 0) close()
      window.removeEventListener('mousedown', watchContextmenu)
    }

    const show = () => {
      visible.value = true
      window.addEventListener('mousedown', watchContextmenu)
    }

    const close = () => {
      visible.value = false
    }

    const onMenuItemClick = (event) => {
      let target = event.target
      while (!target.dataset.value) {
        target = target.parentNode
      }
      emit('click', target.dataset.value)
      close()
    }

    const style = computed(() => {
      return {
        left: (props.x || contextMenuX.value) + 'px',
        top: (props.y || contextMenuY.value) + 'px',
        display: visible.value ? 'block' : 'none'
      }
    })

    const active = (event: MouseEvent, offset?: number) => {
      event.preventDefault()
      event.stopPropagation()
      contextMenuX.value = event.clientX - (offset || 0)
      contextMenuY.value = event.clientY
      show()
    }

    return {
      el,
      style,
      show,
      close,
      onMenuItemClick,
      active,
      visible
    }
  },
})
</script>

<style scoped>
.tbc-context-menu {
  position: fixed;
  padding: 5px 0;
  z-index: 2018;
  background: #FFF;
  border: 1px solid #cfd7e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.tbc-context-menu-item {
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  margin: 0;
  padding: 8px 20px 8px 15px;
}

.tbc-context-menu-item:hover {
  background: #ecf5ff;
  color: #66b1ff;
}
</style>