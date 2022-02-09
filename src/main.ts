import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'
import router from './router'
import store from './store'
import plugin from './plugin';
import directive from './directive';
import tbcComponents from './components/tbc-components'
import tbcBusiness from './components/tbc-business'
import components from './components/index'

const app = createApp(App)
app.use(ElementPlus, {locale})
for (const name in ElementPlusIcons) {
    app.component(name, (ElementPlusIcons as any)[name])
}
app.use(store)
app.use(router)
app.use(plugin)
app.use(directive)
app.use(components)
app.use(tbcComponents)
app.use(tbcBusiness)
app.mount('#app')

