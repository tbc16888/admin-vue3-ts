import {toRefs, reactive, Ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'

import http from '@/plugin/http'

export default function () {

    const state = reactive({
        loading: false,
        total: 0, page: 1, size: 10,
        keyword: '', dataList: [], datetime: []
    })

    // 请求数据
    const loadDataList = async (page?: number, size?: number): Promise<void> => {
        state.loading = true
        if (page) state.page = page
        if (size) state.size = size
        const res = await http.get('/journal.operation', {
            page,
            size,
            keyword: state.keyword,
            time_1: state.datetime.length ? state.datetime[0] : '',
            time_2: state.datetime.length ? state.datetime[1] : '',
        })
        state.loading = false
        if (res.data.code !== 0) {
            ElMessage.error(res.data.message)
        } else {
            const data: Record<string, any> = res.data.data
            state.total = data.total;
            state.dataList = data.list;
        }
    }

    // 请求数据
    const loadDataInfo = async (logId: string): Promise<Record<string, any>> => {
        state.loading = true
        const res = await http.get('/journal.operation/detail', {
            log_id: logId
        })
        state.loading = false
        if (res.data.code !== 0) ElMessage.error(res.data.message)
        return res
    }


    // 删除数据
    const deleteDataItem = (data: { log_id: string }) => {
        ElMessageBox.confirm('是否确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            const res = await http.post('/journal.operation/delete', {
                log_id: data.log_id
            })
            if (res.data.code !== 0) return ElMessage.error(res.data.message)
            await loadDataList();
        });
    }

    return {
        ...toRefs(state),
        loadDataList,
        loadDataInfo,
        deleteDataItem
    }
}
