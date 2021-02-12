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

                <div class="has-text-right">
                    <b-dropdown
                        v-model="visibleColumns"
                        multiple
                    >
                        <template #trigger>
                            <b-button
                                type="is-primary is-small"
                                icon-right="menu-down">
                                Show columns ({{ visibleColumns.length }})
                            </b-button>
                        </template>

                        <b-dropdown-item value="name">Name</b-dropdown-item>
                        <b-dropdown-item value="address">Address</b-dropdown-item>
                        <b-dropdown-item value="score">Score</b-dropdown-item>
                        <b-dropdown-item value="state">State</b-dropdown-item>
                        <b-dropdown-item value="commission">Commission</b-dropdown-item>
                        <b-dropdown-item value="stake">Stake</b-dropdown-item>
                        <b-dropdown-item value="balance">Balance</b-dropdown-item>
                        <b-dropdown-item value="fireMined">Fire Mined</b-dropdown-item>
                        <b-dropdown-item value="lastExtrinsics">Last Extrinsics</b-dropdown-item>
                        <b-dropdown-item value="lastRewards">Last Rewards</b-dropdown-item>
                    </b-dropdown>
                </div>

                <be-table
                    ref="miners"
                    :data="miners"
                    :loading="isLoading"
                    class="miners-list"
                    default-sort="score"
                    default-sort-direction="desc"
                    :key="tableKey"
                >
                    <template slot-scope="{ row: miner }">
                        <b-table-column
                            v-if="visibleColumns.indexOf('name') !== -1"
                            field="name"
                            label="Name"
                            :sortable="true"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.name }}</span>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('address') !== -1"
                            label="Address"
                            :sortable="true"
                            cell-class="miners-list--cell-top"
                        >
                            <b-field
                                label="Controller"
                                label-position="on-border"
                                class="miner-account miner-account--address"
                            >
                                <Identicon
                                    :size="32"
                                    :value="miner.controllerAccount.address"
                                    class="js-clipboard account-icon"
                                    :data-clipboard-text="miner.controllerAccount.address"
                                />
                                <span>{{ miner.controllerAccount.address | formatAddress }}</span>
                            </b-field>
                            <hr/>
                            <b-field
                                label="Stash"
                                label-position="on-border"
                                class="miner-account miner-account--address"
                            >
                                <Identicon
                                    :size="32"
                                    :value="miner.stashAccount.address"
                                    class="js-clipboard account-icon"
                                    :data-clipboard-text="miner.stashAccount.address"
                                />
                                <span>{{ miner.stashAccount.address | formatAddress }}</span>
                            </b-field>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('score') !== -1"
                            field="score"
                            label="Score"
                            :numeric="true"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.score }}</span>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('state') !== -1"
                            field="state"
                            label="State"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.state }}</span>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('commission') !== -1"
                            field="commission"
                            label="Commission"
                            :numeric="true"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.commission }}</span>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('stake') !== -1"
                            label="Stake"
                            :numeric="true"
                            cell-class="miners-list--cell"
                        >
                            <div class="miner-account miner-account--stake">
                                {{ miner.controllerAccount.state | formatCoin }}
                            </div>
                            <hr/>
                            <div class="miner-account miner-account--stake">
                                {{ miner.stashAccount.state | formatCoin }}
                            </div>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('balance') !== -1"
                            field="balance"
                            label="Balance"
                            :sortable="true"
                            :numeric="true"
                            cell-class="miners-list--cell-top"
                        >
                            <div class="miner-account miner-account--balance">
                                {{ miner.controllerAccount.balance | formatCoin }}
                            </div>
                            <hr/>
                            <div class="miner-account miner-account--balance">
                                {{ miner.stashAccount.balance | formatCoin }}
                            </div>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('fireMined') !== -1"
                            field="fireMined"
                            label="Fire mined"
                            :sortable="true"
                            :numeric="true"
                            cell-class="miners-list--cell"
                        >
                            {{ miner.fireMined | formatCoin }}
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('lastExtrinsics') !== -1"
                            label="Last extrinsics"
                            cell-class="miners-list--cell-top"
                        >
                            <table class="records-table">
                                <tr v-for="extrinsic of miner.controllerAccount.extrinsics">
                                    <td :title="extrinsic.date | formatDatetime">{{ extrinsic.date | formatTime }}</td>
                                    <td :class="{'extrinsic--failed': !extrinsic.isSuccessful}">{{
                                            extrinsic.action
                                        }}
                                    </td>
                                </tr>
                            </table>
                            <hr/>
                            <table class="records-table">
                                <tr v-for="extrinsic of miner.stashAccount.extrinsics">
                                    <td :title="extrinsic.date | formatDatetime">{{ extrinsic.date | formatTime }}</td>
                                    <td :class="{'extrinsic--failed': !extrinsic.isSuccessful}">{{
                                            extrinsic.action
                                        }}
                                    </td>
                                </tr>
                            </table>
                        </b-table-column>

                        <b-table-column
                            v-if="visibleColumns.indexOf('lastRewards') !== -1"
                            label="Last rewards"
                            cell-class="miners-list--cell"
                        >
                            <table class="records-table">
                                <tr v-for="reward of miner.minedRewards">
                                    <td :title="reward.date | formatDatetime">{{ reward.date | formatTime }}</td>
                                    <td>{{ reward.fire | formatCoin }}</td>
                                    <td>{{ reward.reason }}</td>
                                </tr>
                            </table>
                        </b-table-column>

                        <b-table-column
                            label="Actions"
                            width="50px"
                            cell-class="miners-list--cell"
                        >
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
            </div>
        </div>

        <b-modal
            :active.sync="isMinerFormModalVisible"
            :width="600"
        >
            <MinerFormView
                ref="minerFormView"
                @miner:save="hideMinerForm"
            />
        </b-modal>
    </div>
