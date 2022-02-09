<template>
  <container title="系统角色" tips="操作系统的用户角色">
    <div class="main-card">
      <tbc-pagination :total="total" :config="{page, size}" simple>
        <template #left>
          <el-input placeholder="角色名称" class="short" v-model="keyword" clearable prefix-icon="search"
                    style="margin-right:10px;width:200px;">
          </el-input>
          <el-button icon="search" type="primary"
                     @click="loadDataList(1)">查询
          </el-button>
        </template>
        <template #right>
          <el-button

              icon="plus"
              circle
              @click="$refs.form.show()"
          ></el-button>
          <el-button

              icon="refresh"
              circle
              @click="loadDataList(page)"
          ></el-button>
        </template>
      </tbc-pagination>
      <div class="data-container">
        <tbc-dynamic-table
            v-loading="loading"
            :data="dataList"
            rowKey="role_id"
            :cols="[
          { type: 'selection', width: 55 },
          { label: 'ID/名称', prop: 'role_name', width: 220 },
          { label: '描述', prop: 'role_desc' },
          {
            label: '状态',
            prop: 'status',
            width: 200,
          },
          {
            label: '操作',
            prop: 'action',
            type: 'action',
            width: 100,
            fixed: 'right',
            click: onButtonClick,
            button: [
              {
                type: 'text',
                label: '编辑',
                code: 'edit',
              },
              {
                type: 'text',
                label: '删除',
                code: 'delete',
              },
            ],
          },
        ]"
        >
          <template #role_name="scope">
            <p>{{ scope.row.role_id }}</p>
            <p>{{ scope.row.role_name }}</p>
          </template>
          <template #status="scope">
            <p class="tbc-hover" @click="changeStatus(scope.row)">
              <el-tag effect="dark" v-if="scope.row.status === 1" type="success">正常</el-tag>
              <el-tag effect="dark" v-if="scope.row.status === 2" type="danger">禁用</el-tag>
            </p>
            <p>{{ scope.row.create_time }}</p>
          </template>
        </tbc-dynamic-table>
      </div>
      <tbc-pagination :total="total" :config="{page, size}" @change="loadDataList"/>
    </div>
  </container>
  <role-form ref="form" @success="loadDataList"/>
</template>
<script lang="ts">
import {
  defineComponent, ref, onMounted, Ref,
  defineAsyncComponent
} from 'vue'
import useRole from './api/role'

export default defineComponent({

  name: 'system-role-list',

  components: {
    RoleForm: defineAsyncComponent(() => import('./RoleForm.vue')),
  },

  setup() {
    const role = useRole()
    const form: Ref = ref(null)
    const onButtonClick = (data: { role_id: string }, action: string) => {
      if (action === 'edit') return form.value.show(data)
      if (action === 'delete') return role.deleteDataItem(data)
    }

    onMounted(() => {
      role.loadDataList()
    })

    return {
      ...role,
      form,
      onButtonClick,
    }
  }
})
</script>
