<template>
  <container title="系统用户" tips="操作后台的账号">

    <div class="main-card">
      <tbc-pagination simple>
        <template #left>
          <el-input placeholder="昵称" class="short" v-model="keyword" clearable size="small"
                    style="margin-right:10px;width:200px;">
            <template #prefix>
              <i class="el-icon el-icon-search"></i>
            </template>
          </el-input>
          <el-button
              icon="el-icon-search" type="primary" size="small"
              @click="loadDataList(1)">查询
          </el-button>
        </template>
      </tbc-pagination>
      <div class="data-container">
        <tbc-dynamic-table v-loading="loading" :data="dataList"
                           :cols="[{type: 'selection', width: 60},
          {label: 'ID/账号', prop: 'account', width: 200},
          {label: '昵称', prop: 'nick_name', width: 200},
          {label: '角色', prop: 'role_name'},
          {label: '上次登录', prop: 'last_login', width: 200},
          {label: '状态/添加时间', prop: 'status', width: 200},
          {label: '操作', prop: 'action', width: 120, type: 'action', fixed: 'right',
              click: onButtonClick,
              button: [
                  {type: 'text', label: '编辑', code: 'edit'},
                  {type: 'text', label: '删除', code: 'delete'}
              ]}]">
          <template v-slot:account="scope">
            <p>{{ scope.row.user_id }}</p>
            <p>{{ scope.row.account }}</p>
          </template>

          <template v-slot:status="scope">
            <p class="tbc-hover" @click="changeStatus(scope.row)">
              <el-tag effect="dark" size="mini" v-if="scope.row.status === 1" type="success">正常</el-tag>
              <el-tag effect="dark" size="mini" v-if="scope.row.status === 2" type="danger">禁用</el-tag>
            </p>
            <p>{{ scope.row.create_time }}</p>
          </template>

          <template v-slot:last_login="scope">
            <p>{{ scope.row.login_ip }}</p>
            <p>{{ scope.row.login_time }}</p>
          </template>
        </tbc-dynamic-table>
      </div>
      <tbc-pagination :total="total" :config="{page,size}" @change="loadDataList"/>
    </div>
  </container>
  <user-form ref="form"/>
</template>
<script lang="ts">
import {defineComponent, ref, onMounted, Ref, defineAsyncComponent} from 'vue'
import useUser from './api/user'

export default defineComponent({

  name: 'system-user-list',

  components: {
    UserForm: defineAsyncComponent(() => import('./UserFormSimple.vue'))
  },

  setup() {

    const user = useUser()
    const form: Ref = ref(null)


    // 按钮点击
    const onButtonClick = (data: { user_id: string }, action: string): void => {
      if (action === 'edit') {
        return form.value.show(data)
      }
      if (action === 'delete') return user.deleteDataItem(data)
    }

    onMounted(() => {
      user.loadDataList(1)
    })

    return {
      ...user,
      form,
      onButtonClick
    }
  }
})
</script>