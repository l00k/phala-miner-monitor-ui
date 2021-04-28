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

                <div class="has-text-right mb-5">
                    <b-field
                        label-position="on-border"
                        label="Visibility"
                        class="is-pulled-left mr-2"
                    >
                        <b-select
                            v-model="visiblityFilter"
                            placeholder="Visibility"
                            size="is-small"
                            icon-pack="fas"
                            icon="eye"
                        >
                            <option value="any">Show all</option>
                            <option value="hiddenOnly">Only hidden</option>
                            <option value="visibleOnly">Only visible</option>
                        </b-select>
                    </b-field>
                </div>

                <b-table
                    ref="table"
                    :data="visibleMiners"
                    :loading="isLoading"
                    :checkable="true"
                    :checked-rows.sync="selectedEntires"
                    :debounce-search="1000"
                    :paginated="false"
                    :default-sort="defaultSort.field"
                    :default-sort-direction="defaultSort.order"
                    class="miners-list"
                    :row-class="miner => miner.isVisible ? 'miner-row--visible' : 'miner-row--hidden'"
                >
                    <template slot="empty">
                        <slot name="empty">
                            <div class="content has-text-grey has-text-centered">
                                <p>
                                    <b-icon
                                        pack="fas"
                                        icon="heart-broken"
                                        size="is-small"
                                        class="is-vcentered"
                                    />
                                    Nothing here.
                                </p>
                            </div>
                        </slot>
                    </template>

                    <template slot-scope="{ row: miner }">
                        <b-table-column
                            field="name"
                            label="Name"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list__cell"
                        >
                            <span>{{ miner.name }}</span>
                        </b-table-column>

                        <b-table-column
                            field="controllerAccount.address"
                            label="Address"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list__cell"
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
                                <div class="address-block">
                                    <b-tooltip
                                        v-if="miner.isUnknown"
                                        position="is-top"
                                        label="Not found"
                                        class="is-vcentered"
                                    >
                                        <b-icon
                                            icon="exclamation-triangle"
                                            type="is-danger"
                                            size="is-small"
                                            class="is-vcentered mr-2"
                                        />
                                    </b-tooltip>
                                    <span>{{ miner.controllerAccount.address | formatAddress }}</span>
                                </div>
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
                                    <div class="address-block">
                                        <span>{{ miner.stashAccount.address | formatAddress }}</span>
                                    </div>
                                </b-field>
                            </div>
                        </b-table-column>

                        <b-table-column
                            field="state"
                            label="State"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list__cell miners-list__cell--state"
                        >
                            <template #searchable="{ column }">
                                <b-taginput
                                    v-model="filters"
                                    placeholder="Type..."
                                    :data="allowedListFilters"
                                    field="label"
                                    :autocomplete="true"
                                    :open-on-focus="true"
                                    type="is-primary is-light"
                                    class="has-text-weight-normal"
                                />
                            </template>

                            <div>
                                <b-tag
                                    :type="miner.state === 'Mining' ? 'is-info' : 'is-warning'"
                                    size="is-micro"
                                >{{ miner.state }}</b-tag>
                            </div>
                            <div>
                                <b-tag v-if="miner.isOnline" type="is-success" size="is-micro">Online</b-tag>
                                <b-tag v-if="!miner.isOnline" type="is-danger" size="is-micro">Offline</b-tag>
                                <b-tag v-if="miner.isRewarding" type="is-success" size="is-micro">Rewarding</b-tag>
                                <b-tag v-if="!miner.isRewarding" type="is-danger" size="is-micro">Not rewarding</b-tag>
                            </div>
                            <div
                                v-if="miner instanceof Miner && miner.deviceState"
                                class="miner-device-state"
                            >
                                <b-tooltip
                                    :label="miner.deviceState.updateTag.hint"
                                    position="is-top"
                                    :type="miner.deviceState.updateTag.type"
                                >
                                    <b-tag
                                        :type="miner.deviceState.updateTag.type"
                                        size="is-micro"
                                    >S
                                    </b-tag>
                                </b-tooltip>
                                <b-tooltip
                                    :label="miner.deviceState.cpuTag.hint"
                                    position="is-top"
                                    :type="miner.deviceState.cpuTag.type"
                                >
                                    <b-tag
                                        :type="miner.deviceState.cpuTag.type"
                                        size="is-micro"
                                    >CPU
                                    </b-tag>
                                </b-tooltip>
                                <b-tooltip
                                    v-if="miner.deviceState.node"
                                    :label="miner.deviceState.nodeTag.hint"
                                    position="is-top"
                                    :type="miner.deviceState.nodeTag.type"
                                >
                                    <b-tag
                                        :type="miner.deviceState.nodeTag.type"
                                        size="is-micro"
                                    >Node
                                    </b-tag>
                                </b-tooltip>
                                <b-tooltip
                                    :label="miner.deviceState.runtimeTag.hint"
                                    position="is-top"
                                    :type="miner.deviceState.runtimeTag.type"
                                >
                                    <b-tag
                                        :type="miner.deviceState.runtimeTag.type"
                                        size="is-micro"
                                    >Runtime
                                    </b-tag>
                                </b-tooltip>
                                <b-tooltip
                                    :label="miner.deviceState.hostTag.hint"
                                    position="is-top"
                                    :type="miner.deviceState.hostTag.type"
                                >
                                    <b-tag
                                        :type="miner.deviceState.hostTag.type"
                                        size="is-micro"
                                    >Host
                                    </b-tag>
                                </b-tooltip>
                            </div>
                        </b-table-column>

                        <b-table-column
                            field="score"
                            label="Score"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list__cell"
                        >
                            <span>{{ miner.score }}</span>
                        </b-table-column>

                        <b-table-column
                            label="Info"
                            cell-class="miners-list__cell"
                        >
                            <div><span class="has-text-weight-bold">Commission:</span> {{ miner.commission }}%</div>
                            <div><span class="has-text-weight-bold">Confidence Level:</span> {{ miner.confidenceLevel }}</div>
                            <div><span class="has-text-weight-bold">Runtime Version:</span> {{ miner.runtimeVersion }}</div>
                        </b-table-column>

                        <b-table-column
                            field="stashAccount.stake"
                            label="Stake"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list__cell"
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
                            field="controllerAccount.balance"
                            label="Balance"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list__cell"
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
                            field="fireMined"
                            label="Fire mined"
                            :numeric="true"
                            :sortable="true"
                            :searchable="true"
                            cell-class="miners-list__cell"
                        >
                            {{ miner.fireMined | formatCoin }}
                        </b-table-column>

                        <b-table-column
                            label="Last extrinsics"
                            cell-class="miners-list__cell"
                        >
                            <table class="records-table">
                                <tr v-for="extrinsic of miner.controllerAccount.extrinsics">
                                    <td :title="extrinsic.date | formatDatetime">{{ extrinsic.date | formatTime }}</td>
                                    <td :class="{'extrinsic--failed': !extrinsic.isSuccessful}">{{ extrinsic.action }}</td>
                                </tr>
                            </table>
                        </b-table-column>

                        <b-table-column
                            label="Last rewards"
                            cell-class="miners-list__cell"
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
                            :searchable="true"
                            cell-class="miners-list__cell--actions"
                        >
                            <template #searchable>
                                <b-button
                                    size="is-small"
                                    type="is-warning is-light"
                                    @click="clearFilters()"
                                >Clear
                                </b-button>
                            </template>
                            <b-button
                                size="is-small"
                                type="is-light"
                                @click="showMinerForm(miner)"
                            >Edit
                            </b-button>
                            <b-button
                                size="is-small"
                                type="is-warning is-light"
                                @click="showMinerStats(miner)"
                            >Stats
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

        <MinerFormView
            ref="minerFormView"
            @miner:save="onMinerSave"
        />

        <MinerStatsView
            ref="minerStatsView"
        />
    </div>
