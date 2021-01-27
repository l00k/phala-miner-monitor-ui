<template>
    <div class="card mb-4 m-context__connection">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <span>Config</span>
            </div>
        </header>
        <div class="card-content">
            <div class="content">


            </div>
        </div>
        <div class="card-footer">
            <div class="app-name">Phala account monitor</div>
            <div class="build-info">{{ buildInfo }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import BaseComponent from '@/core/Vue/BaseComponent.vue';

declare const window;

@Component({
    components: {
    }
})
export default class ConfigView
    extends BaseComponent
{

    public get buildInfo(): string
    {
        return window.appData.buildInfo;
    }

}
</script>

<style scoped lang="scss">
.card-footer {
    justify-content: space-between;
}

.app-name {
    padding: 10px 15px;
    font-size: 0.8rem;
}

.build-info {
    padding: 10px 15px;
    font-size: 0.7rem;
}
</style>
