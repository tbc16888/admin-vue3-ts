<template>
  <tbc-dialog title="用户列表" ref="dialog" width="900px" basic>
    <div class="search-item">
      <el-input placeholder="昵称、手机号、ID" class="short" v-model="keyword" clearable>
        <el-button slot="append" icon="el-icon-search" @click="loadDataList(1)"></el-button>
      </el-input>
      <el-button icon="el-icon-delete" style="margin-left: 10px;"
           @click="choice({nick_name: '', user_id: ''})">清除
      </el-button>
    </div>

    <dynamic-table
        max-height="400"
        v-loading="loading"
        :data="dataList"
        :cols="[
                {label: '头像', prop: 'avatar', width: 80, type: 'image', style: 'width:46px;height:46px'},
                {label: '账号', prop: 'account'},
                {label: '联系信息', prop: 'contact', width: 220},
                {label: '状态', prop: 'status', align: 'center', width: 120, type: 'switch'},
                {label: '操作', prop: 'action', width: 100, type: 'action', fixed: 'right', button: [
                     {label: '选择', type: 'text', click: choice}
                ]}]">
      <template slot="account" slot-scope="scope">
        <p>账号：{{ scope.row.account }}</p>
        <p>昵称：{{ scope.row.nick_name }}</p>
      </template>
      <template slot="contact" slot-scope="scope">
        <p>手机：{{ scope.row.mobile }}</p>
        <p>邮箱：{{ scope.row.email }}</p>
      </template>
    </dynamic-table>
    <pagination :total="total" :config="{page, size}" @change="loadDataList"/>
  </tbc-dialog>
</template>
<script>
import user from './mixins/user'

export default {

  name: 'user-selector',

  mixins: [user],

  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  created() {
    this.extension = {
      ...this.extension,
      ...this.params
    }
    ;
  },

  methods: {

    show() {
      this.$refs.dialog.show()
      if (!this.dataList.length) this.loadDataList()
    },

    close() {
      this.$refs.dialog.close()
    },

    choice(data) {
      this.$emit('choice', data)
    },
  }
}
</script>
