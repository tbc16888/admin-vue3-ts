<template>
  <el-input :id="id" type="textarea" style="width: 99.9%;"></el-input>
</template>
<script lang="ts">
import {defineComponent, onMounted} from 'vue'

const tinyMCE = (window as any).tinyMCE

interface ComponentProps {
  modelValue: string,
  height: number
}

export default defineComponent({

  name: 'tbc-rich-editor',

  props: {

    modelValue: {
      type: String,
      default() {
        return ''
      }
    },

    height: {
      type: Number,
      default() {
        return 300
      }
    }
  },


  setup(props: ComponentProps, {emit}) {
    const id = 'editor_' + Math.random().toString().substring(2, 4)
    let imagePickCallback = null
    const init = () => {
      if (typeof tinyMCE === 'undefined') return; // throw Error('请引入tinymce文件')
      tinyMCE.init({
        selector: '#' + id,
        height: 300,
        plugins: 'print preview fullpage searchreplace autolink directionality  visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime  lists textcolor wordcount  imagetools colorpicker textpattern code ',
        toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        language: 'zh_CN',
        file_picker_callback: function (callback) {
          imagePickCallback = callback
        },
        setup(editor) {
          editor.on('init', () => {
            tinyMCE.get(id).setContent(props.modelValue);
          });
          editor.on('blur', () => {
            emit('update:modelValue', tinyMCE.get(id).getContent())
          });
        }
      });
    }
    onMounted(init)
    return {
      id
    }
  }
})
</script>