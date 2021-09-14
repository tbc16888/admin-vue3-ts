<template>
  <tbc-dialog title="金币明细" ref="dialog" basic :close-on-click-modal="true" width="900px">
    <dynamic-table
        v-loading="loading"
        max-height="460"
        :data="dataList"
        :cols="[
            {label: '编号/类型', prop: 'log_id', width: 200},
            {label: '数量', prop: 'change_amount', width: 200},
            {label: '时间', prop: 'change_time', width: 200},
            {label: '描述', prop: 'change_desc'}]">
      <template slot="log_id" slot-scope="scope">
        <p>{{ scope.row.log_id }}</p>
        <p>{{ scope.row.change_type_name }}</p>
      </template>
      <template slot="change_amount" slot-scope="scope">
        <p v-if="scope.row.change_amount > 0">
          <el-tag size="mini" type="success">{{ scope.row.change_amount }}</el-tag>
        </p>
        <p v-if="scope.row.change_amount < 0">
          <el-tag size="mini" type="danger">{{ scope.row.change_amount }}</el-tag>
        </p>
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
      const res = await this.http.get('/user/getCoinRecord', {
        user_id: this.user.user_id,
        page: this.page,
        size: this.size,
      })
      this.loading = false
      if (res.data.code !== 0) return this.$message.error(res.data.message)
      this.dataList = res.data.data.list
      this.total = res.data.data.total
    },
  }
}
</script>