</template>

<script lang="ts">
import MinerFormView from '#/Monitor/Component/Miner/FormView.vue';
import Miner from '#/Monitor/Model/Miner';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager';
import Identicon from '@polkadot/vue-identicon';
import cloneDeep from 'lodash-es/cloneDeep';
import { Ref, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


declare const window;

const ConfigStore = namespace('Monitor/Config');

@Component({
    components: {
        MinerFormView,
        Identicon,
    }
})
export default class MinersView
    extends BaseComponent
{

    @Ref()
    protected minerFormView : MinerFormView;

    @Inject()
    protected monitorApi : MonitorApi = null;


    protected tableKey : number = 0;

    protected isMinerFormModalVisible : boolean = false;

    protected isLoading : boolean = false;

    @ConfigStore.State('visibleColumns')
    protected visibleColumns : string[];

    protected get miners() : Miner[]
    {
        return Miner.findAll<Miner>();
    }

    public async created()
    {
        this.isLoading = true;
        await this.monitorApi.fetchMiners(this.miners);
        this.isLoading = false;
    }

    protected showMinerForm(miner : Miner)
    {
        const managedMiner = new Miner();
        if (miner) {
            managedMiner.setData(cloneDeep(miner));
        }
        this.isMinerFormModalVisible = true;

        this.$nextTick(() => {
            this.minerFormView.setMiner(managedMiner);
        });
    }

    protected hideMinerForm(miner : Miner)
    {
        this.isMinerFormModalVisible = false;
        if (miner) {
            const newMiners = this.miners.filter(_miner => _miner.id === miner.id);
            this.monitorApi.fetchMiners(newMiners);
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
                Miner.delete(miner);
            }
        });
    }

    @Watch('visibleColumns')
    protected onColumnsChange()
    {
        ++this.tableKey;
        this.$store.dispatch('Monitor/Config/setVisibleColumns', this.visibleColumns);
    }

}
</script>

<style lang="scss">
.miners-view {
    .b-table {
        .button {
            height: 1.5em;
            padding: 0 8px;
        }

        td {
            vertical-align: middle;
        }
    }

    .miners-list {
        &__row--loading {
            td {
                color: $grey;
            }
        }

        &--cell-top {
            vertical-align: top !important;
        }
    }

    .dropdown-menu {
        left: auto;
        right: 0;
    }

    .miner-account {
        display: inline-flex;
        height: 42px;
        margin: 0;
        align-items: center;

        &--address {
            .account-icon {
                cursor: pointer;
            }

            span {
                display: inline-block;
                height: 32px;
                line-height: 32px;
                margin-left: 20px;
            }

            svg {
                float: left;
            }
        }
    }

    .records-table {
        margin: 0 !important;
        width: auto;

        td {
            padding: 0 0 0 10px;
            font-size: 0.7rem;
            border: none;
        }

        td:first-child {
            padding-left: 0;
            text-align: right;
        }
    }

    hr {
        margin: 5px 20%;
        width: 60%;
        height: 1px;
        background-color: #555;
    }
}

.extrinsic--failed {
    color: red;
}
</style>
