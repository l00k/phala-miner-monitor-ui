<template>
    <div class="l-page m-page-index">

        <div class="columns justify-spece-between">
            <div class="column is-12">
                <ConfigView/>
                <MinersView/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { DependencyInjection, Inject } from '@100k/intiv-js-tools/ObjectManager';

import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Route } from '@/core/Vue/Annotations';

import ConfigView from '#/Monitor/Component/ConfigView.vue';
import MinersView from '#/Monitor/Component/MinersView.vue';

import ParachainApi from '#/Phala/Service/Api/ParachainApi';
import SubscanApi from '#/Phala/Service/Api/SubscanApi';


const MinerStore = namespace('Monitor/Miner');

@Route('/', 'monitor')
@Component({
    components: {
        ConfigView,
        MinersView,
    }
})
@DependencyInjection()
export default class IndexPage
    extends BaseComponent
{

    @Inject()
    protected subscanApi : SubscanApi;

    @Inject()
    protected parachainApi : ParachainApi;

}
</script>
