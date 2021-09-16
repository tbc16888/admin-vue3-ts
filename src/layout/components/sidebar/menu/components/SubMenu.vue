<template>
  <el-sub-menu :index="menu.name">
    <template #title>
      <i class="iconfont" :class="menu.icon" v-if="menu.icon"></i>
      <span>{{menu.title}}</span>
    </template>
    <template v-for="(item, index) in menu.children" :key="index">
      <menu-item :menu="item" v-if="!item.children" />
      <sub-menu :menu="item" v-if="item.children" />
    </template>
    <!-- <sub-menu v-if="menu.children" :menu="menu"></sub-menu> -->


    <!-- <el-menu-item-group>
      <template #title>分组一</template>
      <el-menu-item index="1-1">选项1</el-menu-item>
      <el-menu-item index="1-2">选项2</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="分组2">
      <el-menu-item index="1-3">选项3</el-menu-item>
    </el-menu-item-group> -->
  </el-sub-menu>
</template>
<script>
  import MenuItem from './MenuItem'
  import SubMenu from './SubMenu'
  export default {
    components: {
      MenuItem,
      SubMenu
    },

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