import http from './http'

export default {
    async install(app: any) {
        app.config.globalProperties.$http = http
    }
}
