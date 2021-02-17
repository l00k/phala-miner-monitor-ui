import App from '@/core/App';
import { ObjectManager } from '@100k/intiv/ObjectManager';
import Buefy from 'buefy';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';


Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Buefy, {
    defaultIconPack: 'fas',
});

require('@/core/Vue');
require('@/core/Vue/Buefy');
require('@/config/icons');

(async() => {
    ObjectManager.getInstance(App).run();
})();
