<template>
  <el-table :data="data" :show-summary="showSummary" :summary-method="summaryMethod" :size="size"
            :span-method="spanMethod" :border="border" :stripe="stripe" :max-height="maxHeight"
            :show-header="showHeader"
            :row-key="rowKey" @select="onSelectRow" @select-all="onSelectAllRow">
    <template v-for="(column, index) in cols" :key="index">

      <!-- 内置类型 -->
      <el-table-column :key="index" :type="column.type" :align="column.align ? column.align:'left'"
                       :width="column.width ? column.width: 'auto'" :fixed="column.fixed" :label="column.label"
                       v-if="['selection', 'index'].indexOf(column.type) > -1">
      </el-table-column>

      <el-table-column :key="index" :type="column.type" :align="column.align ? column.align:'left'"
                       :width="column.width ? column.width: 'auto'" v-if="['expand'].indexOf(column.type) > -1">
        <template v-slot="scope">
          <slot :name="column.prop" :row="scope.row" :index="scope.$index">

          </slot>
        </template>
      </el-table-column>

      <!-- 扩展类型 -->
      <el-table-column :prop="column.prop" :label="column.label" :align="column.align ? column.align:'left'"
                       :width="column.width ? column.width: 'auto'"
                       :show-overflow-tooltip="column.showOverflowToolTip || false"
                       :min-width="column.minWidth || ''" :class-name="column.className || ''" :key="index"
                       class="draggable"
                       :fixed="column.fixed" v-if="['selection', 'index', 'expand'].indexOf(column.type) < 0">
        <template v-slot:header="scope">
          <slot name="header" :scope="scope">
            {{ column.label }}
          </slot>
        </template>
        <template v-slot="scope">
          <slot :name="column.prop" :row="scope.row" :index="scope.$index" :column="column">
            <template v-if="!column.type">
              {{ scope.row[column.prop] }}
            </template>

            <template v-if="column.type === 'link'">
              <a :href="scope.row[column.prop]" :target="column.target ? column.target:'__self'"
                 v-if="scope.row[column.prop].indexOf('http') > -1">
                {{ scope.row[column.prop] }}</a>
              <el-link v-if="scope.row[column.prop].indexOf('http') === -1">
                {{ scope.row[column.prop] }}
              </el-link>
            </template>

            <template v-if="column.type === 'cover'">
              <el-popover :ref="'popover'+ scope.$index" trigger="hover" placement="right" max-width="300">
                <img :src="scope.row[column.prop]" style="max-width:600px;max-height:600px;"/>
              </el-popover>
              <img :src="scope.row[column.prop]" :style="column.style || 'width:60px;height:46px;'"
                   v-popover="'popover'+ scope.$index"/>
            </template>

            <template v-if="column.type === 'image' ">
              <el-image :style="column.style || 'width:60px;height:46px;'" :src="scope.row[column.prop]"
                        :fit="column.fit || 'fill'" :preview-src-list="[scope.row[column.prop]]">
              </el-image>
            </template>

            <template v-if="column.type === 'switch'">
              <el-switch v-model="scope.row[column.prop]" active-color="#13ce66" inactive-color="#d8dce6"
                         :disabled="column.disabled || !column.change"
                         :active-value="typeof column.active !== 'undefined' ? column.active:1"
                         :inactive-value="typeof column.inactive !== 'undefined' ? column.inactive:0"
                         @change="change(index, scope.row)">
              </el-switch>
            </template>

            <template v-if="column.type === 'input'">
              <el-input type="text" v-model="scope.row[column.prop]" :class="column.class || 'table-inner-input'"
                        :size="column.size || ''" @change="change(index, scope.row)">
              </el-input>
            </template>

            <!-- 数字输入框 -->
            <template v-if="column.type === 'input-number'">
              <el-input-number v-model="scope.row[column.prop]" controls-position="right" :min="column.min || 0"
                               :max="column.max || 999999" :style="column.style || 'width:100%'"
                               :step="column.step || 1"
                               :size="column.size || ''" @change="change(index, scope.row)"
                               :class="column.class || 'text-left'">
              </el-input-number>
            </template>

            <template v-if="column.type === 'checkbox'">
              <el-checkbox v-model="scope.row[column.prop]" :checked="scope.row[column.prop]"></el-checkbox>
            </template>

            <template v-if="column.type === 'popover'">
              <el-popover placement="top-start" width="200" trigger="hover"
                          :effect="column.effect ? column.effect:'dark'" :content="scope.row[column.prop]">
                <template v-slot:reference>
                  <p>{{ scope.row[column.prop] }}</p>
                </template>
              </el-popover>
            </template>

            <template v-if="column.type === 'action'">
              <div class="el-highlight">
                <el-button size="mini"
                           :type="button.type"
                           :icon="button.icon"
                           :circle="column.circle || false"
                           @click="column.click(scope.row, button.code, scope.$index)"
                           v-show="!button.condition || scope.row[button.condition.field] == button.condition.value"
                           v-for="(button, bi) in column.button"
                           :key="bi">
                  <template v-if="button.label">
                    {{ button.label }}
                  </template>
                </el-button>

                <el-dropdown v-if="column.more">
                  <el-button size="mini" type="text" style="margin-left: 10px">
                    更多 <i class="el-icon-arrow-down"></i>
                  </el-button>
                  <template v-slot:dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                          @click="column.click(scope.row, button.code, scope.$index)"
                          :command="{row: scope.row, code: button.code, index: scope.$index, click: button.click}"
                          v-show="!button.condition || scope.row[button.condition.field] == button.condition.value"
                          v-for="(button, bi) in column.more" :key="bi">{{ button.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </slot>
        </template>
      </el-table-column>
    </template>
    <template v-slot:empty>
      <slot name="empty"></slot>
    </template>
  </el-table>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {Column} from "./types";
// import Sortable from 'sortablejs';

export default defineComponent({
  name: 'tbc-dynamic-table',

  props: {

    cols: {
      type: Array as PropType<Column[]>,
      default() {
        return []
      }
    },

    data: {
      type: Array,
      default() {
        return []
      }
    },

    showSummary: {
      type: Boolean,
      default: false
    },

    summaryMethod: {
      type: Function,
      default: null
    },

    spanMethod: {
      type: Function,
      default: null
    },

    maxHeight: {
      type: [String, Number],
      default: null
    },

    border: {
      type: Boolean,
      default: false
    },

    stripe: {
      type: Boolean,
      default: false
    },

    size: {
      type: String,
      default: ''
    },

    // 显示表头
    showHeader: {
      type: Boolean,
      default: true,
    },

    rowKey: {
      type: String,
      default: 'role_id'
    },

    sortable: {
      type: Boolean,
      default: false,
    }
  },


  setup(props: any, {emit}) {

    let selection: Record<string, any> = []

    // 表格数据改变
    const change = (index: number, data: Record<string, any>) => {
      emit('change', {index, data})
    }

    // 行被选中
    const onSelectRow = (selected: Record<string, any>[]) => {
      selection = selected
    }

    // 全选行
    const onSelectAllRow = (selected: []) => {
      selection = selected
    }

    const getSelected = () => {
      return selection
    }

    return {
      selection,
      change,
      onSelectRow,
      onSelectAllRow,
      getSelected
    }
  }




  // mounted() {
  //   if (this.rowKey && this.sortable) this.rowDrop()
  // },

  // methods: {

  //   onSelectionChange() {
  //   },

  //   onCommand(e) {
  //     e.click(e.row, e.code, e.index)
  //   },

  //   // 行拖拽
  //   rowDrop() {
  //     const tbody = document.querySelector('.el-table__body-wrapper tbody')
  //     const _this = this
  //     new Sortable(tbody, {
  //       animation: 180,
  //       // onStart({oldIndex}) {
  //       //   const currRow = _this.data[oldIndex]
  //       //   console.log(JSON.stringify(currRow))
  //       // },
  //       onEnd({ oldIndex, newIndex }) {
  //         const currRow = _this.data.splice(oldIndex, 1)[0]
  //         console.log(oldIndex, newIndex)
  //         console.log(JSON.stringify(currRow))
  //         console.log(JSON.stringify(_this.data), "======")
  //         _this.data.splice(newIndex, 0, currRow)
  //         console.log(JSON.stringify(_this.data), "======")
  //       }
  //     })
  //   },
  // }
})
</script>