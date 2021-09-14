<template>
  <el-cascader :props="elProps" v-model="selectValue" ref="selector"
               clearable
               @change="changeModelValue"></el-cascader>
</template>
<script lang="ts">
import {defineComponent, reactive, PropType, ref, Ref, watch} from 'vue'
import {ElCascader} from 'element-plus'
import http from '@/plugin/http'

interface ComponentProps {
  value: string | [],
  api: string,
  field: string,
  leaf: string,
  level?: number | string,
  checkStrictly: boolean,
  multiple: boolean
}

export default defineComponent({

  name: 'tbc-selector',

  props: {

    modelValue: {
      type: Array as PropType<string[]>,
      default() {
        return []
      }
    },

    api: {
      type: String,
      default: ''
    },

    field: {
      type: String,
      default: 'pid'
    },

    leaf: {
      type: String,
      default: 'leaf'
    },

    init: {
      type: Array,
      default() {
        return []
      }
    },

    level: {
      type: [String, Number],
      default: 99
    },

    checkStrictly: {
      type: Boolean,
      default: false
    },

    multiple: {
      type: Boolean,
      default: false
    }
  },

  emits: ['changeLabel', 'update:modelValue'],

  setup(props: any, {emit}) {

    let tmpNode = {loading: false}
    let lastValue = ''
    let pathLabel: string[] = []
    const selectValue = ref<string[]>([])
    // eslint-disable-next-line vue/no-setup-props-destructure
    selectValue.value = props.modelValue
    const selector: Ref = ref(null)
    const elProps = reactive({
      lazy: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      lazyLoad: function (node, resolve) {
        if (tmpNode.loading) return
        tmpNode = node
        if (node.level > 0) lastValue = node.data.value
        _requestData((data) => {
          if (node.level >= Number(props.level) - 1) {
            data.forEach(item => item.leaf = true)
          }
          resolve(data)
        })
      },
      node: {loading: false},
      checkStrictly: props.checkStrictly,
      multiple: props.multiple
    })


    // 请求数据
    const _requestData = async (resolve) => {
      let params: Record<string, string | number> = {}
      params.size = 1000000
      params[props.field] = lastValue
      const res = await http.get(props.api, params)
      if (res.data.code !== 0) return
      let dataList = res.data.data.list;
      dataList.forEach(item => item.leaf = !item[props.leaf])
      resolve(dataList)
    }

    const changeModelValue = (val): void => {
      const checkedNodes = selector.value.panel.checkedNodes
      let pathLabel = []
      if (checkedNodes.length) pathLabel = checkedNodes[0].pathLabels
      emit('update:modelValue', val)
      emit('changeLabel', pathLabel)
    }

    watch(() => props.modelValue, function (val) {
      selectValue.value = val as string[]
    })

    return {
      elProps,
      selector,
      selectValue,
      changeModelValue
    }
  }
})
</script>