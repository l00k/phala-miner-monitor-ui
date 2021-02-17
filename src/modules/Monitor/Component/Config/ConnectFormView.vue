<template>
    <div class="connect-form">
        <b-modal
            :active.sync="isModalVisible"
            :width="600"
        >
            <be-block title="Monitor your devices">
                <template>
                    <div
                        v-if="stage == Stage.NotConnected"
                    >
                        <b-message type="is-warning">
                            If you would like to monitor your devices status you need to verify stash account ownership.<br/>
                            <b>Why?</b><br/>
                            Without confirming ownership anyone could update your miner status.
                            After signing message in extension secret key will be stored in our database.
                            Each time device monitor script will send request with proper secret key - controller device state will be updated.
                        </b-message>

                        <div class="is-justify-content-center">
                            <b-button
                                type="is-primary"
                                :loading="isLocked"
                                :disabled="isLocked"
                                @click="connectExtension()"
                            >Connect extension
                            </b-button>
                        </div>
                    </div>
                    <div
                        v-if="stage == Stage.AccountSelect"
                    >
                        <b-message type="is-info">
                            Select payout target account and specify secret key for it.<br/>
                            You will be asked to sign message which will proof account ownership.
                        </b-message>

                        <validate-observer v-slot="{ handleSubmit, invalid }">
                            <form @submit.prevent="handleSubmit(onSubmit)">
                                <validate-provider
                                    :rules="{ required: true }"
                                    v-slot="{ validate, errors }"
                                >
                                    <b-dropdown
                                        v-model="selectedAccount"
                                        @input="validate"
                                    >
                                        <template #trigger>
                                            <div role="button" aria-haspopup="true" class="dropdown-trigger">
                                                <button
                                                    v-if="!selectedAccount"
                                                    type="button"
                                                    class="button"
                                                >
                                                    <span>Payout target account</span>
                                                    <b-icon icon="menu-down" size="is-small"/>
                                                </button>
                                                <button
                                                    v-else
                                                    type="button"
                                                    class="button account-option"
                                                >
                                                    <Identicon
                                                        :size="32"
                                                        :value="selectedAccount.address"
                                                        class="account-option__icon"
                                                    />
                                                    <div class="account-option__label">
                                                        <div class="has-text-weight-bold">{{ selectedAccount.name }}</div>
                                                        <small>{{ selectedAccount.address | formatAddress }}</small>
                                                    </div>
                                                </button>
                                            </div>
                                        </template>

                                        <b-dropdown-item
                                            v-for="account in possibleAccounts"
                                            :value="account"
                                            :key="account.id"
                                            class="account-option"
                                        >
                                            <Identicon
                                                :size="32"
                                                :value="account.address"
                                                class="account-option__icon"
                                            />
                                            <div class="account-option__label">
                                                <div class="has-text-weight-bold">{{ account.name }}</div>
                                                <small>{{ account.address | formatAddress }}</small>
                                            </div>
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </validate-provider>

                                <validate-provider
                                    name="Secret Key"
                                    :rules="{ required: true, min: 8 }"
                                    v-slot="{ errors }"
                                >
                                    <b-field
                                        label="Secret Key"
                                        label-position="on-border"
                                        :type="errors.length > 0 ? 'is-danger' : ''"
                                        :message="errors"
                                        class="mt-4"
                                    >
                                        <b-input v-model="secretKeyData.secretKey"/>
                                    </b-field>
                                </validate-provider>

                                <div class="has-text-right mt-4">
                                    <b-button
                                        native-type="submit"
                                        type="is-primary"
                                        :loading="isLocked"
                                        :disabled="isLocked || invalid"
                                        class="is-inline-block"
                                    >Verify & Submit
                                    </b-button>
                                </div>
                            </form>
                        </validate-observer>
                    </div>
                </template>
            </be-block>
        </b-modal>
    </div>
</template>

<script lang="ts">
import PayoutTargetSecretKeyData from '#/Monitor/Dto/PayoutTargetSecretKeyData';
import Account from '#/Monitor/Model/Account';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager/index';
import { web3Accounts, web3Enable, web3FromAddress, } from '@polkadot/extension-dapp';
import { InjectedExtension, InjectedAccountWithMeta, } from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util/string/toHex';
import Identicon from '@polkadot/vue-identicon';
import { ToastProgrammatic as Toast } from 'buefy';


declare const window;


enum Stage
{
    NotConnected,
    AccountSelect,
}


@Component({
    components: {
        Identicon
    }
})
export default class ConnectFormView
    extends BaseComponent
{

    protected static SS58_FORMAT = 30;

    protected Stage = Stage;

    @Inject()
    protected monitorApi : MonitorApi;

    protected isModalVisible : boolean = false;

    protected isLocked : boolean = false;

    protected stage : Stage = Stage.NotConnected;

    protected injectedExtension : InjectedExtension[] = [];

    protected extAccounts : InjectedAccountWithMeta[] = [];

    protected possibleAccounts : Account[] = [];

    protected selectedAccount : Account = null;

    protected secretKeyData : PayoutTargetSecretKeyData = new PayoutTargetSecretKeyData();

    public show()
    {
        this.isModalVisible = true;
    }

    public async connectExtension()
    {
        this.isLocked = true;

        try {
            this.injectedExtension = await web3Enable('Phala miner monitor');

            Toast.open({
                message: 'Connected to polkadot extension',
                type: 'is-success',
                position: 'is-bottom-right',
                queue: false,
            });

            this.extAccounts = await web3Accounts({ ss58Format: ConnectFormView.SS58_FORMAT });
            const payoutTargetAccounts = Account.findAll<Account>();

            this.possibleAccounts = payoutTargetAccounts
                .filter(account => this.extAccounts.find(_account => _account.address === account.address));

            if (this.possibleAccounts.length) {
                this.stage = Stage.AccountSelect;
            }
            else {
                Toast.open({
                    message: 'No account found',
                    type: 'is-warning',
                    position: 'is-bottom-right',
                    queue: false,
                });
            }
        }
        catch (e) {
            Toast.open({
                message: e.message,
                type: 'is-danger',
                position: 'is-bottom-right',
                queue: false,
            });
        }
        finally {
            this.isLocked = false;
        }
    }

    public async onSubmit()
    {
        this.isLocked = true;

        this.secretKeyData.payoutTargetAddress = this.selectedAccount.address;

        try {
            const injector = await web3FromAddress(this.selectedAccount.address);

            const signRaw = injector?.signer?.signRaw;
            if (!signRaw) {
                throw 'Something went wrong';
            }

            const { signature } = await signRaw({
                address: this.selectedAccount.address,
                data: stringToHex(`accountOwnershipConfirmation(${this.secretKeyData.secretKey})`),
                type: 'bytes',
            });

            this.secretKeyData.signature = signature;

            const result = await this.monitorApi.mutatePayoutTargetSecretKey(this.secretKeyData);

            Toast.open({
                message: 'Secret key has been updated',
                type: 'is-success',
                position: 'is-bottom-right',
            });

            this.isModalVisible = false;
        }
        catch (e) {
            Toast.open({
                message: e.message,
                type: 'is-danger',
                position: 'is-bottom-right',
            });
        }
        finally {
            this.isLocked = false;
        }
    }

}
</script>

<style lang="scss">
.connect-form {
    .modal-content {
        overflow: visible;
    }

    .account-option {
        height: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &__icon {
            svg {
                float: left;
            }
        }

        &__label {
            margin-left: 10px;
            text-align: left;
        }
    }
}
</style>
