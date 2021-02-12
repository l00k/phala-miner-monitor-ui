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


declare const window;

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

    @ConfigStore.State('storageBuildVersion')
    protected storageBuildVersion : string;

    public get buildVersion() : string
    {
        return window.appData.buildVersion;
    }

    public async created()
    {
        if (this.storageBuildVersion !== this.buildVersion) {
            const confirm = await this.confirm({
                title: 'Outdated',
                message: 'Your storage date is outdated. Monitor may not work properly. Do you want to clear this data?'
            });

            if (confirm) {
                window.localStorage.clear();
                this.$store.dispatch('Monitor/Config/setStorageBuildVersion', this.buildVersion);
                window.location.reload();
            }
        }
    }

}
</script>
