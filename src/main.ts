import Vue from 'vue';

Vue.config.productionTip = false;

// vuex registration
import Vuex from 'vuex';
Vue.use(Vuex);

// router registration
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// buefy registration
import Buefy from 'buefy';
Vue.use(Buefy);

// import extensions
import '@/core/Vue';
import '@/core/ext/validate-js';
import '@/core/Vue/Buefy';

// run engine
import { ObjectManager } from '@100k/intiv-js-tools/ObjectManager';
import Engine from '@/core/Engine';


(async() => {
    const engine = ObjectManager.getInstance(Engine);
    await engine.run();
})();
