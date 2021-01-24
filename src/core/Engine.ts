import ModuleLoader from '@/core/Loader/ModuleLoader';

import ServiceLoader from '@/core/Loader/ServiceLoader';

import StoreManager from '@/core/Store/StoreManager';
import App from '@/core/Vue/App.vue';
import { Configuration } from '@100k/intiv-js-tools/Configuration';
import { EventBus } from '@100k/intiv-js-tools/EventBus';

import { Inject, Singleton } from '@100k/intiv-js-tools/ObjectManager';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store as VuexStore, Store } from 'vuex';

// deployment mode
const env = process.env.NODE_ENV || 'production';


@Singleton()
class Engine
{

    @Inject()
    protected configuration : Configuration;

    @Inject()
    protected eventBus : EventBus;

    @Inject()
    protected serviceLoader : ServiceLoader;

    @Inject()
    protected moduleLoader : ModuleLoader;


    protected vue : Vue;

    protected vuexStore : VuexStore<any>;

    protected vueRouter : VueRouter;


    public async run()
    {
        this.serviceLoader.load();

        // load modules
        await this.moduleLoader.load([ 'Model' ]);

        // load routes and init router
        this.vueRouter = new VueRouter({
            mode: 'history',
            base: process.env.BASE_URL,
        });

        this.vuexStore = new Vuex.Store({
            plugins: [
                StoreManager.getVuexPersister
            ]
        });

        // load modules
        await this.moduleLoader.load([ 'Observer', 'Page', 'Store' ]);

        // init app
        this.vue = new Vue({
            router: this.vueRouter,
            store: this.vuexStore,
            render: h => h(App)
        });

        await this.vue.$mount('#app');
    }

    public getVueRouter() : VueRouter
    {
        return this.vueRouter;
    }

    public getVuexStore() : Store<any>
    {
        return this.vuexStore;
    }

}


export default Engine;
