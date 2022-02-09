<template>
  <teleport to="body">
    <el-image style="width:0; height:0;" :src="src" :preview-src-list="srcList" ref="image" :z-index="zIndex" :initial-index="initialIndex">
    </el-image>
  </teleport>
</template>
<script lang="ts">
import {defineComponent, ref, Ref} from 'vue'
import {ElImage} from 'element-plus'

export default defineComponent({

  name: 'tbc-image-viewer',

  components: {
    ElImage
  },

  props: {
    zIndex: {
      type: Number,
      default: 2000
    }
  },

  setup() {
    const image: Ref = ref(null)
    const src = ref('')
    const srcList = ref([])
    const initialIndex = ref(0)
    const show = (data: string[], index: number) => {
      console.log('huiddd', data)
      src.value = data[index]
      initialIndex.value = index
      srcList.value = data
      setTimeout(() => {
        image.value.clickHandler()
      }, 60)
    }
    return {
      src,
      srcList,
      initialIndex,
      show,
      image
    }
  }
})
</script>