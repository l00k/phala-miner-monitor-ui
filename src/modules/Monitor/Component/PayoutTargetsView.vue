<template>
    <div class="card mb-4 accounts-view">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <span>Payout Targets</span>
                <b-button
                    size="is-small"
                    type="is-success"
                    class="is-pulled-right"
                    @click="showAccountForm()"
                >Add payout target
                </b-button>
            </div>
        </header>
        <div class="card-content">
            <div class="content">

                <b-table
                    ref="accounts"
                    :data="accounts"
                    :loading="isLoading"
                    class="accounts-list"
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

                    <template slot-scope="{ row: account }">
                        <b-table-column
                            field="name"
                            label="Name"
                            :sortable="true"
                        >
                            <div class="account-name">
                                <span>{{ account.name }}</span>
                            </div>
                        </b-table-column>

                        <b-table-column
                            field="address"
                            label="Address"
                            :sortable="true"
                        >
                            <div class="account-address">
                                <Identicon
                                    :size="32"
                                    :value="account.address"
                                    class="js-clipboard account-icon"
                                    :data-clipboard-text="account.address"
                                />
                                <div class="address-block">
                                    <b-tooltip
                                        v-if="account.isUnknown"
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
                                    <span>{{ account.address | formatAddress }}</span>
                                </div>
                            </div>
                        </b-table-column>

                        <b-table-column
                            field="balance"
                            label="Balance"
                            :sortable="true"
                            :numeric="true"
                        >
                            {{ account.balance | formatCoin }}
                        </b-table-column>

                        <b-table-column
                            field="fire"
                            label="Fire"
                            :sortable="true"
                            :numeric="true"
                        >
                            {{ account.fire | formatCoin }}
                        </b-table-column>

                        <b-table-column
                            label="Last rewards"
                        >
                            <table class="records-table">
                                <tr v-for="reward of account.receivedRewards">
                                    <td :title="reward.date | formatDatetime">{{ reward.date | formatTime }}</td>
                                    <td>{{ reward.fire | formatCoin }}</td>
                                    <td>{{ reward.reason }}</td>
                                </tr>
                            </table>
                        </b-table-column>

                        <b-table-column
                            label="Actions"
                            width="50px"
                            cell-class="accounts-list--cell-actions"
                        >
                            <b-button
                                size="is-small"
                                type="is-light"
                                @click="showAccountForm(account)"
                            >Edit
                            </b-button>
                            <b-button
                                size="is-small"
                                type="is-light"
                                @click="findMiners(account)"
                            >Find miners
                            </b-button>
                            <b-button
                                size="is-small"
                                type="is-warning is-light"
                                @click="showAccountStats(account)"
                            >Stats
                            </b-button>
                            <b-button
                                size="is-small"
                                type="is-danger"
                                @click="deleteAccount(account)"
                            >Delete
                            </b-button>
                        </b-table-column>
                    </template>
                </b-table>
            </div>
        </div>

        <AccountFormView
            ref="accountFormView"
            @account:save="hideAccountForm"
        />

        <PayoutTargetStatsView
            ref="payoutTargetStatsView"
        />
    </div>
</template>

<script lang="ts">
import AccountFormView from '#/Monitor/Component/Account/FormView.vue';
import PayoutTargetStatsView from '#/Monitor/Component/Stats/PayoutTargetStatsView.vue';
import Account from '#/Monitor/Domain/Model/Account';
import Miner from '#/Monitor/Domain/Model/Miner';
import AccountService from '#/Monitor/Domain/Service/AccountService';
import MinerService from '#/Monitor/Domain/Service/MinerService';
import Repository from '@/core/Store/Repository';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager';
import Identicon from '@polkadot/vue-identicon';
import { ToastProgrammatic as Toast } from 'buefy';
import cloneDeep from 'lodash-es/cloneDeep';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


declare const window;

const AccountStore = namespace('Monitor/Account');

@Component({
    components: {
        PayoutTargetStatsView,
        AccountFormView,
        Identicon,
    }
})
export default class PayoutTargetsView
    extends BaseComponent
{

    @Ref()
    protected accountFormView : AccountFormView;

    @Ref()
    protected payoutTargetStatsView : AccountFormView;

    @Inject()
    protected accountService : AccountService;

    @Inject()
    protected minerService : MinerService;

    protected isLoading : boolean = false;

    protected accounts : Account[] = [];

    protected loadAccounts()
    {
        const accountRepository = Repository.get(Account);
        this.accounts = accountRepository.findAll<Account>();
    }

    public async created()
    {
        this.loadAccounts();

        this.isLoading = true;
        await this.accountService.fetch(this.accounts);
        this.isLoading = false;
    }

    protected showAccountForm(account : Account)
    {
        const managedAccount = new Account();
        if (account) {
            managedAccount.setData(cloneDeep(account));
        }

        this.accountFormView.show(managedAccount);
    }

    protected showAccountStats(account : Account)
    {
        this.payoutTargetStatsView.show(account);
    }

    protected hideAccountForm(account : Account)
    {
        if (account) {
            const newAccounts = this.accounts.filter(_account => _account.id === account.id);
            this.accountService.fetch(newAccounts);
        }

        this.loadAccounts();
    }

    protected deleteAccount(account : Account)
    {
        this.$buefy.dialog.confirm({
            title: 'Deleting account',
            message: 'Are you sure you want to <b>delete</b> this account?',
            confirmText: 'Delete account',
            type: 'is-danger',
            onConfirm: () => {
                const accountRepository = Repository.get(Account);
                accountRepository.delete(account);
            }
        });
    }

    protected async findMiners(account : Account)
    {
        const confirmed = await this.confirm({
            title: 'Find miners',
            message: 'Only already indexed account will be found. Your miner has to submit successful syncWorkerState to be indexed.',
            confirmText: 'Search miners',
            type: 'is-primary',
        });
        if (!confirmed) {
            return;
        }

        const minerRepository = Repository.get(Miner);

        const oldMinerAddresses = minerRepository.findAll<Miner>()
            .map(miner => miner.controllerAccount.address);

        const foundMiners : Miner[] = await this.minerService.findByPayoutTarget(account);
        const newMiners : Miner[] = foundMiners
            .filter(_foundMiner => oldMinerAddresses.indexOf(_foundMiner.controllerAccount.address) === -1);

        if (newMiners.length) {
            const confirmed = await this.confirm({
                title: 'Find miners',
                message: `${ newMiners.length } new miners has been found. Would you like to add them?`,
                confirmText: 'Add miners',
                type: 'is-success',
            });

            if (confirmed) {
                for (const miner of newMiners) {
                    minerRepository.persist(miner);
                }

                Toast.open({
                    message: `${ newMiners.length } new miners addded`,
                    type: 'is-success',
                    position: 'is-bottom-right',
                });
            }
        }
        else {
            Toast.open({
                message: 'Nothing found',
                type: 'is-danger',
                position: 'is-bottom-right',
            });
        }
    }

}
</script>

<style lang="scss">
.accounts-view {
    .b-table {
        .button {
            height: 1.5em;
            padding: 0 8px;
        }

        td {
            vertical-align: middle;
        }
    }

    .accounts-list {
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

    .account-address {
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
