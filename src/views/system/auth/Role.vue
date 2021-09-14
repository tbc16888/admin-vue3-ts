<template>
  <container title="系统角色" tips="操作系统的用户角色">
    <div class="main-card">
      <tbc-pagination :total="total" :config="{page, size}" simple>
        <template v-slot:left>
          <el-input placeholder="关键字" class="short" v-model="keyword" size="small" clearable
                    style="width:300px;margin-right: 10px;">
            <template v-slot:append>
              <el-button icon="el-icon-search" type="primary" size="small" @click="loadDataList(1)">查询
              </el-button>
            </template>
          </el-input>
        </template>
        <template v-slot:right>
          <el-button
              size="small"
              icon="el-icon-plus"
              circle
              @click="$refs.form.show()"
          ></el-button>
          <el-button
              size="small"
              icon="el-icon-refresh"
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
          { label: 'ID', prop: 'role_id', width: 220 },
          { label: '角色名称', prop: 'role_name', width: 220 },
          { label: '描述', prop: 'role_desc' },
          {
            label: '状态',
            prop: 'status',
            type: 'switch',
            width: 200,
            inactive: 2,
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
