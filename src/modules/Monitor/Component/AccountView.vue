<template>
    <div class="card mb-4 accounts-view">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <span>{{ type | ucfirst }} accounts</span>
                <b-button
                    size="is-small"
                    type="is-success"
                    class="is-pulled-right"
                    @click="showAccountForm()"
                >Add account</b-button>
            </div>
        </header>
        <div class="card-content">
            <div class="content">

                <be-table
                    ref="accounts"
                    :data="accounts"
                    :loading="isLoading"
                    class="accounts-list"
                >
                    <template slot-scope="{ row: account }">
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
                                <span>{{ account.addressShort }}</span>
                            </div>
                        </b-table-column>

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
                            field="balance"
                            label="Balance"
                            :sortable="true"
                            :numeric="true"
                        >
                            {{ account.balanceReadable }}
                        </b-table-column>

                        <b-table-column
                            field="fire"
                            label="Fire"
                            :sortable="true"
                            :numeric="true"
                        >
                            {{ account.fireReadable }}
                        </b-table-column>

                        <b-table-column
                            field="lastUpdate"
                            label="Last update"
                            :sortable="true"
                            :datatype="true"
                        >
                            <span>{{ account.lastUpdate | formatDatetime }}</span>
                        </b-table-column>

                        <b-table-column
                            label="Actions"
                            width="50px"
                        >
                            <b-button
                                size="is-small"
                                type="is-primary"
                                @click="showAccountForm(account)"
                            >Edit</b-button>
                            <b-button
                                size="is-small"
                                type="is-danger"
                                @click="deleteAccount(account)"
                            >Delete</b-button>
                        </b-table-column>
                    </template>
                </be-table>
            </div>
        </div>

        <b-modal
            :active.sync="isAccountFormModalVisible"
            :width="600"
        >
            <AccountFormView
                ref="accountFormView"
                @submit="hideAccountForm"
            />
        </b-modal>
    </div>
</template>

<script lang="ts">
import AccountFormView from '#/Monitor/Component/Account/FormView.vue';
import Account, { AccountType } from '#/Monitor/Model/Account';
import { ApiResourceStatus } from '#/Monitor/Model/ApiResource';
import MonitorApi from '#/Monitor/Service/ScannerService';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv-js-tools/ObjectManager';
import Identicon from '@polkadot/vue-identicon';
import cloneDeep from 'lodash-es/cloneDeep';
import { Ref, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';


declare const window;

const AccountStore = namespace('Monitor/Account');

@Component({
    components: {
        AccountFormView,
        Identicon,
    }
})
export default class AccountsView
    extends BaseComponent
{

    protected AccountType = AccountType;
    protected ApiResourceStatus = ApiResourceStatus;

    @Prop()
    protected type : AccountType;

    @Ref()
    protected accountFormView : AccountFormView;

    @Inject()
    protected scannerService : MonitorApi = null;

    protected isAccountFormModalVisible : boolean = false;

    protected isLoading : boolean = false;

    protected get accounts() : Account[]
    {
        return Account.findAll<Account>()
            .filter(account => account.types.indexOf(this.type) !== -1);
    }

    public async created()
    {
        this.scannerService.fetch(this.accounts);
    }

    protected showAccountForm(account : Account)
    {
        const managedAccount = new Account(account ? cloneDeep(account) : { type: this.type });
        this.isAccountFormModalVisible = true;

        this.$nextTick(() => {
            this.accountFormView.setAccount(managedAccount);
        });
    }

    protected hideAccountForm(account : Account)
    {
        this.isAccountFormModalVisible = false;
        if (account) {
            this.scannerService.fetchSingle(account);
        }
    }

    protected deleteAccount(account : Account)
    {
        this.$buefy.dialog.confirm({
            title: 'Deleting account',
            message: 'Are you sure you want to <b>delete</b> this account?',
            confirmText: 'Delete account',
            type: 'is-danger',
            onConfirm: () => {
                Account.delete(account);
            }
        });
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
            min-height: 32px;
            vertical-align: middle;
        }
    }

    .account-name {
        span {
            margin-right: 10px;
            vertical-align: middle;
        }
    }

    .account-address {
        height: 32px;

        .account-icon {
            cursor: pointer;
        }

        span {
            height: 32px;
            line-height: 32px;
            margin: 0 0 0 10px !important;;
        }

        svg {
            float: left;
        }
    }

    .account-list {
        &__row--loading {
            td {
                color: $grey;
            }
        }
    }
}
</style>
