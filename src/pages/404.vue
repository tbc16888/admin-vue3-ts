<template>
  <div style="height: 100%;background: #FFF;padding: 20px">
    <div>
      <el-button @click="$refs.goods.show()">打开</el-button>
      <el-button @click="$refs.order.show({order_sn: '207434130148564994'})">订单</el-button>
      <el-button @click="changeSelectorValue">改变</el-button>
      <el-button @click="viewValue">查看</el-button>
      <el-button @click="$refs.distribute.show({warehouse_id: '176826692120715266'})">地图</el-button>
      <el-button @click="$refs.file.show()">文件</el-button>
      <el-button @click="$refs.upload.show()">上传</el-button>
      <tbc-selector api="/goods.category/async" check-strictly ref="selector" v-model="selectorValue"/>
    </div>
    <div style="padding: 10px 0">
      <el-input placeholder="请选择角色" v-model="inputValue" size="large" readonly>
        <template #suffix>
          <el-icon @click="inputValue =''" style="top: 50%;margin-top: -6px;">
            <circle-close/>
          </el-icon>
        </template>
        <template #append>
          <el-button icon="search" @click="$refs.role.show()">选择
          </el-button>
        </template>
      </el-input>
    </div>
    <div style="margin-top: 20px">
      <tbc-thumbnail v-model="images" :max="5" width="100px" height="100px" @upload="$refs.file.show()"/>
    </div>
    <div style="height: 500px;width: 320px; border: 1px solid #e7e7eb;">
      <el-scrollbar height="500px">
        <tbc-mixin-input ref="mixin" v-model="mixinInputValue"/>
      </el-scrollbar>
      <el-button>图片</el-button>

    </div>
  </div>
  <tbc-file-upload ref="upload" @select="onFileSelected"/>
  <tbc-file-manager ref="file" @select="onFileSelected" :selectable="['image']" :config="{maxSelect: 10}"/>
  <!--  <goods-selector ref="goods"/>-->
  <!--  <order-detail ref="order"/>-->
  <!--  <warehouse-distribute ref="distribute"/>-->
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, Ref} from 'vue'
import http from '@/plugin/http'
import {ElMessage} from "element-plus";

export default defineComponent({

  name: '404',

  components: {
    // GoodsSelector: defineAsyncComponent(() =>
    //     import('../views/mall/goods/GoodsSelector.vue')),
    // GoodsSelector: defineAsyncComponent(() =>
    //     import('../views/operationGroup/goods/GoodsAllSelector.vue')),
    // OrderDetail: defineAsyncComponent(() =>
    //     import('@/views/mall/order/OrderDetailDialog.vue')),
    // WarehouseDistribute: defineAsyncComponent(() =>
    //     import('@/views/warehousing/warehouse/WarehouseDistribute.vue')),
  },
  setup() {
    const selector: Ref = ref(null)
    const selectorValue = ref<string[]>([
      '152527690289094658', '152527690473238530', '152527690554486786'
    ])
    const distribute: Ref = ref(null)
    const changeSelectorValue = () => {
      // selectorValue.value = ['152527699117965314', '152527699134857218']
      // selectorValue.value = ['152527699117965314', '152527699134857218', '152527699234242562']
      // selector.value.reload()
      selectorValue.value = ['221755721863340032', '221775371811737600']
    }
    const inputValue: Ref = ref('你好')
    const images = ref<string[]>([])
    const mixin = ref(null)
    const mixinInputValue = ref([
      // {type: 'image', value: 'http://little-mall.qiniu.taoshatec.com/FnCnGVvDbm0jzMNoZnsyKCCpLKYS'},
      // {type: 'text', value: '虎扑08月04日讯 根据凯尔特人记者Jared Weiss的报道，联盟消息人士透露，凯尔特人为格兰特-威廉姆斯提供了是否参加夏季联赛的选项，最终格威决定不参加，继续恢复身体。'}
    ])

    const viewValue = () => {
      console.log(selectorValue.value)
      console.log(images.value)
    }

    const onFileSelected = (files: { file_url: string }[]) => {
      const imageList: string[] = []
      files.forEach((item: { file_url: string }) => imageList.push(item.file_url))
      images.value = imageList
    }

    onMounted(() => {
      // (window as any).AMapBoundaries().build('福建省', function(data) {
      //   console.log(data)
      // })
      console.log('onMounted')
      // distribute.value.show({warehouse_id: '176826692120715266'})
      setTimeout(() => {
        document.querySelectorAll('.code').forEach((el) => {
          (window as any).hljs.highlightElement(el);
        });
      }, 100)
    })


    return {
      inputValue,
      selector,
      selectorValue,
      changeSelectorValue,
      viewValue,
      distribute,
      images,
      mixin,
      mixinInputValue,
      onFileSelected,
    }
  }
})
</script>

<style scoped>
pre {
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0px;
}
</style>