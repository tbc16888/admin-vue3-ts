<template>
  <div class="viewContainer" style="width: 100%;">
    <draggable v-model="dataList" v-bind="dragOptions" tag="div" :component-data="{
          tag: 'div'
        }" @end="onDragEnd" item-key="id">
      <template #item="{element, index}">
        <div class="item draggable" style="border: 1px dashed #CCC;margin: 10px 0;position:relative;">
          <div class="buttons">
            <span><i class="el-icon-download" @click="changePosition(index, index + 1)"></i></span>
            <span><i class="el-icon-upload2" @click="changePosition(index, index - 1)"></i></span>
            <span><i class="el-icon-edit" @click="editItem(index, element.type)"></i></span>
            <span><i class="el-icon-delete" @click="removeItem(index)"></i></span>
          </div>

          <div>
            <p v-if="element.type === 'image'">
              <img :src="element.value" style="width: 100%"/>
            </p>
            <p v-if="element.type === 'text'" style="padding:10px;word-wrap: break-word">{{ element.value }}</p>
          </div>
        </div>
      </template>
    </draggable>
    <tbc-dialog ref="dialog" title="文本" @confirm="onTextConfirm">
      <el-input type="textarea" rows="6" v-model="text"></el-input>
    </tbc-dialog>
  </div>
</template>
<script lang="ts">
import {defineComponent, reactive, Ref, toRefs, PropType, ref, watch} from 'vue'
import draggable from 'vuedraggable'
import dialog from '../../dialog/src/index.vue'
import {ElMessage, ElMessageBox} from "element-plus";

interface MixinInputData {
  type: 'text' | 'image',
  value: string,
  id?: string
}

export default defineComponent({

  name: 'tbc-mixin-input',

  components: {
    draggable,
    tbcDialog: dialog
  },

  emits: ['update:modelValue', 'edit', 'change'],

  props: {

    modelValue: {
      type: Array as PropType<MixinInputData[]>,
      default() {
        return []
      }
    }
  },


  setup(props: any, {emit}) {

    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    let dataIndex = -1
    const dialog: Ref = ref(null)
    const state = reactive({
      dataList: [],
      text: ''
    })


    const formatData = () => {
      props.modelValue.forEach(item => {
        if (!item.id) item.id = new Date().getTime()
      })
      state.dataList = props.modelValue
    }
    formatData()
    watch(() => props.modelValue, function (newVal, oldVal) {
      formatData()
    })


    state.dataList = props.modelValue as []

    const changePosition = (a: number, b: number) => {
      if (a < 0 || b < 0) return
      if (a > state.dataList.length - 1 || b > state.dataList.length - 1) return
      state.dataList[a] = state.dataList.splice(b, 1, state.dataList[a])[0];
    }

    const editItem = (index: number, type: string) => {
      dataIndex = index
      if (type === 'text') dialog.value.show()
      if (type === 'image') emit('edit', index)
    }

    const removeItem = (index: number) => {
      state.dataList.splice(index, 1)
      // ElMessageBox.confirm('是否确定删除？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   state.dataList.splice(index, 1)
      // });
    }

    const addText = () => {
      editItem(-1, 'text')
    }

    const onTextConfirm = () => {
      if (dataIndex > -1) {
        (state.dataList[dataIndex] as MixinInputData).value = state.text
      } else {
        (state.dataList as MixinInputData[]).push({
          type: 'text',
          value: state.text
        })
      }
      dialog.value.close()
      onDragEnd()
    }

    const onDragEnd = (): void => {
      emit('update:modelValue', state.dataList)
      emit('change')
    }

    return {
      dragOptions,
      ...toRefs(state),
      dialog,
      changePosition,
      removeItem,
      editItem,
      onDragEnd,
      addText,
      onTextConfirm
    }
  },


})
</script>
<style scoped>
.buttons {
  text-align: right;
  margin: 10px 0;
}

.buttons span {
  margin-top: 10px;
  font-size: 20px;
  color: #000;
  margin-right: 10px;
  cursor: pointer;
}
</style>