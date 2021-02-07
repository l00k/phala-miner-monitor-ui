<template>
    <div class="l-page m-page-index">

        <div class="columns justify-spece-between">
            <div class="column is-12">
                <ConfigView/>
                <AccountView :type="AccountType.PayoutTarget"/>
                <AccountView :type="AccountType.Miner"/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import AccountView from '#/Monitor/Component/AccountView.vue';
import ConfigView from '#/Monitor/Component/ConfigView.vue';
import { Route, Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { namespace } from 'vuex-class';
import Account, { AccountType } from '../Model/Account';


const AccountStore = namespace('Monitor/Account');

@Route('/', 'monitor')
@Component({
    components: {
        AccountView,
        ConfigView,
    }
})
export default class IndexPage
    extends BaseComponent
{

    protected AccountType = AccountType;

}
</script>
