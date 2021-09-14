import axios from './axios'
import {AxiosRequestConfig, AxiosResponse} from 'axios';

interface Result {
    data: {
        code: string | number,
        message?: string,
        data?: any
    }
}

enum Method {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete'
}

function http(method: Method, url: string, params: unknown, config: unknown): Promise<Result> {
    if (typeof config === 'undefined') config = {}
    return new Promise((resolve) => {
        if (method === 'get') params = {params}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        axios[method](url, params, config).then((res: AxiosResponse<any>) => {
            return resolve(res);
        }).catch(function () {
            return resolve({data: {code: 500, message: "请求错误"}});
        });
    });
}

export default {

    get: function (url: string, params?: unknown, config ?: unknown): Promise<Result> {
        return http(Method.GET, url, params, config)
    },

    post: function (url: string, params: unknown, config ?: unknown): Promise<Result> {
        return http(Method.POST, url, params, config)
    },

    create: function (config: AxiosRequestConfig | undefined) {
        return axios.create(config)
    }
}
