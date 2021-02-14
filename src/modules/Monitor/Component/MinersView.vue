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

                <div class="mb-4 has-text-right">
                    <b-field class="is-pulled-left">
                        <b-button
                            :type="showHiddenEntries ? 'is-primary' : ''"
                            size="is-small"
                            @click="switchHiddenEntriesVisibility"
                        >
                            <b-icon
                                pack="fas"
                                :icon="showHiddenEntries ? 'eye' : 'eye-slash'"
                                size="is-small"
                                class="is-vcentered"
                                :key="`showHiddenEntries${showHiddenEntries}`"
                            />
                            <span>Show hidden entries</span>
                        </b-button>
                    </b-field>

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

                <b-table
                    ref="miners"
                    :data="visibleMiners"
                    :loading="isLoading"
                    :checkable="true"
                    :checked-rows.sync="selectedEntires"
                    :debounce-search="1000"
                    :paginated="false"
                    default-sort="score"
                    default-sort-direction="desc"
                    class="miners-list"
                    :key="tableKey"
                >
                    <template slot="empty">
                        <slot name="empty">
                            <div class="content has-text-grey has-text-centered">
                                <p>
                                    <b-icon pack="fas" icon="heart-broken" size="is-small"/>
                                    Nothing here.
                                </p>
                            </div>
                        </slot>
                    </template>

                    <template slot-scope="{ row: miner }">
                        <b-table-column
                            :visible="visibleColumns.indexOf('name') !== -1"
                            field="name"
                            label="Name"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.name }}</span>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('address') !== -1"
                            field="controllerAccount.address"
                            label="Address"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell-top"
                        >
                            <b-field
                                :label="separateStashAccount(miner) ? 'Controller' : ''"
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

                            <div v-if="separateStashAccount(miner)">
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
                            </div>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('score') !== -1"
                            field="score"
                            label="Score"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.score }}</span>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('state') !== -1"
                            field="state"
                            label="State"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.state }}</span>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('commission') !== -1"
                            field="commission"
                            label="Commission"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell"
                        >
                            <span>{{ miner.commission }}</span>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('stake') !== -1"
                            field="stashAccount.stake"
                            label="Stake"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell"
                        >
                            <div class="miner-account miner-account--stake">
                                {{ miner.controllerAccount.stake | formatCoin }}
                            </div>
                            <div v-if="separateStashAccount(miner)">
                                <hr/>
                                <div class="miner-account miner-account--stake">
                                    {{ miner.stashAccount.stake | formatCoin }}
                                </div>
                            </div>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('balance') !== -1"
                            field="controllerAccount.balance"
                            label="Balance"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell-top"
                        >
                            <div class="miner-account miner-account--balance">
                                {{ miner.controllerAccount.balance | formatCoin }}
                            </div>
                            <div v-if="separateStashAccount(miner)">
                                <hr/>
                                <div class="miner-account miner-account--balance">
                                    {{ miner.stashAccount.balance | formatCoin }}
                                </div>
                            </div>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('fireMined') !== -1"
                            field="fireMined"
                            label="Fire mined"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list--cell"
                        >
                            {{ miner.fireMined | formatCoin }}
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('lastExtrinsics') !== -1"
                            label="Last extrinsics"
                            cell-class="miners-list--cell-top"
                        >
                            <table class="records-table">
                                <tr v-for="extrinsic of miner.controllerAccount.extrinsics">
                                    <td :title="extrinsic.date | formatDatetime">{{ extrinsic.date | formatTime }}</td>
                                    <td :class="{'extrinsic--failed': !extrinsic.isSuccessful}">{{ extrinsic.action }}</td>
                                </tr>
                            </table>
                            <div v-if="separateStashAccount(miner)">
                                <hr/>
                                <table class="records-table">
                                    <tr v-for="extrinsic of miner.stashAccount.extrinsics">
                                        <td :title="extrinsic.date | formatDatetime">{{ extrinsic.date | formatTime }}</td>
                                        <td :class="{'extrinsic--failed': !extrinsic.isSuccessful}">{{ extrinsic.action }}</td>
                                    </tr>
                                </table>
                            </div>
                        </b-table-column>

                        <b-table-column
                            :visible="visibleColumns.indexOf('lastRewards') !== -1"
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
                            cell-class="miners-list--cell-actions"
                        >
                            <b-button
                                size="is-small"
                                type="is-light"
                                @click="showMinerForm(miner)"
                            >Edit
                            </b-button>
                            <b-button
                                size="is-small"
                                type="is-danger"
                                @click="deleteMiners([miner])"
                            >Delete
                            </b-button>
                        </b-table-column>
                    </template>
                </b-table>

                <div
                    v-if="selectedEntires.length > 0"
                    class="mass-actions"
                >
                    <b-button
                        size="is-small"
                        type="is-light"
                        @click="changeVisibilityMiners(selectedEntires, true)"
                    >Show
                    </b-button>
                    <b-button
                        size="is-small"
                        type="is-light"
                        @click="changeVisibilityMiners(selectedEntires, false)"
                    >Hide
                    </b-button>
                    <b-button
                        size="is-small"
                        type="is-danger"
                        @click="deleteMiners(selectedEntires)"
                    >Delete
                    </b-button>
                </div>
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
import { EventBus } from '@100k/intiv/EventBus';
import { Inject } from '@100k/intiv/ObjectManager';
import Identicon from '@polkadot/vue-identicon';
import cloneDeep from 'lodash-es/cloneDeep';
import { Ref, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { ToastProgrammatic } from 'buefy';


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
    protected eventBus : EventBus;

    @Inject()
    protected monitorApi : MonitorApi;

    protected tableKey : number = 0;

    protected isMinerFormModalVisible : boolean = false;

    protected isLoading : boolean = false;

    protected miners : Miner[] = [];

    protected get visibleMiners(): Miner[]
    {
        if (this.showHiddenEntries) {
            return this.miners;
        }
        return this.miners
            .filter(miner => miner.visible);
    }

    protected selectedEntires : any[] = [];

    @ConfigStore.State('visibleColumns')
    protected visibleColumns : string[];

    @ConfigStore.State('hiddenEntriesVisibility')
    protected hiddenEntriesVisibility : string[];

    public get showHiddenEntries(): boolean
    {
        return this.hiddenEntriesVisibility.indexOf('miners') !== -1;
    }


    protected async loadMiners()
    {
        this.miners = Miner.findAll<Miner>();

        this.isLoading = true;
        await this.monitorApi.fetchMiners(this.miners);
        this.isLoading = false;
    }

    public async created()
    {
        this.eventBus.on('database:update', (data) => {
            this.loadMiners();
        });

        this.loadMiners();
    }

    protected separateStashAccount(miner : Miner) : boolean
    {
        return miner.controllerAccount.address !== miner.stashAccount.address;
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

    protected async changeVisibilityMiners(miners : Miner[], visible : boolean)
    {
        for (const miner of miners) {
            miner.visible = visible;
        }

        ToastProgrammatic.open({
            message: `Visiblity changed for ${ miners.length } miners`,
            type: 'is-success',
            position: 'is-bottom-right',
        });
    }

    protected switchHiddenEntriesVisibility()
    {
        const newValue = this.hiddenEntriesVisibility.indexOf('miners') === -1;

        let hiddenEntriesVisibility = this.hiddenEntriesVisibility || [];
        if (newValue) {
            hiddenEntriesVisibility.push('miners');
        }
        else {
            hiddenEntriesVisibility = hiddenEntriesVisibility.filter(e => e !== 'miners');
        }

        this.$store.commit('Monitor/Config/setHiddenEntriesVisibility', hiddenEntriesVisibility);
    }

    protected async deleteMiners(miners : Miner[])
    {
        const confirmed = await this.confirm({
            title: 'Deleting miner',
            message: `Are you sure you want to <b>delete</b> ${ miners.length } miner?`,
            confirmText: `Confirm`,
            type: 'is-danger',
        });
        if (!confirmed) {
            return;
        }

        for (const miner of miners) {
            Miner.delete(miner);
        }

        ToastProgrammatic.open({
            message: `Deleted ${ miners.length } miners`,
            type: 'is-success',
            position: 'is-bottom-right',
        });
    }

    @Watch('visibleColumns')
    protected onColumnsChange()
    {
        this.$store.commit('Monitor/Config/setVisibleColumns', this.visibleColumns);
    }

}
</script>

<style lang="scss">
@import "@/assets/scss/theme/_variables";

.miners-view {
    .b-table {
        td {
            vertical-align: middle;
        }

        .button {
            height: 1.5em;
            padding: 0 8px;
        }
    }

    .mass-actions {
        position: -webkit-sticky;
        position: sticky;
        bottom: 0;
        z-index: 10;
        padding: 10px 20px;

        border-top: 2px solid $border;
        background: $card-background-color;

        .button {
            margin-right: 10px;
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

        &--cell-actions {
            text-align: right;
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
