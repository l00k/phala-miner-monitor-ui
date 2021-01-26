<template>
    <div class="card mb-4 miners-view">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <span>Miners</span>
                <b-button
                    size="is-small"
                    type="is-success"
                    class="is-pulled-right"
                    @click="showMinerForm()"
                >Add miner
                </b-button>
            </div>
        </header>
        <div class="card-content">
            <div class="content">

                <be-table
                    ref="holders"
                    :data="miners"
                    :loading="isLoading"
                    class="miners-list"
                >
                    <template slot-scope="{ row: miner }">
                        <b-table-column label="Name">
                            <div class="miner-name">
                                <span>{{ miner.name }}</span>
                                <span>
                                    <b-icon v-if="miner.status === ApiResourceStatus.Fetching" pack="fas" icon="circle-notch" class="fa-spin" type="is-primary"></b-icon>
                                </span>
                            </div>
                        </b-table-column>

                        <b-table-column label="Accounts">
                            <b-field
                                label="Stash"
                                label-position="on-border"
                                class="account-data account-data--address"
                            >
                                <p class="control">
                                    <Identicon
                                        :size="32"
                                        :value="miner.accountStash.address"
                                        class="js-clipboard account-icon"
                                        :data-clipboard-text="miner.accountStash.address"
                                    />
                                </p>
                                <p>{{ miner.accountStash.addressShort }}</p>
                            </b-field>
                            <b-field
                                label="Controller"
                                label-position="on-border"
                                class="account-data account-data--address"
                            >
                                <p class="control">
                                    <Identicon
                                        :size="32"
                                        :value="miner.accountController.address"
                                        class="js-clipboard account-icon"
                                        :data-clipboard-text="miner.accountController.address"
                                    />
                                </p>
                                <p>{{ miner.accountController.addressShort }}</p>
                            </b-field>
                        </b-table-column>

                        <b-table-column
                            label="Balances"
                            :numeric="true"
                        >
                            <div class="account-data account-data--balance">
                                {{ miner.accountStash.balanceReadable }}
                            </div>
                            <div class="account-data account-data--balance">
                                {{ miner.accountController.balanceReadable }}
                            </div>
                        </b-table-column>

                        <b-table-column
                            label="Fire"
                            :numeric="true"
                        >
                            <div class="account-data account-data--fire">
                                {{ miner.accountStash.fireReadable }}
                            </div>
                        </b-table-column>

                        <b-table-column label="Actions" width="50px">
                            <b-button
                                size="is-small"
                                type="is-primary"
                                @click="showMinerForm(miner)"
                            >Edit
                            </b-button>
                            <b-button
                                size="is-small"
                                type="is-danger"
                                @click="deleteMiner(miner)"
                            >Delete
                            </b-button>
                        </b-table-column>
                    </template>
                </be-table>

                <b-modal
                    :active.sync="isMinerFormModalVisible"
                    :width="600"
                >
                    <MinerFormView
                        ref="minerFormView"
                        @submit="hideMinerForm"
                    />
                </b-modal>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import MinerFormView from '#/Monitor/Component/Miner/FormView.vue';
import Account from '#/Monitor/Model/Account';
import { ApiResourceStatus } from '#/Monitor/Model/ApiResource';
import Miner from '#/Monitor/Model/Miner';
import ScannerService from '#/Monitor/Service/ScannerService';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv-js-tools/ObjectManager';
import Identicon from '@polkadot/vue-identicon';
import cloneDeep from 'lodash-es/cloneDeep';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


declare const window;

const MinerStore = namespace('Monitor/Miner');

@Component({
    components: {
        MinerFormView,
        Identicon,
    }
})
export default class MinersView
    extends BaseComponent
{

    protected ApiResourceStatus = ApiResourceStatus;

    @Ref()
    protected minerFormView : MinerFormView;

    @Inject()
    protected scannerService : ScannerService = null;

    protected miners : Miner[] = [];

    protected isMinerFormModalVisible : boolean = false;

    protected isLoading : boolean = false;


    public async created()
    {
        Miner.truncate();

        const miner = new Miner()
        miner.name = 'sample'
        miner.accountController.address = '45zw4CxqhGzSqffUu9ijSzBaZgzSDsyUP5mC2ayKvp5rJRb9'
        miner.accountStash.address = '43JoyjJ6ysNr1cLxwW997gWHf6w8V9zWWS6JkgsVQ1tZ4ziK'

        Miner.persist(miner)

        this.miners = await Miner.findAll();

        this.scannerService.fetch(this.miners);
    }

    protected showMinerForm(miner : Miner)
    {
        const managedMiner = new Miner(miner ? cloneDeep(miner) : {});
        this.isMinerFormModalVisible = true;

        this.$nextTick(() => {
            this.minerFormView.setMiner(managedMiner);
        });
    }

    protected hideMinerForm(miner : Miner)
    {
        this.isMinerFormModalVisible = false;
        if (miner) {
            this.scannerService.fetchSingle(miner);
        }
    }

    protected deleteMiner(miner : Miner)
    {
        this.$buefy.dialog.confirm({
            title: 'Deleting miner',
            message: 'Are you sure you want to <b>delete</b> this miner?',
            confirmText: 'Delete miner',
            type: 'is-danger',
            onConfirm: () => {
                this.$store.commit('Monitor/Miner/deleteMiner', miner);
            }
        });
    }

}
</script>

<style lang="scss">
.miners-view {
    .b-table {
        .table tr.detail {
            background: none;
            box-shadow: none;

            .detail-container {
                padding: 0;
            }
        }

        a {
            color: #ffffff;
        }

        .button {
            height: 1.5em;
            padding: 0 8px;
        }
    }

    .miner-name {
        span {
            margin-right: 10px;
            vertical-align: middle;
        }
    }

    .account-data {
        margin: 4px 0 10px;
        height: 32px;

        &--address {
            .account-icon {
                cursor: pointer;
            }

            p {
                height: 32px;
                line-height: 32px;
                margin: 0 6px 0 0 !important;;
            }

            svg {
                float: left;
            }
        }
    }
}
</style>
