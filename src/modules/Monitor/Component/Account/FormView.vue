<template>
    <div class="account-form">
        <be-block title="Account form">
            <template>
                <form @submit.prevent="submit">
                    <b-field label="Type" label-position="on-border">
                        <b-select v-model="account.type">
                            <option
                                v-for="_type in AccountType"
                                :value="_type"
                                :key="_type"
                            >{{ _type | ucfirst }}</option>
                        </b-select>
                    </b-field>

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
                        >Save</b-button>
                    </div>
                </form>

            </template>
        </be-block>
    </div>
</template>

<script lang="ts">
import { Component } from '@/core/Vue/Annotations';
import { ToastProgrammatic as Toast } from 'buefy';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import BaseComponent from '@/core/Vue/BaseComponent.vue';

import Account, { AccountType } from '#/Monitor/Model/Account';


const AccountStore = namespace('Monitor/Account');

@Component()
export default class FormView
    extends BaseComponent
{

    protected AccountType = AccountType;

    protected account : Account = new Account();

    public setAccount(account : Account)
    {
        this.account = account;
    }

    protected submit()
    {
        Account.persist(this.account)

        Toast.open({
            message: 'Created!',
            type: 'is-success',
            position: 'is-bottom-right',
        });

        this.$emit('submit', this.account);
    }

}
</script>

<style scoped lang="scss">
.m-address-rename {
    font-size: 1rem;
    font-family: $family-monospace;
}
</style>
