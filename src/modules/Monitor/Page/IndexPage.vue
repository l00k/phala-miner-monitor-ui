<template>
    <div class="l-page m-page-index">

        <div class="columns justify-spece-between">
            <div class="column is-12">
                <ConfigView/>
                <PayoutTargetsView/>
                <MinersView/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import PayoutTargetsView from '#/Monitor/Component/PayoutTargetsView.vue';
import ConfigView from '#/Monitor/Component/ConfigView.vue';
import MinersView from '#/Monitor/Component/MinersView.vue';
import { Route, Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { namespace } from 'vuex-class';


const AccountStore = namespace('Monitor/Account');

@Route('/', 'monitor')
@Component({
    components: {
        MinersView,
        PayoutTargetsView,
        ConfigView,
    }
})
export default class IndexPage
    extends BaseComponent
{
}
</script>
