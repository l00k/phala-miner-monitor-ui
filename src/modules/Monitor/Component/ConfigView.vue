<template>
    <div>
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
                        <div
                            v-if="lastFinalizedBlock"
                            class="column is-4 has-text-left"
                        >
                            <div>
                                <span class="mr-2">Crawler sync:</span>
                                <b-tag
                                    v-if="blockIndexDelta < BLOCK_INDEX_THRESHOLD"
                                    type="is-success"
                                    size="is-micro"
                                >In sync</b-tag>
                                <b-tag
                                    v-else
                                    class="is-warning"
                                    size="is-micro"
                                >Outdated</b-tag>
                                ({{ blockIndexDelta }} to process)
                            </div>
                            <div>Last accounts update: {{ accountUpdateDelta }} blocks ago</div>
                        </div>
                        <div
                            v-else
                            class="column is-4 has-text-left"
                        >
                            Connecting to node...
                        </div>

                        <div class="column is-4 has-text-centered">
                            <div>
                                <b-button
                                    size="is-small"
                                    type="is-light is-success"
                                    @click="monitorDevicesRequest()"
                                >Monitor your devices
                                </b-button>
                            </div>
                        </div>
                        <div class="column is-4 has-text-right">
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

        <ConnectFormView
            ref="connectForm"
        />
    </div>
</template>

<script lang="ts">
import ConnectFormView from '#/Monitor/Component/Config/ConnectFormView.vue';
import AppState from '#/Monitor/Model/AppState';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import StorageMigration from '#/Monitor/Service/StorageMigration';
import PhalaApi from '#/Phala/Service/Api/PhalaApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager';
import { Ref } from 'vue-property-decorator';


declare const window;

@Component({
    components: { ConnectFormView }
})
export default class ConfigView
    extends BaseComponent
{

    @Inject()
    protected phalaApi : PhalaApi;

    @Inject()
    protected monitorApi : MonitorApi;

    @Inject()
    protected storageMigration : StorageMigration;

    @Ref('connectForm')
    protected $connectForm : ConnectFormView;

    protected appState : AppState = new AppState();

    protected lastFinalizedBlock : number = null;


    public get blockIndexDelta() : number
    {
        return this.lastFinalizedBlock - this.appState.lastFetchedBlock;
    }

    public get accountUpdateDelta() : number
    {
        return this.lastFinalizedBlock - this.appState.lastInfoUpdateBlock;
    }


    public async created()
    {
        this.appState = await this.monitorApi.getAppState();

        const nativeApi = await this.phalaApi.api();
        const finalizedHead = await nativeApi.rpc.chain.getFinalizedHead();
        const finalizedBlockHeader = await nativeApi.rpc.chain.getHeader(finalizedHead);

        this.lastFinalizedBlock = finalizedBlockHeader.number.toNumber();
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

    public async monitorDevicesRequest()
    {
        this.$connectForm.show();
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
