import {App} from 'vue'
import Container from './container/src/index.vue';

const components = [
    Container
];

const install = function (app: App): void {
    components.forEach(component => {
        app.component(component.name, component);
    });
};

export default {
    install
};