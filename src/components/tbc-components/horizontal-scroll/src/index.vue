<template>
  <div ref="page" class="is-scrollable tbc-flex-row" style="position: relative;
      padding: 0 20px;">
    <div class="tbc-flex-row tbc-hover" style="align-items: center" @click="scroll('left')" v-if="isScroll">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div ref="contentPanel" style="overflow: hidden" class="tbc-flex-row">
      <div ref="scrollPanel"
           style="white-space:nowrap;position:relative;-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s;float:left;flex-shrink: 0;-webkit-box-flex: 0;"
           :style="scrollStyle">
        <slot></slot>
      </div>
    </div>
    <div class="tbc-flex-row tbc-hover" style="align-items: center" @click="scroll('right')" v-if="isScroll">
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>
<script lang="ts">
import {throttle} from "lodash";
import {ref, computed, onMounted, onBeforeUnmount, defineComponent, Ref} from 'vue'

export default defineComponent({

  name: 'tbc-horizontal-scroll',

  setup() {
    const contentPanel: Ref = ref(null)
    const scrollPanel: Ref = ref(null)
    const isScroll = ref(false)
    let scrollWidth = 0
    let contentWidth = 0

    const currentTranslateX = ref(0)
    const scrollStyle = computed(() => 'transform: ' + `translateX(${currentTranslateX.value}px)`)

    const scroll = (direction) => {
      if (direction === 'left') {
        // 向右滚动
        currentTranslateX.value = 0
      } else {
        // 向左滚动
        if (contentWidth * 2 - currentTranslateX.value <= scrollWidth) {
          currentTranslateX.value = currentTranslateX.value - contentWidth
        } else {
          currentTranslateX.value = contentWidth - scrollWidth
        }
      }
      console.log(currentTranslateX.value)
    }

    const checkScroll = () => {
      contentWidth = contentPanel.value.clientWidth
      scrollWidth = scrollPanel.value.clientWidth
      if (isScroll.value) {
        // 页面依旧允许滚动的情况，需要更新width
        if (contentWidth - scrollWidth === currentTranslateX.value) {
          // currentTranslateX.value 也需要相应变化【在右端到头的情况时】
          currentTranslateX.value = contentWidth - scrollWidth
          // 快速的滑动依旧存在判断和计算时对应的contentWidth变成正数，所以需要限制一下
          if (currentTranslateX.value > 0) {
            currentTranslateX.value = 0
          }
        }
        // 更新元素数据
        // 判断何时滚动消失: 当scroll > content
        if (contentWidth > scrollWidth) {
          isScroll.value = false
        }
      }

      // 判断何时滚动出现: 当scroll < content
      if (!isScroll.value && contentWidth < scrollWidth) {
        isScroll.value = true
        // 注意，当isScroll变为true，对应的元素盒子大小会发生变化
        setTimeout(() => {
          contentWidth = contentPanel.value.clientWidth
          scrollWidth = scrollPanel.value.clientWidth
          currentTranslateX.value = 0
        }, 50)
      }
    }


    const throttledCheckScroll = throttle(checkScroll, 300)
    onMounted(() => {
      // 初始化判断
      // 默认判断父元素和子元素的大小，以确定初始情况是否显示滚动
      window.addEventListener('load', checkScroll)
      // 全局窗口变化监听，判断父元素和子元素的大小，从而控制isScroll的开关
      window.addEventListener('resize', throttledCheckScroll)
    })

    onBeforeUnmount(() => {
      // 取消监听
      window.removeEventListener('resize', throttledCheckScroll)
      window.removeEventListener('load', checkScroll)
    })

    return {
      isScroll,
      scrollWidth: 0,
      contentWidth: 0,
      currentTranslateX,
      throttledCheckScroll: null,
      scroll,
      contentPanel,
      scrollPanel,
      scrollStyle
    }
  },
})
</script>