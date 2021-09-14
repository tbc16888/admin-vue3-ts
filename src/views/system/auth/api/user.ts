import {toRefs, reactive, Ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'

import http from '@/plugin/http'

export default function () {

    const state = reactive({
        loading: false,
        total: 0, page: 1, size: 10,
        keyword: '', dataList: [],
    })

    // 请求数据
    const loadDataList = async (page?: number, size?: number): Promise<void> => {
        state.loading = true
        if (page) state.page = page
        if (size) state.size = size
        const res = await http.get('/system.user', {
            page,
            size,
            keyword: state.keyword
        })
        state.loading = false
        if (res.data.code !== 0) ElMessage.error(res.data.message);
        const data = <any>res.data.data
        state.total = data.total;
        state.dataList = data.list;
    }


    // 删除数据
    const deleteDataItem = (data: { user_id: string }) => {
        ElMessageBox.confirm('是否确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            const res = await http.post('/system.user/delete', {
                user_id: data.user_id
            })
            if (res.data.code !== 0) return ElMessage.error(res.data.message)
            await loadDataList();
        });
    }

    return {
        ...toRefs(state),
        loadDataList,
        deleteDataItem
    }
}
