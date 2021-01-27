<template>
    <div class="l-page m-page-index">

        <div class="columns justify-spece-between">
            <div class="column is-12">
                <ConfigView/>
                <AccountView :type="AccountType.Stash"/>
                <AccountView :type="AccountType.Controller"/>
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

    public created()
    {
        // Account.truncate();
        //
        // const stashAccount = new Account();
        // stashAccount.type = AccountType.Stash;
        // stashAccount.name = 'Stash';
        // stashAccount.address = '41u4kqTaYz2CwvbUuo6PWUkyijYG13U2Q11WcheSYSB2EB2M';
        // Account.persist(stashAccount);
        //
        // const controllerAccount = new Account();
        // controllerAccount.type = AccountType.Controller;
        // controllerAccount.name = 'sample';
        // controllerAccount.address = '43XR9kveUUvKEsWm6zAMgav84XY7SoeNFzPjWYwzwnsPRBoG';
        // Account.persist(controllerAccount);
    }

}
</script>
