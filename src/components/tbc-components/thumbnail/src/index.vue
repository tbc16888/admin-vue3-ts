<template>
  <div class="album" style="display: flex;flex-direction: row">
    <draggable v-model="images" v-bind="dragOptions" tag="div" :component-data="{
          tag: 'div',
        }" item-key="id" @end="onDragEnd">
      <template #item="{element, index}">
        <div class="upload-item draggable" :key="element.id" :style="style">
          <img class="thumb" :src="element.value">
          <div class="actions">
            <span><i class="el-icon-zoom-in" @click="$refs.viewer.show(modelValue, index)"></i></span>
            <span v-if="showRemove"><i class="el-icon-delete" @click.stop="remove(index)"></i></span>
          </div>
        </div>
      </template>
    </draggable>

    <div class="upload-item" v-if="images.length < max" @click="upload" :style="style">
      <i class="el-icon-plus upload reset"></i>
    </div>
    <image-viewer ref="viewer"/>
  </div>
</template>
<script lang="ts">

import {defineComponent, reactive, toRefs, PropType, ref, watch, Ref} from 'vue'
import Draggable from 'vuedraggable'
import ImageViewer from '../../image-viewer/src/index.vue'
// interface ComponentProps {
//   width: number | string,
//   height: number | string,
// }

export default defineComponent({

  name: 'tbc-thumbnail',

  components: {
    Draggable,
    ImageViewer
  },

  props: {

    modelValue: {
      type: Array as PropType<string[]>,
      default() {
        return []
      }
    },

    max: {
      type: Number,
      default: 1
    },

    width: {
      type: String,
      default: '150px'
    },

    height: {
      type: String,
      default: '120px'
    },

    showRemove: {
      type: Boolean,
      default() {
        return true
      }
    }
  },

  setup(props: Record<string, any>, {emit}) {

    const state = reactive({
      style: '',
      images: []
    })

    const buildImagesData = () => {
      const imageList: { id: number, value: string }[] = []
      props.modelValue.forEach((item: string) => {
        // (state.images as { [k: string]: string | number }[])
        imageList.push({
          id: new Date().getTime(),
          value: item
        })
      });
      (state.images as { id: number, value: string }[]) = imageList
    }


    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const buildBoxSize = () => {
      let aStyle: string[] = []
      aStyle.push('width: ' + props.width)
      aStyle.push('height: ' + props.height)
      return aStyle.join(";")
    }

    const upload = () => {
      emit('upload')
    }

    const onDragEnd = (): void => {
      const images: string[] = []
      state.images.forEach((item: { value: string }) => images.push(item.value))
      emit('update:modelValue', images)
    }

    const remove = (index: number) => {
      state.images.splice(index, 1)
      onDragEnd()
    }


    watch(() => props.modelValue, function (newVal, oldVal) {
      if (newVal.length === oldVal.length) return
      buildImagesData()
    })


    state.style = buildBoxSize()
    return {
      ...toRefs(state),
      dragOptions,
      upload,
      remove,
      onDragEnd
    }
  }
})
</script>
<style scoped="upload">
.upload-item {
  overflow: hidden;
  box-sizing: border-box;
  width: 150px;
  height: 150px;
  margin: 0 8px 0 0;
  display: inline-block;
  position: relative;
  border-radius: 4px;
}

.upload-item .thumb {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.upload-item .upload {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  color: #8c939d;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 28px;
  display: inline-block;
}

.upload-item .actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s;
}

.upload-item .actions:hover {
  opacity: 1
}

.upload-item .actions:hover span {
  color: #FFF;
  cursor: pointer;
  display: inline-block;
}

.upload-item .status {
  position: absolute;
  right: -15px;
  top: -6px;
  width: 40px;
  height: 24px;
  background: #13ce66;
  text-align: center;
  transform: rotate(45deg);
  box-shadow: 0 0 1pc 1px rgba(0, 0, 0, .2);
}

.upload-item:hover .status {
  display: none
}

.upload-item .actions:after {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}

.reset.el-icon-plus:before {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -14px;
  margin-left: -14px;
}
</style>