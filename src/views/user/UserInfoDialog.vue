<template>
  <tbc-dialog title="用户详情" ref="dialog" width="900px" basic>
    <user-info-panel ref="info"/>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, defineAsyncComponent, Ref, ref} from 'vue'

export default defineComponent({
  name: 'user-info',

  components: {
    UserInfoPanel: defineAsyncComponent(() =>
        import('./components/UserInfoPanel.vue')
    )
  },

  setup() {

    const dialog: Ref = ref(null)
    const info: Ref = ref(null)
    const show = (data: { user_id: string }): void => {
      dialog.value.show()
      setTimeout(() => info.value.init(data), 100)
    }


    const close = (): void => {
      dialog.value.close()
    }

    return {
      dialog,
      show,
      info,
      close
    }
  },

  //
  // methods: {
  //
  //   show(data) {
  //     this.$refs.dialog.show()
  //     setTimeout(() => {
  //       this.$refs.panel.init(data)
  //     }, 100)
  //   },
  //
  //   close() {
  //     this.$refs.dialog.close()
  //   },
  // }
})
</script>
