<template>
  <div class="pagination" style="display: flex;flex-direction: row;align-items: center;">
    <div style="flex: 1;">
      <slot name="left"></slot>
    </div>
    <div>
      <slot name="right"></slot>
    </div>

    <el-pagination
        background
        :page-sizes="pageSizes"
        @size-change="changeSize"
        @current-change="changePage"
        :page-size="config.size"
        :current-page="config.page"
        :layout="layout"
        :total="total">
    </el-pagination>
  </div>
</template>
<script lang="ts">
import {defineComponent, computed, PropType} from 'vue'


interface Config {
  page: number,
  size: number
}
interface ComponentProp {
  total: number,
  config: Config,
  simple: boolean,
  sizes?: PropType<number[]>
}

export default defineComponent({

  name: 'tbc-pagination',

  props: {

    total: {
      type: Number,
      default: 0
    },

    config: {
      type: Object,
      default() {
        return {
          page: 1,
          size: 10
        }
      }
    },

    pageSizes: {
      type: Array as PropType<number[] | unknown>,
      default() {
        return [5, 10, 30, 50, 100]
      }
    },

    simple: {
      type: Boolean,
      default: false
    }
  },

  emits: ['change'],

  setup(props: any, {emit}) {

    const layout = computed((): string => {
      if (props.simple) return 'prev, next'
      return 'total, sizes, prev, pager, next, jumper'
    })

    const changeSize = (size: number): void => {
      change(1, size)
    }

    const changePage = (page: number): void => {
      change(page, props.config.size)
    }

    const change = (page: number, size: number): void => {
      emit('change', page, size)
    }

    return {layout, changePage, changeSize}
  }
})
</script>