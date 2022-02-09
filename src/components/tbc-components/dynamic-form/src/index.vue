<template>
  <el-form label-width="80px" :label-position="labelPosition">
    <template v-for="(item, index) in form">
      <el-form-item v-if="item.type !== 'hidden'" :style="item.style || ''" :key="index">
        <template v-slot:label v-if="item.label">
          <slot :name="'label_' + item.field" :item="item">
            {{ item.label }}
            <span style="color:#909090;">{{ item.remark }}</span>
          </slot>
        </template>

        <slot :name="item.field" :item="item">

          <!-- 输入框 -->
          <el-input v-if="['input', 'password', 'textarea', 'text'].indexOf(item.type) > -1" v-model="item.value"
                    :disabled="item.disabled" :type="item.type"
                    :show-password="item.type === 'password'" :size="size"
                    :rows="item.rows || 2"
                    :maxlength="item.maxLength || ''"
                    :minlength="item.minLength || ''"
                    :show-word-limit="item.showWordLimit || false"
                    :readonly="item.readonly" :clearable="item.clearable">
            <template #append v-if="item.button">
              <el-button :icon="item.button.icon" @click="click(index)">
                {{ item.button.label }}
              </el-button>
            </template>
          </el-input>


          <!-- 数字框 -->
          <el-input-number v-if="item.type === 'input-number'" v-model="item.value" :disabled="item.disabled"
                           @change="change(index)"
                           controls-position="right" :min="item.min || 0" :max="item.max || 999999"
                           :style="item.style || 'width:100%'"
                           :step="item.step || 1" :class="item.class || 'text-left'">
          </el-input-number>

          <!-- 输入和颜色选择 -->

          <div style="display: flex;flex-direction: row;width: 100%" v-if="item.type === 'input-color'">
            <el-input v-model="item.value" :disabled="item.disabled" :readonly="item.readonly" :size="size"
                      @change="change(index)">
            </el-input>
            <div style="width: 4px"></div>
            <el-color-picker v-model="item.value" :show-alpha="item.showAlpha || false" style="display: block"
                             :size="size"
                             @change="change(index)">
            </el-color-picker>
          </div>

          <!-- 选择框 -->
          <el-select v-if="item.type === 'select'" v-model="item.value" style="width: 100%" :size="size">
            <el-option v-for="(option) in item.options" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>


          <!-- 日期 -->
          <el-date-picker v-if="['date', 'datetime', 'datetimerange'].indexOf(item.type) > -1" v-model="item.value"
                          :size="size"
                          :type="item.type" :format="item.type === 'date' ? 'YYYY-MM-DD':'YYYY-MM-DD HH:mm:ss'"
                          :placeholder="item.placeholder || '请选择'" :start-placeholder="item.startPlaceholder || '开始日期'"
                          :end-placeholder="item.endPlaceholder || '结束日期'" :style="item.style || 'width:100%'">
          </el-date-picker>

          <!-- 复选框 -->
          <el-checkbox-group v-if="item.type === 'checkbox'" v-model="item.value">
            <el-checkbox :label="option.value" v-for="(option) in item.options" :key="option.value">
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- 单选框 -->
          <el-radio-group v-if="item.type === 'radio'" v-model="item.value">
            <el-radio :label="option.value" v-for="(option) in item.options" :key="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </slot>
      </el-form-item>
    </template>
  </el-form>
</template>
<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {ElForm, ElFormItem} from 'element-plus'
import {DynamicFormItem} from "./types";

export default defineComponent({

  name: 'tbc-dynamic-form',

  components: {
    ElForm,
    ElFormItem
  },

  props: {

    form: {
      type: Array as PropType<DynamicFormItem[]>,
      default() {
        return []
      }
    },

    size: {
      type: String,
      default() {
        return ''
      }
    },

    labelPosition: {
      type: String,
      default() {
        return 'top'
      }
    }
  },

  setup(props, {emit}) {

    // 值发生改变
    const change = (index: number) => {
      emit('change', index)
    }

    return {
      change
    }
  }
})
</script>
<style>
.el-input-number.text-left .el-input__inner {
  text-align: left
}

.compact.el-form--label-top .el-form-item__label {
  line-height: normal;
}
</style>