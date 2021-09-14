<template>
  <el-menu-item :index="menu.name">
    <i class="iconfont" :class="menu.icon" v-if="menu.icon"></i>
    <template #title>
      <span>{{menu.title}}</span>
    </template>
  </el-menu-item>
</template>
<script>
  export default {
    props: {
      menu: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>