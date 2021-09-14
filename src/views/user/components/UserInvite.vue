<template>
  <tbc-dialog title="邀请列表" ref="dialog" basic :close-on-click-modal="true" width="900px">
    <dynamic-table
        v-loading="loading"
        :data="dataList"
        max-height="460"
        :cols="[
            {label: '头像', prop: 'avatar', width: 80, type: 'image', style: 'width:46px;height:46px'},
            {label: '用户信息', prop: 'account'},
            {label: '联系信息', prop: 'contact', width: 320},
            {label: '注册时间', prop: 'create_time'}]">
      <template slot="account" slot-scope="scope">
        <p>{{ scope.row.user_id }}</p>
        <p>{{ scope.row.nick_name }}</p>
      </template>
      <template slot="contact" slot-scope="scope">
        <p>手机：{{ scope.row.mobile }}</p>
        <p>邮箱：{{ scope.row.email }}</p>
      </template>
    </dynamic-table>
    <div class="wrapper">
      <pagination ref="page" :total="total" :config="{page, size}" @change="loadDataList"></pagination>
    </div>
  </tbc-dialog>
</template>
<script>
export default {

  data() {
    return {
      dataList: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      user: {user_id: ''}
    }
  },

  methods: {

    show(data) {
      if (data.user_id !== this.user.user_id) this.dataList = []
      this.user = data
      this.$refs.dialog.show()
      if (!this.dataList.length) this.initDataList()
    },

    initDataList() {
      this.page = 1
      this.dataList = []
      this.loadDataList()
    },

    async loadDataList(page, size) {
      this.loading = true
      if (page) this.page = page
      if (size) this.page = size
      const res = await this.http.get('/user.invite', {
        user_id: this.user.user_id,
        page: this.page,
        size: this.size,
      })
      this.loading = false
      if (res.data.code !== 0) return this.$message.error(res.data.message)
      this.total = res.data.data.total
      this.dataList = res.data.data.list
    },
  }
}
</script>