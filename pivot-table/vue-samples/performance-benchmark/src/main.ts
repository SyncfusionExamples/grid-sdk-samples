import { createApp } from 'vue'
import '@syncfusion/ej2-fluent2-theme/styles/pivotview/index.css'
import './index.css'
import { PivotViewPlugin } from '@syncfusion/ej2-vue-pivotview'
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'
import { ButtonPlugin } from '@syncfusion/ej2-vue-buttons'
import App from './App.vue'

createApp(App)
  .use(PivotViewPlugin)
  .use(DropDownListPlugin)
  .use(ButtonPlugin)
  .mount('#app')
