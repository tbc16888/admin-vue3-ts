<template>
  <container title="工作台" tips="欢迎回来，喝杯咖啡提提神">
    <template #tips>
      <div class="tbc-flex-row" style="padding-bottom: 20px">
        <div style="margin-right: 16px">
          <img src="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
               style="width:72px;height:72px;border-radius: 50%"/>
        </div>
        <div class="tbc-flex-col" style="justify-content: center">
          <div style="font-size: 20px;font-weight: 500;margin-bottom: 12px">早安，吴彦祖，祝你开心一天</div>
          <p style="color: #808695;font-size: 14px"> 今日阴转小雨，22℃ - 32℃，出门记得带伞哦。</p>
        </div>
      </div>
    </template>


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
    <el-input v-model="value"/>
  </container>
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'

export default defineComponent({

  name: 'workplace',

  setup() {
    const state = reactive({})
    return {
      ...toRefs(state)
    }
  }
})
</script>