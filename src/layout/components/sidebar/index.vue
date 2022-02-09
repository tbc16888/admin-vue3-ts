<template>
  <div class="sidebar" style="position:relative;height:100%;">
    <div style="height:60px;width:100%;text-align: center;background:inherit;">
      <img src="https://d2.pub/d2-admin/preview/image/theme/d2/logo/all.png"
           style="height:60px;" v-show="!mini"/>
      <img src="https://d2.pub/d2-admin/preview/image/theme/d2/logo/icon-only.png"
           style="height:60px;" v-show="mini"/>
    </div>

    <div class="hide-scrollbar" style="position:absolute;top:60px;bottom:0;width:100%;overflow-y:auto;">
      <side-menu/>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import menu from './menu/index.vue'

export default defineComponent({

  name: 'side-menu-list',

  components: {
    'side-menu': menu
  },

  props: {
    mini: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style>
.el-submenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 45px;
  min-width: 200px;
}
.el-sub-menu__title{
  display: block;
}
.el-menu-item i,
.el-sub-menu__title i {
  margin-right: 8px;
}
.el-menu--collapse i{
  margin-right: 0;
}
.el-menu-none {
  height: 160px;
  margin: 0 10px 10px;
  border-radius: 4px;
  /*color: #FFF;*/
  /*background: linear-gradient(180deg, hsla(0, 0%, 100%, .28), hsla(0, 0%, 100%, 0));*/

}

.el-menu-none:hover {
  /*background: linear-gradient(180deg, hsla(0, 0%, 100%, .28), hsla(0, 0%, 100%, 0));*/
  /*color: #F5F5F5;*/
}
</style>