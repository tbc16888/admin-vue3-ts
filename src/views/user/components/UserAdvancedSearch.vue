<template>
  <tbc-dialog ref="dialog" title="高级搜索" width="900px">
    <el-form label-position="top" class="compact">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="关键词">
            <el-input placeholder="昵称、手机号、ID" v-model="filter.keyword" clearable>

            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="用户状态">
            <el-select v-model="filter.status" style="width: 100%">
              <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in [
                  {value: 0, label: '全部'},
                  {value: 1, label: '正常'},
                  {value: 2, label: '禁用'}]"
                  :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="注册时间">
            <el-date-picker type="datetimerange" v-model="registerSection" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <div style="text-align: right;margin-top: 10px">
        <el-button icon="el-icon-refresh" @click.stop="reset">重置</el-button>
        <el-button type="info" icon="el-icon-search" @click.stop="doExport">导出</el-button>
        <el-button type="primary" icon="el-icon-search" @click.stop="doSearch">搜索</el-button>
      </div>
    </template>
  </tbc-dialog>
</template>
<script lang="ts">
import {defineComponent, reactive, ref, toRefs, Ref} from 'vue'

export default defineComponent({

  name: 'user-advance-search',

  emits: ['search', 'export'],

  setup(props, {emit}) {
    const dialog: Ref = ref(null)
    const state = reactive({
      filter: {keyword: '', status: 0},
      filterInit: {keyword: '', status: 0},
      registerSection: [],
    })

    // 重置
    const reset = (): void => {
      // for (let i in state.filterInit) state.filter[i] = state.filterInit[i]
      state.filter = {...state.filter, ...state.filterInit}
      emit('search', state.filter)
    }

    const show = (filter?: Record<string, number | string>): void => {
      dialog.value.show()
      if (filter !== undefined) {
        state.filter = {...state.filter, ...filter}
        // for (let i in state.filter) state.filter[i] = filter[i]
      }
    }

    const doSearch = (): void => {
      emit('search', state.filter)
      dialog.value.close()
    }

    const doExport = (): void => {
      emit('export', state.filter)
    }

    return {
      ...toRefs(state),
      dialog,
      reset,
      show,
      doSearch,
      doExport
    }
  }


  // methods: {
  //
  //
  //   _doSearch() {
  //     if (this.registerSection === null) this.registerSection = ['', '']
  //     this.filter.register_time_1 = this.registerSection[0]
  //     this.filter.register_time_2 = this.registerSection[1]
  //     this.$emit('search', this.filter)
  //     this.close()
  //   },
  //
  //   _doExport() {
  //     this.close()
  //     this.$emit('export', this.filter)
  //   }
  // }
})
</script>