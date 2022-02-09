import {toRefs, reactive, Ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'

import http from '@/plugin/http'

export default function () {

    const state = reactive({
        loading: false,
        total: 0, page: 1, size: 10,
        keyword: '', dataList: [],
        parentId: '',
        menuPath: []
    })

    // 请求数据
    const loadDataList = async (page?: number, size?: number): Promise<void> => {
        state.loading = true
        if (page) state.page = page
        if (size) state.size = size
        const res = await http.get('/system.menu', {
            page,
            size,
            keyword: state.keyword,
            parent_id: state.parentId
        })
        state.loading = false
        if (res.data.code !== 0) ElMessage.error(res.data.message);
        const data = <any>res.data.data
        state.total = data.total;
        state.dataList = data.list;
    }


    // 删除数据
    const deleteDataItem = (data: { menu_id: string }) => {
        ElMessageBox.confirm('是否确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            const res = await http.post('/system.menu/delete', {
                menu_id: data.menu_id
            })
            if (res.data.code !== 0) return ElMessage.error(res.data.message)
            await loadDataList();
        }).catch(() => {
            console.log('error')
        });
    }

    // 更新信息
    const update = async (form: { menu_id?: string }): Promise<any> => {
        const res = await http.post('/system.menu/' + (form.menu_id ? 'edit' : 'add'), form)
        if (res.data.code !== 0) ElMessage.error(res.data.message);
        if (res.data.code === 0) ElMessage.success(res.data.message);
        return res
    }

    return {
        ...toRefs(state),
        loadDataList,
        deleteDataItem,
        update
    }
}
