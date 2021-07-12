<template>
    <b-modal
        :active.sync="isModalVisible"
        :width="600"
    >
        <div class="account-form">
            <ui-block title="Payout Target form">
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
                                native-type="submit"
                                type="is-primary"
                                class="is-pulled-right"
                            >Save
                            </b-button>
                        </div>
                    </form>

                </template>
            </ui-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Account from '#/Monitor/Domain/Model/Account';
import Miner from '#/Monitor/Domain/Model/Miner';
import AccountService from '#/Monitor/Domain/Service/AccountService';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import Repository from '@/core/Store/Repository';
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
    protected accountService : AccountService;

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

        const result = await this.accountService.fetchNew(this.account);
        if (result) {
            const accountRepository = Repository.get(Account);
            accountRepository.persist(this.account);

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
