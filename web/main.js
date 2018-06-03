// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import TextHighlighter from 'vue-text-highlight';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import App from './App';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueVirtualScroller);
Vue.component('text-highlighter', TextHighlighter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  store,
  template: '<App/>',
});
