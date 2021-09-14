<template>
  <container>
    <div class="v-middle b">
      <div class="layout__grid layout__border">
        <user-info-panel ref="panel"/>
      </div>
    </div>
  </container>
</template>
<script>


export default {

  name: 'user-info',

  components: {
    userInfoPanel: () => import('./components/UserInfoPanel')
  },

  data() {
    return {
      userInfo: {user_id: ''},
    }
  },

  mounted() {
    this.loadDataInfo()
  },
  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    next(instance => {
      instance.userInfo.user_id = to.query.id
      instance.loadDataInfo()
    })
  },

  // 在同一组件对应的多个路由间切换时触发
  beforeRouteUpdate(to, from, next) {
    this.userInfo.user_id = to.query.id
    this.loadDataInfo()
    next()
  },

  methods: {
    loadDataInfo() {
      setTimeout(() => {
        this.$refs.panel.init(this.userInfo)
      }, 100)
    }
  }
}
</script>