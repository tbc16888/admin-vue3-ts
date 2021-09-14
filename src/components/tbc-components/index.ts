import {App} from 'vue'

import Dialog from './dialog/index';
import ContextMenu from './contextmenu/index';
import ImageViewer from './image-viewer/index';
import DynamicForm from './dynamic-form/index';
import DynamicTable from './dynamic-table/index'
import DynamicExport from './dynamic-export/index'
import RichEditor from './rich-editor/index'
import HorizontalScroll from './horizontal-scroll/index'
import Pagination from './pagination/index'
import Thumbnail from './thumbnail/index'
import MixinInput from './mixin-input/index'

const components = [
    Dialog,
    ContextMenu,
    ImageViewer,
    DynamicForm,
    DynamicTable,
    RichEditor,
    Thumbnail,
    DynamicExport,
    HorizontalScroll,
    Pagination,
    MixinInput,
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