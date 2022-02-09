<template>
  <container title="系统用户" tips="操作后台的账号">
    <template #tips>
      <div style="padding-bottom: 20px">
        <tbc-pagination simple>
          <template #left>
            <el-input placeholder="昵称" class="short" v-model="keyword" clearable
                      style="margin-right:10px;width:200px;">
              <template #prefix>
                <el-icon class="el-input__icon">
                  <search></search>
                </el-icon>
              </template>
            </el-input>
            <el-button icon="search" type="primary"
                       @click="loadDataList(1)">查询
            </el-button>
          </template>
          <template #right>
            <el-button icon="plus" circle @click="form.show({})">
            </el-button>
          </template>
        </tbc-pagination>
      </div>
    </template>

    <div class="main-card">

      <div class="data-container">
        <tbc-dynamic-table v-loading="loading" :data="dataList"
                           :cols="[{type: 'selection', width: 60},
          {label: 'ID/账号', prop: 'account', minWidth: 200},
          {label: '昵称', prop: 'nick_name', width: 200},
          {label: '角色', prop: 'role_name', width: 200},
          {label: '上次登录', prop: 'last_login', width: 200},
          {label: '状态/添加时间', prop: 'status', width: 200},
          {label: '操作', prop: 'action', width: 120, type: 'action', fixed: 'right',
              click: onButtonClick,
              button: [
                  {type: 'text', label: '编辑', code: 'edit'},
                  {type: 'text', label: '删除', code: 'delete'}
              ]}]">
          <template #account="scope">
            <p>{{ scope.row.user_id }}</p>
            <p>{{ scope.row.account }}</p>
          </template>
          <template #role_name="{row}">
            <p>{{ row.role_id }}</p>
            <p>{{ row.role_name }}</p>
          </template>
          <template #status="{row}">
            <p class="tbc-hover" @click="changeStatus(row)">
              <el-tag effect="dark" :type="row.status === 1 ? 'success':'danger'" size="small">
                {{ row.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </p>
            <p>{{ row.create_time }}</p>
          </template>

          <template #last_login="scope">
            <p>{{ scope.row.login_ip }}</p>
            <p>{{ scope.row.login_time }}</p>
          </template>
        </tbc-dynamic-table>
      </div>
      <tbc-pagination :total="total" :config="{page,size}" @change="loadDataList"/>
    </div>
  </container>
  <user-form ref="form" @success="loadDataList"/>
</template>
<script lang="ts">
import {defineComponent, ref, onMounted, Ref, defineAsyncComponent} from 'vue'
import useUser from './api/user'

export default defineComponent({

  name: 'system-user-list',

  components: {
    UserForm: defineAsyncComponent(
        () => import('./UserFormSimple.vue'))
  },

  setup() {

    const user = useUser()
    const form: Ref = ref(null)


    // 按钮点击
    const onButtonClick = (data: { user_id: string }, action: string) => {
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