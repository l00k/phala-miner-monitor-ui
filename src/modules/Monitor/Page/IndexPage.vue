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
import StorageMigration from '#/Monitor/Service/StorageMigration';
import { Route, Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { namespace } from 'vuex-class';
import { Inject } from '@100k/intiv/ObjectManager';

const ConfigStore = namespace('Monitor/Config');

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

    @Inject()
    protected storageMigration : StorageMigration;

    public async mounted()
    {
        if (this.storageMigration.isOutdated) {
            await this.storageMigration.migrate();

            this.$buefy.snackbar.open({
                message: 'Your local storage data was updated. App migrated it to latest version, but it may happen monitor will not work properly. In such case try to clear local storage (check config section)',
                type: 'is-warning',
                position: 'is-top',
                actionText: 'Hide',
                indefinite: true,
            });
        }
    }

}
</script>
