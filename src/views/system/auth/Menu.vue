<template>
  <container title="系统菜单">

    <div class="main-card" v-loading="loading">
      <tbc-pagination :total="total" :config="{page, size}" simple @change="loadDataList">
        <template v-slot:left>
          <tbc-selector
              ref="cat"
              api="/system.menu"
              field="parent_id"
              v-model="menuPath"
              :check-strictly="true"
              style="min-width:300px;margin-right:10px;"/>
        </template>
        <template v-slot:right>
          <el-button size="small" icon="el-icon-plus" circle @click="$refs.form.show()"></el-button>
          <el-button size="small" icon="el-icon-refresh" circle @click="loadDataList(page)"></el-button>
        </template>
      </tbc-pagination>

      <div class="data-container">
        <tbc-dynamic-table
            v-loading="loading"
            :data="dataList"
            :cols="[
            {type: 'selection', width: 55},
            // {label: '图标', prop: 'icon', type: 'image', width: 60, style: 'width:40px;height:40px;'},
            {label: '名称', prop: 'menu_name', width: 300},
            {label: '接口', prop: 'api', width: 300},
            {label: '排序', prop: 'sort_weight', align: 'center', width: 140},
            {label: '子菜单', prop: 'children', align: 'center', width: 140},
            {label: '状态', prop: 'status', type: 'switch', width: 200, align: 'center'},
            {label: '操作', width: 140, type: 'action', fixed: 'right',
            click: onButtonClick,
            button: [
                {label: '子菜单', type: 'text', code: 'children'},
                {label: '编辑', type: 'text', code: 'edit'},
                {label: '删除', type: 'text', code: 'delete'},
        ]}]">
          <template v-slot:cat_name="scope">
            <p>{{ scope.row.cat_id }}</p>
            <p>{{ scope.row.cat_name }}</p>
          </template>
          <template v-slot:api="scope">
            <p>
              <span>{{ scope.row.module }}</span>
              <span v-if="scope.row.controller">/{{ scope.row.controller }}</span>
              <span v-if="scope.row.action">/{{ scope.row.action }}</span>
            </p>
          </template>
        </tbc-dynamic-table>
      </div>
      <tbc-pagination :total="total" @change="loadDataList"/>
    </div>
  </container>
  <menu-form ref="form"/>
</template>
<script lang="ts">
import {
  defineComponent, toRefs, onMounted, defineAsyncComponent,
  ref, Ref
} from 'vue'
import useMenu from './api/menu'

export default defineComponent({

  name: 'system-menu-menu',

  components: {
    MenuForm: defineAsyncComponent(() =>
        import('./MenuForm.vue'))
  },

  setup() {

    const menu = useMenu()
    const menuPath: Ref = ref([])
    const form: Ref = ref(null)
    const onButtonClick = (data: { menu_id: string }, action: string) => {
      if (action === 'children') {
        menu.parentId.value = data.menu_id
        menuPath.value.push(data.menu_id)
        console.log(menuPath)
        menu.loadDataList(1)
      }
      if (action === 'edit') {
        form.value.show(data)
      }
      if (action === 'delete') return menu.deleteDataItem(data)
    }

    onMounted(() => {
      menu.loadDataList(1)
    })

    return {
      ...toRefs(menu),
      form,
      menuPath,
      onButtonClick,
    }
  },


  // methods111: {
  //   sortChange(data) {
  //     this.order = [data.prop, data.order === 'ascending' ? 'asc' : 'desc'].join(',')
  //     this.loadDataList(1)
  //   },
  //
  //
  //   search(filter) {
  //     for (let i in filter) this.filter[i] = filter[i]
  //     this.loadDataList()
  //     let index = this.tabBarList.findIndex(item =>
  //         item.status === this.filter.sale_status)
  //     this.tabBarName = this.tabBarList[index].name
  //   },
  //
  //
  //   async quickEdit(data) {
  //     const res = await this.http.post('/goods/quickEdit', data);
  //     if (res.data.code !== 0) this.$message.error(res.data.message)
  //     this.$message.success(res.data.message)
  //     return res
  //   },
  //
  //   showBatch() {
  //     this.selection = this.$refs.table.selection
  //     if (!this.selection.length) return this.$message.warning('请选择要设置的行')
  //     this.$refs.batch.show(this.selection)
  //   },
  //
  //   toGoodsForm(item) {
  //     this.$router.push({name: 'goods-add', query: {type: item.code}})
  //   },
  //
  //
  //   // 上下架
  //   async changeSaleStatus(data) {
  //     this.$confirm('确定操作？', '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     }).then(async () => {
  //       const res = await this.http.post('/goods/changeSaleStatus', {
  //         goods_id: data.goods_id,
  //         status: data.sale_status === 1 ? 2 : 1
  //       });
  //       if (res.data.code !== 0) return this.$message.error(res.data.message)
  //       data.sale_status = data.sale_status === 1 ? 2 : 1
  //     });
  //   },
  //
  // },
})
</script>
