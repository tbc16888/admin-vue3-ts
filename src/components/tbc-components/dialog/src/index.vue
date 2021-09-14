<template>
  <el-dialog :title="title" v-model="dialogVisible" :append-to-body="true" :close-on-press-escape="closeOnPressEscape"
             :width="width" :close-on-click-modal="closeOnClickModal" @opened="opened" @close="close"
             :custom-class="customClass"
             :top="top">
    <slot></slot>

    <template v-slot:footer v-if="!basic">
      <div class="dialog-footer" style="text-align: right" >
        <slot name="footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="confirm" :loading="loading">确 定</el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {ref, defineComponent} from 'vue'

export default defineComponent({

  name: 'tbc-dialog',

  props: {

    title: {
      type: String,
      default: ''
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: false
    },

    width: {
      type: String,
      default: '50%'
    },

    basic: {
      type: Boolean,
      default: false
    },

    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: '10vh'
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['close', 'opened', 'confirm'],
  setup(props, {emit}) {

    const dialogVisible = ref(false)

    const show = () => {
      dialogVisible.value = true
    }

    const close = () => {
      dialogVisible.value = false
      emit('close')
    }

    const opened = () => {
      emit('opened')
    }

    const confirm = () => {
      emit('confirm')
    }

    return {

      dialogVisible,
      show,
      close,
      confirm,
      opened
    }
  }
})
</script>