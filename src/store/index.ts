import {createStore} from 'vuex'

import state from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

import tbc from './modules/a'

const store = createStore({
    state,
    getters,
    actions,
    mutations,
    modules: {
        tbc
    }
})
store.dispatch('tbc/init').then()
export default store

