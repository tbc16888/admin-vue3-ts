<template>
  <div v-loading="loading">
    <table cellpadding="0" cellspacing="0" border="0" class="info-table">
      <tr>
        <td rowspan="6" style="width: 180px">
          <div class="cell">
            <el-image
                style="width: 150px; height: 150px"
                :src="userInfo.avatar"
                :preview-src-list="[userInfo.avatar]"
            >
            </el-image>
          </div>
        </td>
        <td class="item">
          <div class="cell">账号</div>
        </td>
        <td>
          <div class="cell">{{ userInfo.account }}</div>
        </td>
        <td class="item">
          <div class="cell">添加时间</div>
        </td>
        <td>
          <div class="cell">{{ userInfo.create_time }}</div>
        </td>
      </tr>
      <tr>
        <td class="item">
          <div class="cell">电话</div>
        </td>
        <td>
          <div class="cell">{{ userInfo.mobile }}</div>
        </td>
        <td class="item">
          <div class="cell">邮箱</div>
        </td>
        <td>
          <div class="cell">{{ userInfo.email }}</div>
        </td>
      </tr>

      <tr>
        <td class="item">
          <div class="cell">性别</div>
        </td>
        <td>
          <div class="cell" v-if="userInfo.gender == 3">未知</div>
          <div class="cell" v-if="userInfo.gender == 1">男</div>
          <div class="cell" v-if="userInfo.gender == 2">女</div>
        </td>
        <td class="item">
          <div class="cell">出生日期</div>
        </td>
        <td>
          <div class="cell">{{ userInfo.birthday }}</div>
        </td>
      </tr>
      <tr>
        <td class="item">
          <div class="cell">真实姓名</div>
        </td>
        <td>
          <div class="cell">{{ userInfo.real_name }}</div>
        </td>
        <td class="item">
          <div class="cell">昵称</div>
        </td>
        <td>
          <div class="cell">{{ userInfo.nick_name }}</div>
        </td>
      </tr>
      <tr>
        <td class="item">
          <div class="cell">余额</div>
        </td>
        <td>
          <div class="cell">
            <span>￥{{ userInfo.balance }}</span>
            <el-button
                type="text"
                style="margin-left: 20px; padding: 0;min-height:1px"
                @click="$refs.balanceAdjustment.show(userInfo)"
            >调整
            </el-button>
          </div>
        </td>
        <td class="item">
          <div class="cell">积分</div>
        </td>
        <td>
          <div class="cell">
            <span>{{ userInfo.integral }}</span>
            <el-button
                type="text"
                style="margin-left: 20px; padding: 0;min-height:1px"
                @click="$refs.integralAdjustment.show(userInfo)"
            >调整
            </el-button>
          </div>
        </td>
      </tr>
      <tr>
        <td class="item">
          <div class="cell">最后登录</div>
        </td>
        <td colspan="3">
          <div class="cell">{{ userInfo.login_ip }}</div>
        </td>
      </tr>
    </table>

    <div>
      <div class="summary-head" style="padding: 12px 20px; margin-top: 20px">
        <div class="summary-title">统计</div>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in statistics" :key="index">
          <div
              style="
                  margin-left: 10px;
                  color: #333;
                  border: 1px solid #dedede;
                  border-radius: 6px;
                  text-align: center;
                  padding: 10px ;
                  cursor: pointer;
                  margin-bottom: 10px;
                "
              @click="onStatisticsClick(item)"
          >
            <h2 style="font-size: 20px; font-weight: bold">{{ item.value }}</h2>
            <span style="font-size: 14px">{{ item.label }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <user-balance-form ref="balanceAdjustment" @success="refresh"/>
  <user-integral-form ref="integralAdjustment" @success="refresh"/>
  <user-integral ref="integral"/>
  <user-balance ref="balance"/>
  <user-address ref="address"/>
  <user-coupon ref="coupon"/>
</template>
<script lang="ts">
import {defineAsyncComponent, defineComponent, reactive, ref, toRefs, Ref} from 'vue'
import useUser from '../api/user'
import http from '@/plugin/http'
import {ElMessage} from "element-plus";

export default defineComponent({

  name: 'user-info',

  components: {
    UserBalance: defineAsyncComponent(() =>
        import('./UserBalance.vue')),
    UserBalanceForm: defineAsyncComponent(() =>
        import('./UserBalanceForm.vue')),
    UserIntegral: defineAsyncComponent(() =>
        import('./UserIntegral.vue')),
    UserIntegralForm: defineAsyncComponent(() =>
        import('./UserIntegralForm.vue')),
    UserAddress: defineAsyncComponent(() =>
        import('./UserAddress.vue')),
    UserCoupon: defineAsyncComponent(() =>
        import('./UserCoupon.vue'))
  },

  setup() {
    const user = useUser()
    const state = reactive({
      loading: false,
      userInfo: {
        user_id: ''
      },
      statistics: [
        {label: '积分', value: 0, code: 'integral'},
        {label: '账户', value: 0, code: 'balance'},
        {label: '地址', value: 0, code: 'address'},
        {label: '优惠券', value: 0, code: 'coupon'},
        {label: '邀请', value: 0, code: 'invite'},
      ]
    })
    const balance: Ref = ref(null)
    const integral: Ref = ref(null)
    const address: Ref = ref(null)
    const coupon: Ref = ref(null)
    const invite: Ref = ref(null)

    // 初始化
    const init = async (params: { user_id: string }): Promise<void> => {
      state.loading = true
      const res = await user.getInfo(params.user_id)
      state.loading = false
      let data: Record<string, string> = res.data.data;
      (state.userInfo as Record<string, string>) = data
      state.statistics.forEach((item: { code: string, value: number | string }) => {
        if (data[item.code]) item.value = data[item.code]
      })
      await getUserStatistics()
    }

    const onStatisticsClick = (tab: Record<string, string | number>) => {
      if (tab.code === 'coupon') coupon.value.show(state.userInfo)
      if (tab.code === 'address') address.value.show(state.userInfo)
      if (tab.code === 'balance') balance.value.show(state.userInfo)
      if (tab.code === 'integral') integral.value.show(state.userInfo)
      if (tab.code === 'invite') invite.value.show(state.userInfo)
    }

    const getUserStatistics = async () => {
      const res = await http.get('/user.statistics', {
        user_id: state.userInfo.user_id
      })
      if (res.data.code !== 0) return ElMessage.error(res.data.message)
      let data = res.data.data
      state.statistics.forEach((item: { code: string, value: number | string }) => {
        if (data[item.code]) item.value = data[item.code]
      })
    }

    const refresh = (): void => {
      init(state.userInfo)
    }

    return {
      init,
      ...toRefs(state),
      refresh,
      onStatisticsClick,
      integral, balance, address, coupon, invite
    }
  }
})
</script>
<style>
.info-table {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
  border: 1px solid #ebeef5;
  border-right: none;
  border-bottom: none;
  border-spacing: 0
}

.info-table td {
  padding: 8px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.info-table td .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
}

</style>