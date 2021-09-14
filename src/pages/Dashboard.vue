<template>
  <container title="控制面板" tips="欢迎回来，喝杯咖啡提提神">
<!--    <el-row :gutter="20" style="margin-left:0">-->
<!--      <el-col :xs="12" :sm="8" :md="8" v-for="(item, index ) in todaySurvey" :key="index">-->
<!--        <div style="margin-bottom: 10px">-->
<!--          <div style="padding: 40px 20px;color: #FFF;border-radius:6px;" :style="item.style">-->
<!--            <h2 style="font-size: 20px;font-weight: bold;">{{ item.value }}</h2>-->
<!--            <span style="font-size: 14px;">{{ item.label }}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-input v-model="value" />
  </container>
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'

export default defineComponent({

  name: 'dashboard',

  setup() {

    const state = reactive({

    })

    return {
      ...toRefs(state)
    }
  }
})
</script>