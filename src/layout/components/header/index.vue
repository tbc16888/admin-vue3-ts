<template>
  <div style="width:100%;position:relative;flex-shrink: 0;" class="tbc-flex-row">

    <div class="tbc-flex-row tbc-header-ba1r" style="width: 100%;height: 60px">
      <div v-for="(item, index) in [{icon: 'icon-home_menu'}]" :key="index" class="tbc-hover"
           style="padding:0 16px;float: left;flex-shrink: 0;" @click="onLeftButtonClick(item)">
        <i class="iconfont icon-caidan" :class="item.icon"></i>
      </div>

      <div style="flex: 1;overflow:hidden;" class="tbc-flex-row">
        <tbc-horizontal-scroll>
          <el-menu class="tbc-top-menu1" mode="horizontal" @select="onMenuModuleClick">
            <el-menu-item v-for="(item, index) in menuModule" :key="index" :index="index + ''">
              {{ item.title }}
            </el-menu-item>
          </el-menu>
        </tbc-horizontal-scroll>
      </div>

      <!-- 右边 -->
      <div class="tbc-flex-row" style="height: 60px;flex-shrink: 0;">
        <div v-for="(item, index) in rightButtons" :key="index" style="color:#515a6e;padding:0 16px;" class="tbc-hover">
          <el-tooltip effect="dark" :content="item.label" placement="bottom">
            <i class="iconfont" :class="item.icon"></i>
          </el-tooltip>
        </div>
        <div style="color:#515a6e;padding:0 16px;">
          <el-dropdown :show-timeout="10">
            <div>
              {{ loginUserInfo.nick_name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/">首页</router-link>
                </el-dropdown-item>
<!--                <el-dropdown-item @click="showUserInfo(loginUserInfo)-->
<!--    ">-->
<!--                  <a href="javascript:void(0)">个人信息-->
<!--                  </a>-->
<!--                </el-dropdown-item>-->
                <el-dropdown-item @click="$refs.password.show()">
                  <a href="javascript:void(0)">修改密码</a>
                </el-dropdown-item>
                <el-dropdown-item @click.stop="logout" divided>退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
  <tbc-dialog title="修改密码" ref="password" @confirm="changePassword" width="500px">
    <tbc-dynamic-form :form="passwordForm" class="compact"/>
  </tbc-dialog>
  <!-- <user-form ref="user"></user-form> -->
</template>
<script lang="ts">
import {defineComponent, reactive, computed} from 'vue'
// import menuModule from '../../../router/routes.menu.module'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import http from '@/plugin/http'
import {ElMessage, ElMessageBox} from 'element-plus'

export default defineComponent({


  setup() {

    const router = useRouter()
    const store = useStore()
    const framework = reactive({
      collapse: false
    })
    const passwordForm = reactive([
      {label: '原密码', field: 'old_password', type: 'password', value: ''},
      {label: '新密码', field: 'new_password', type: 'password', value: ''},
    ])
    const rightButtons = [
      {label: '消息通知', icon: 'icon-tongzhi'},
      {label: '主题设置', icon: 'icon-bug'},
      {label: '主题设置', icon: 'icon-screenfull'},
      {label: '系统设置', icon: 'icon-goods'},
    ]
    const onLeftButtonClick = (): void => {
      store.commit('setFramework', {
        collapse: !store.state.framework.collapse
      })
    }

    // 模块点击
    const onMenuModuleClick = (index: number): void => {
      // const module = menuModule[index]
      // if (!module || !(module.nameList as string[]).length) return
      // router.push({name: module.name || module.nameList[0]})
      console.log('onMenuModuleClick')
    }

    // 修改密码
    const changePassword = async () => {
      let form: { [k: string]: string } = {}
      passwordForm.forEach(item => form[item.field] = item.value)
      const res = await http.post('/personal/changePassword', form)
      if (res.data.code !== 0) return ElMessage.error(res.data.message);
      ElMessage.success(res.data.message);
      passwordForm.forEach(item => item.value = '')
    }

    // 登出
    const logout = () => {
      ElMessageBox.confirm('确定要退出系统吗？', '提示', {
        type: 'warning'
      }).then(() => {
        store.commit('setLoginToken', '')
        router.push({name: 'login'});
        // store.dispatch('logout').then(() => {
        //   router.push({name: 'login'});
        // });
      }).catch(() => {
        console.log('error')
      })
    }


    return {
      passwordForm,
      rightButtons,
      framework,
      loginUserInfo: computed(() => store.getters.loginUserInfo),
      menuModule: computed(() => []),
      changePassword,
      logout,
      onMenuModuleClick,
      onLeftButtonClick
    }
  }
})
</script>
<style>
.tbc-header-bar i,
.tbc-header-bar .el-dropdown {
  color: #FFF
}

.tbc-top-menu.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.tbc-top-menu.el-menu--horizontal > .el-menu-item {
  color: #FFF;
}

.tbc-top-menu.el-menu--horizontal > .el-menu-item.is-active,
.tbc-top-menu.el-menu--horizontal > .el-menu-item {
  border-bottom: none
}

.tbc-top-menu.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.tbc-top-menu.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.d2-admin .tbc-top-menu .el-menu-item.is-active {
  border-bottom: none;
  color: #FFE340;
  /*background:  linear-gradient(180deg, hsla(0, 0%, 100%, .28), hsla(0, 0%, 100%, 0));*/
  background: none;
}
</style>