<template>
  <slot name="header" v-if="title || tips">
    <div class="v-header"
         style="overflow: hidden;margin:0 -12px;background: #FFF;border-bottom:1px solid #e8eaec;padding: 16px 32px 0 20px;">
      <div style="display:inline-block;color:#17233d;font-weight:500;font-size:20px;margin-bottom: 16px;">{{ title }}
      </div>
      <slot name="tips">
        <div style="font-size: 14px;margin-bottom: 16px;" v-if="tips">{{ tips }}</div>
      </slot>
    </div>
  </slot>

  <div class="v-middle" style="padding-top: 16px;    height: auto;
    min-height: 100%;">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({

  name: 'container',

  props: {
    title: {
      type: String,
      default: ''
    },

    tips: {
      type: String,
      default: ''
    }
  }
})
</script>