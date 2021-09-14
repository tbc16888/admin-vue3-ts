import {toRefs, reactive, Ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import http from '@/plugin/http'

export default function () {

    const state = reactive({
        loading: false,
        total: 0, page: 1, size: 10,
        keyword: '', dataList: [],
        filter: {keyword: '', status: 0}
    })

    const initDataList = async (): Promise<void> => {
        await loadDataList(1)
    }

    // 请求数据
    const loadDataList = async (page?: number, size?: number): Promise<void> => {
        state.loading = true
        if (page) state.page = page
        if (size) state.size = size
        const res = await http.get('/user', {
            page,
            size,
            ...state.filter
        })
        state.loading = false
        const data = res.data.data
        if (res.data.code !== 0) {
            ElMessage.error(res.data.message)
        } else {
            state.total = data.total;
            state.dataList = data.list;
        }
    }

    const loadExportData = async (page: number, size: number) => {
        return await http.get('/user', {
            page,
            size,
            ...state.filter
        })
    }

    // 删除数据
    const deleteDataItem = (data: { user_id: string }) => {
        ElMessageBox.confirm('是否确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            const res = await http.post('/user/delete', {
                user_id: data.user_id
            })
            if (res.data.code !== 0) return ElMessage.error(res.data.message)
            await loadDataList();
        });
    }

    // 更新信息
    const update = async (form: { user_id?: string }): Promise<any> => {
        const res = await http.post('/user/' + (form.user_id ? 'edit' : 'add'), form)
        if (res.data.code !== 0) ElMessage.error(res.data.message);
        if (res.data.code === 0) ElMessage.success(res.data.message);
        return res
    }

    const getInfo = async (userId: string): Promise<any> => {
        const res = await http.get('/user/detail', {user_id: userId})
        if (res.data.code !== 0) ElMessage.error(res.data.message);
        return res
    }

    const search = async (filter: Record<string, number | string>): Promise<void> => {
        state.filter = {...state.filter, ...filter}
        await loadDataList(1)
    }

    return {
        ...toRefs(state),
        search,
        update,
        getInfo,
        loadDataList,
        initDataList,
        deleteDataItem,
        loadExportData
    }
}
