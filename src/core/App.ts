import ModuleLoader from '@/core/Loader/ModuleLoader';
import ServiceLoader from '@/core/Loader/ServiceLoader';
import StoreManager from '@/core/Store/StoreManager';
import AppComponent from '@/core/Vue/AppComponent.vue';
import { Configuration } from '@100k/intiv/Configuration';
import { EventBus } from '@100k/intiv/EventBus';
import { Inject, Singleton } from '@100k/intiv/ObjectManager';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store as VuexStore } from 'vuex';


@Singleton()
export default class App
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
        // load configuration
        const configData = require('@/config/configuration').default;
        this.configuration.load(configData);

        // load services
        await this.serviceLoader.load();

        // load routes and init router
        this.vueRouter = new VueRouter({
            mode: 'history',
            base: process.env.BASE_URL,
        });

        // load models
        await this.moduleLoader.load([ 'Model' ]);

        // setup store and database
        this.vuexStore = new Vuex.Store({
            plugins: [
                StoreManager.getVuexPersister,
            ]
        });

        await import('./Store/Database');

        // load other modules components
        await this.moduleLoader.load([ 'Observer', 'Page', 'Store' ]);

        // init app
        this.vue = new Vue({
            router: this.vueRouter,
            store: this.vuexStore,
            render: h => h(AppComponent),
        });

        await this.vue.$mount('#app');
    }

    public getVueRouter() : VueRouter
    {
        return this.vueRouter;
    }

    public getVuexStore() : VuexStore<any>
    {
        return this.vuexStore;
    }

}
