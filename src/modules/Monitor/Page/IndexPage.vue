<template>
    <div class="l-page m-page-index">

        <div class="columns justify-spece-between">
            <div class="column is-12">
                <InfoView/>
                <ConfigView/>
                <PayoutTargetsView/>
                <MinersView/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import PayoutTargetsView from '#/Monitor/Component/PayoutTargetsView.vue';
import InfoView from '#/Monitor/Component/InfoView.vue';
import ConfigView from '#/Monitor/Component/ConfigView.vue';
import MinersView from '#/Monitor/Component/MinersView.vue';
import StorageMigration from '#/Monitor/Service/StorageMigration';
import { Route, Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { namespace } from 'vuex-class';
import { Inject } from '@100k/intiv/ObjectManager';

const ConfigStore = namespace('Monitor/Config');

@Route('/', 'monitor')
@Component({
    components: {
        InfoView,
        MinersView,
        PayoutTargetsView,
        ConfigView,
    }
})
export default class IndexPage
    extends BaseComponent
{

    @Inject()
    protected storageMigration : StorageMigration;

    public async mounted()
    {
        if (this.storageMigration.isOutdated) {
            await this.storageMigration.migrate();
        }
    }

}
</script>
