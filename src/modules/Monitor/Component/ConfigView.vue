<template>
    <div class="card mb-4 m-context__connection">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <div class="app-name">Phala miner monitor</div>
                <div class="build-info">{{ buildVersion }}</div>
            </div>
        </header>
        <div class="card-content">
            <div class="content">
                <div class="columns">
                    <div class="column is-6 has-text-left">
                        <div>Crawler sync: {{ (appState.lastFetchedBlock / appState.currentHeadBlock * 100) | formatNumber('0.0') }}% ({{ appState.lastFetchedBlock }})</div>
                        <div>Last accounts update: {{ appState.lastFetchedBlock - appState.lastInfoUpdateBlock }} blocks ago</div>
                    </div>
                    <div class="column is-6 has-text-right">
                        <div>
                            <b-button
                                size="is-small"
                                type="is-light is-danger"
                                @click="clearLocalStorage()"
                            >Clear local storage
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Account from '#/Monitor/Model/Account';
import AppState from '#/Monitor/Model/AppState';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import StorageMigration from '#/Monitor/Service/StorageMigration';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager';


declare const window;

@Component({
    components: {}
})
export default class ConfigView
    extends BaseComponent
{

    @Inject()
    protected monitorApi : MonitorApi;

    @Inject()
    protected storageMigration : StorageMigration;

    protected appState : AppState = new AppState();

    public async created()
    {
        this.appState = await this.monitorApi.getAppState();
    }

    public get buildVersion() : string
    {
        return window.appData.buildVersion;
    }

    public async clearLocalStorage()
    {
        const confirm = await this.confirm({
            title: 'Clear local storage',
            message: 'All saved data on local device will be cleared. Are you sure you want to proceed?'
        });

        if (confirm) {
            this.storageMigration.clear();
        }
    }

}
</script>

<style scoped lang="scss">
.card-footer {
    justify-content: space-between;
}

.app-name {
}

.build-info {
    font-size: 0.7rem;
}
</style>
