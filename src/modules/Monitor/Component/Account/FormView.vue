<template>
    <b-modal
        :active.sync="isModalVisible"
        :width="600"
    >
        <div class="account-form">
            <be-block title="Payout Target form">
                <template>
                    <form @submit.prevent="submit">
                        <b-field label="Address" label-position="on-border">
                            <b-input v-model="account.address"></b-input>
                        </b-field>

                        <b-field label="Name" label-position="on-border">
                            <b-input v-model="account.name"></b-input>
                        </b-field>

                        <div class="is-clearfix">
                            <b-button
                                type="is-primary"
                                class="is-pulled-right"
                                @click="submit"
                            >Save
                            </b-button>
                        </div>
                    </form>

                </template>
            </be-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Account from '#/Monitor/Model/Account';
import Miner from '#/Monitor/Model/Miner';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager/index';
import { ToastProgrammatic as Toast } from 'buefy';
import { namespace } from 'vuex-class';


const AccountStore = namespace('Monitor/Account');

@Component()
export default class FormView
    extends BaseComponent
{

    @Inject()
    protected monitorApi : MonitorApi;

    protected isModalVisible : boolean = false;

    protected account : Account = new Account();


    public show(account : Account)
    {
        this.account = account;

        this.isModalVisible = true;
    }

    protected async submit()
    {
        const isNew = !this.account['@id'];

        const result = await this.monitorApi.fetchNewAccount(this.account);
        if (result) {
            Account.persist(this.account);

            Toast.open({
                message: isNew ? 'Created!' : 'Saved!',
                type: 'is-success',
                position: 'is-bottom-right',
            });

            this.$emit('account:save', this.account);
            this.$emit(isNew ? 'account:created' : 'account:updated', this.account);

            this.isModalVisible = false;
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

<style scoped lang="scss">
.m-address-rename {
    font-size: 1rem;
    font-family: $family-monospace;
}
</style>
