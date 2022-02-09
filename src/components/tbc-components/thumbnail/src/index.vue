<template>
  <div class="thumbnail-list" style="display: flex;flex-direction: row;">
    <draggable v-model="images" v-bind="dragOptions" item-key="id" @end="onDragEnd" style="display: flex;flex-direction: row">
      <template #item="{element, index}">
        <div class="thumbnail-item draggable" :key="element.id" :style="style">
          <img class="thumb" :src="element.value">
          <div class="actions">
            <el-icon @click="showPreview(index)">
              <zoom-in/>
            </el-icon>
            <el-icon v-if="!readonly" @click.stop="remove(index)">
              <delete/>
            </el-icon>
          </div>
        </div>
      </template>
    </draggable>

    <div class="thumbnail-item" v-if="!readonly && images.length < max" @click="upload" :style="style">
      <el-icon style="font-size: 30px;color: #8c939d">
        <plus/>
      </el-icon>
      <i class="plus upload reset"></i>
    </div>
  </div>
  <image-viewer ref="viewer"/>
</template>
<script lang="ts">

import {defineComponent, reactive, toRefs, watch, Ref, ref} from 'vue'
import Draggable from 'vuedraggable'
import ImageViewer from '../../image-viewer/src/index.vue'
import buildGuid from './tools'

export default defineComponent({

  name: 'tbc-thumbnail',

  emits: ['upload', 'update:modelValue'],

  components: {
    Draggable,
    ImageViewer
  },

  props: {

    modelValue: {
      type: [Array, String],
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

    readonly: {
      type: Boolean,
      default() {
        return false
      }
    }
  },

  setup(props: Record<string, any>, {emit}) {

    const viewer: Ref = ref(null)
    const state = reactive({
      style: '',
      images: []
    })

    const buildImagesData = () => {
      const imageList: { id: string, value: string }[] = []
      let source = props.modelValue
      if (typeof props.modelValue === 'string') source = [props.modelValue]
      source = source.splice(0, props.max)
      source.forEach((item: string, index: number) => {
        imageList.push({
          id: buildGuid(),
          value: item
        })
      });
      (state.images as { id: string, value: string }[]) = imageList
    }

    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const buildBoxSize = () => {
      const aStyle: string[] = []
      aStyle.push('width: ' + props.width)
      aStyle.push('height: ' + props.height)
      return aStyle.join(';')
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

    const showPreview = (index: number) => {
      viewer.value.show(state.images.map(item => item.value), index)
    }


    watch(() => props.modelValue, function (newVal, oldVal) {
      if (newVal.length === oldVal.length) return
      buildImagesData()
    }, {
      deep: true
    })


    state.style = buildBoxSize()
    return {
      ...toRefs(state),
      dragOptions,
      upload,
      remove,
      onDragEnd,
      viewer,
      showPreview
    }
  }
})
</script>
<style scoped="upload">
.thumbnail-item {
  overflow: hidden;
  margin: 0 8px 0 0;
  position: relative;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-item .thumb {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.thumbnail-item .upload {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.thumbnail-item .actions {
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

.thumbnail-item .actions:hover {
  opacity: 1
}
.thumbnail-item .actions:hover i {
  color: #FFF;
  cursor: pointer;
}

.thumbnail-item .status {
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

.thumbnail-item:hover .status {
  display: none
}

.thumbnail-item .actions:after {
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