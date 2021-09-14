import {App} from 'vue'
import Component from './src/index.vue'

Component.install = (app: App) => {
    app.component(Component.name, Component)
}
export default Component