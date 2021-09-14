import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import qs from 'qs'
import {ElLoading} from 'element-plus';
import store from '../../store'
let loading: { close: () => void; } | null = null

// 配置
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
axios.defaults.baseURL = window._config && window._config.api || "";
axios.defaults.timeout = 20000;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

// http request 拦截器
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof config.showLoading === 'undefined') config.showLoading = true
        config.data = qs.stringify(config.data);
        config.headers['Authorization'] = store.getters.loginToken;

        if (config.method === 'post') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (config.showLoading) {
                loading = ElLoading.service({
                    lock: true, text: '正在处理', spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.3)'
                });
            }
        }
        return config;
    },

    (error: any) => {
        if (loading) loading.close()
        return Promise.reject(error);
    }
);


// http response 拦截器
axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        if (loading) loading.close()
        return response;
    },

    error => {
        if (loading) loading.close()
        return Promise.reject(error.response)
    }
);

export default axios
