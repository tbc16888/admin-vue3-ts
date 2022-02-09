<template>
  <container title="用户列表">
    <template #tips>
<!--      <el-tabs v-model="tabBarName" @tab-click="tabBarClick" class="title-tab">-->
<!--        <el-tab-pane v-for="(item, index) in tabBarList" :label="item.label" :name="item.name" :key="index">-->
<!--        </el-tab-pane>-->
<!--      </el-tabs>-->
        <div style="padding-bottom: 20px">
          <tbc-pagination :total="total" simple :config="{page, size}" @change="loadDataList">
            <template #left>
              <el-input placeholder="昵称、手机号、ID" class="short" v-model="filter.keyword" clearable
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
              <el-button
                  icon="refresh"
                  @click="initDataList">重置
              </el-button>
              <el-button
                  type="text"
                  @click="$refs.search.show(filter)"
              >
                高级搜索
                <el-icon>
                  <arrow-down></arrow-down>
                </el-icon>
              </el-button>
            </template>
            <template #right>
              <el-button icon="plus" circle
                         @click="onButtonClick({user_id: ''}, 'add')"></el-button>
              <el-button icon="refresh" circle @click="loadDataList(page)"></el-button>
            </template>
          </tbc-pagination>
        </div>
    </template>

    <div class="main-card" v-loading="loading" style="border-radius: 4px">

      <div class="data-container">
        <tbc-dynamic-table
            :data="dataList"
            :cols="[
          { type: 'selection', width: 55 },
          {
            label: '头像',
            prop: 'avatar',
            width: 80,
            type: 'image',
            style: 'width:46px;height:46px;border-radius:50%',
          },
          { label: '账号', prop: 'account', width: 200 },
          { label: '手机/邮箱', prop: 'contact', width: 200 },
          { label: '账户', prop: 'assets', width: 200 },
          { label: '状态/注册时间', prop: 'status', minWidth: 200 },
          {
            label: '操作',
            width: 140,
            type: 'action',
            fixed: 'right',
            click: onButtonClick,
            button: [
              {
                label: '详情',
                type: 'text',
                code: 'info',
              },
              {
                label: '编辑',
                type: 'text',
                code: 'edit',
              },
            ],
            more: [
              {
                label: '删除',
                type: 'text',
                code: 'delete',
              },
            ],
          },
        ]"
        >
          <template #account="scope">
            <p>{{ scope.row.user_id }}</p>
            <p>{{ scope.row.nick_name }}</p>
          </template>
          <template #contact="scope">
            <p>手机：{{ scope.row.mobile }}</p>
            <p>邮箱：{{ scope.row.email }}</p>
          </template>
          <template #assets="scope">
            <p>积分：{{ scope.row.integral }}</p>
            <p>余额：{{ scope.row.balance }}</p>
          </template>
          <template #status="scope">
            <p>
              <el-tag
                  effect="dark"
                  size="small"
                  v-if="scope.row.status === 1"
                  type="success"
              >正常
              </el-tag
              >
              <el-tag
                  effect="dark"
                  size="mini"
                  v-if="scope.row.status === 2"
                  type="danger"
              >已禁用
              </el-tag
              >
            </p>
            <p>{{ scope.row.create_time }}</p>
          </template>
        </tbc-dynamic-table>
      </div>
      <tbc-pagination ref="pagination" :total="total" :config="{page, size}" @change="loadDataList"/>
    </div>
  </container>
  <user-info ref="info"/>
  <user-advanced-search ref="search" @search="search" @export="onClickExport"/>
  <tbc-dynamic-export ref="exportVisible" @confirm="startExport"/>
</template>
<script lang="ts">
import {
  defineComponent, onMounted, ref,
  defineAsyncComponent, Ref
} from 'vue'
import useUser from './api/user'
import {useRouter} from 'vue-router'
import {ElLoading} from "element-plus";

export default defineComponent({
  name: 'user-list',

  components: {
    UserAdvancedSearch: defineAsyncComponent(() =>
        import('./components/UserAdvancedSearch.vue')),
    UserInfo: defineAsyncComponent(() =>
        import('./UserInfoDialog.vue'))
  },

  setup() {
    const user = useUser()
    const info: Ref = ref(null)
    const exportVisible: Ref = ref(null)

    const router = useRouter()
    const tabBarName = ref('all')
    const tabBarList = [
      {label: '全部', name: 'all', status: 0},
      {label: '正常', name: 'on', status: 1},
      {label: '禁用', name: 'off', status: 2}
    ]

    // 点击按钮
    const onButtonClick = (data: { user_id: string }, action: string) => {
      if (action === 'info') return info.value.show(data)
      if (action === 'add') return router.push({name: 'user-add'})
      if (action === 'edit') {
        router.push({name: 'user-edit', query: {id: data.user_id}})
      }
    }

    const tabBarClick = (tab: Record<string, number>) => {
      console.log(tab)
      user.filter.value.status = Number(tabBarList[tab.index].status)
      user.loadDataList(1)
    }

    const onClickExport = (filter: Record<string, number | string>): void => {
      user.filter.value = {...user.filter.value, ...filter}
      exportVisible.value.show('用户列表-{time}', [
        {checked: true, label: '用户ID', field: 'user_id'},
        {checked: true, label: '昵称', field: 'nick_name'},
        {checked: true, label: '注册时间', field: 'create_time'},
      ])
    }

    const startExport = async () => {
      const loading = ElLoading.service({
        lock: true,
        text: '正在导出，请稍等，当数据过多时可能需要比较久的时间',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      });
      let page = 1
      let size = 50
      const res = await user.loadExportData(page, size)
      if (res.data.code !== 0) loading.close()
      let total = res.data.data.total
      let pages = Math.ceil(total / 100)
      let allDataList = res.data.data.list
      for (let i = page + 1; i < pages + 1; i++) {
        page = i;
        const res = await user.loadExportData(page, size)
        if (res.data.code !== 0) loading.close()
        allDataList = allDataList.concat(res.data.data.list)
      }
      // exportVisible.value.start(allDataList, function (field, data) {
      //   return data[field]
      // })
      // loading.close()
    }


    const search = (filter: Record<string, number | string>): void => {
      user.filter.value = {...user.filter.value, ...filter}
      tabBarList.forEach(item => {
        if (item.status === filter.status) tabBarName.value = item.name
      })
      user.loadDataList(1)
    }

    onMounted(() => {
      user.loadDataList(1)
    })

    return {
      ...user,
      info,
      exportVisible,
      tabBarName,
      tabBarList,
      tabBarClick,
      onButtonClick,
      onClickExport,
      startExport,
      search
    }
  }
})
</script>
