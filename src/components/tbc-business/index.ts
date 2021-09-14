import {App} from 'vue'

import Selector from './selector'
import FileManager from './file-manager'
import FileUpload from './file-uplad'

const components = [
    Selector,
    FileManager,
    FileUpload
];

const install = function (app: App): void {
    components.forEach(component => {
        app.component(component.name, component);
    });
};

export default {
    version: '0.0.1',
    install
};