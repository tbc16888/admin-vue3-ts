import {App} from 'vue'


const install = function (app: App): void {
    app.directive('auth', {
        mounted(el, binding) {
            if ((binding.value as unknown as string) === 'test') el.style.display = 'none'
        },
    })
};

export default {
    install
};