</template>

<script lang="ts">
import AccountFormView from '#/Monitor/Component/Account/FormView.vue';
import MinerFormView from '#/Monitor/Component/Miner/FormView.vue';
import MinerStatsView from '#/Monitor/Component/Stats/MinerStatsView.vue';
import Account from '#/Monitor/Model/Account';
import Miner from '#/Monitor/Model/Miner';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { EventBus } from '@100k/intiv/EventBus';
import { Inject } from '@100k/intiv/ObjectManager';
import Identicon from '@polkadot/vue-identicon';
import { ToastProgrammatic } from 'buefy';
import { BTable } from 'buefy/src/components/table';
import cloneDeep from 'lodash-es/cloneDeep';
import { Ref, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { ContainerState } from '../Model/DeviceState';


declare const window;

const ConfigStore = namespace('Monitor/Config');



type FilterType = {
    label : string,
    callee : (miner : Miner) => boolean
};

@Component({
    components: {
        MinerStatsView,
        MinerFormView,
        Identicon,
    }
})
export default class MinersView
    extends BaseComponent
{

    protected Miner = Miner;
    protected ContainerState = ContainerState;

    @Ref('table')
    protected $table : BTable;

    @Ref('minerFormView')
    protected $minerFormView : MinerFormView;

    @Ref('minerStatsView')
    protected $minerStatsView : MinerStatsView;

    @Inject()
    protected eventBus : EventBus;

    @Inject()
    protected monitorApi : MonitorApi;


    protected isLoading : boolean = false;

    protected allowedListFilters : FilterType[] = [
        { label: 'State: Free', callee: (miner : Miner) => miner.state === 'Free' },
        { label: 'State: Mining Pending', callee: (miner : Miner) => miner.state === 'MiningPending' },
        { label: 'State: Mining', callee: (miner : Miner) => miner.state === 'Mining' },
        { label: 'Online', callee: (miner : Miner) => miner.isOnline },
        { label: 'Offline', callee: (miner : Miner) => !miner.isOnline },
        { label: 'Rewarding', callee: (miner : Miner) => miner.isRewarding },
        { label: 'Not rewarding', callee: (miner : Miner) => !miner.isRewarding },
        { label: 'Node OK', callee: (miner : Miner) => miner.deviceState?.node?.state === ContainerState.Running },
        { label: 'Node not OK', callee: (miner : Miner) => miner.deviceState?.node?.state !== ContainerState.Running },
        { label: 'Runtime OK', callee: (miner : Miner) => miner.deviceState?.runtime?.state === ContainerState.Running },
        { label: 'Runtime not OK', callee: (miner : Miner) => miner.deviceState?.runtime?.state !== ContainerState.Running },
        { label: 'Host OK', callee: (miner : Miner) => miner.deviceState?.runtime?.state === ContainerState.Running },
        { label: 'Host not OK', callee: (miner : Miner) => miner.deviceState?.runtime?.state !== ContainerState.Running },
    ];

    protected visiblityFilter : string = 'visibleOnly';

    protected filters : FilterType[] = [];

    protected miners : Miner[] = [];

    protected selectedEntires : any[] = [];

    protected get defaultSort() : Object
    {
        return { field: 'name', order: 'asc' };
    }

    public get visibleMiners() : Miner[]
    {
        let miners = this.miners;

        if (this.visiblityFilter !== 'any') {
            const value = this.visiblityFilter === 'visibleOnly';
            miners = miners.filter(miner => miner.isVisible === value);
        }

        for (const filter of this.filters) {
            miners = miners.filter(miner => filter.callee(miner));
        }

        return miners;
    }

    protected showMinerStats(miner : Miner)
    {
        this.$minerStatsView.show(miner);
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

    public separateStashAccount(miner : Miner) : boolean
    {
        return miner.controllerAccount.address !== miner.stashAccount.address;
    }

    public showMinerForm(miner : Miner)
    {
        const managedMiner = new Miner();
        if (miner) {
            managedMiner.setData(cloneDeep(miner));
        }

        this.$minerFormView.show(managedMiner);
    }

    public clearFilters()
    {
        this.$table.filters = {};
        this.filters = [];
    }

    public async changeVisibilityMiners(miners : Miner[], visible : boolean)
    {
        for (const miner of miners) {
            miner.isVisible = visible;
            Miner.persist(miner);
        }

        ToastProgrammatic.open({
            message: `Visiblity changed for ${ miners.length } miners`,
            type: 'is-success',
            position: 'is-bottom-right',
        });

        this.selectedEntires = [];
    }

    public async deleteMiners(miners : Miner[])
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

        this.selectedEntires = [];
    }

    public onMinerSave(miner : Miner)
    {
        if (miner) {
            const newMiners = this.miners.filter(_miner => _miner.id === miner.id);
            this.monitorApi.fetchMiners(newMiners);
        }
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

        &__cell--state {
            .tag {
                margin-right: 4px;
            }
        }
        &__cell--actions {
            text-align: right;
        }

        .miner-row--hidden {
            opacity: 0.5;
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
                svg {
                    float: left;
                }
            }

            .address-block {
                display: inline-block;
                margin-left: 10px;
                height: 32px;
                line-height: 32px;
                white-space: nowrap;
            }

        }
    }

    .miner-device-state {
        white-space: nowrap;
    }

    .records-table {
        margin: 0 !important;
        width: auto;

        td {
            padding: 0 0 0 10px;
            font-size: 0.7rem;
            border: none;
            white-space: nowrap;
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

    .extrinsic--failed {
        color: red;
    }
}
</style>
