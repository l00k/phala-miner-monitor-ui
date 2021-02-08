<template>
    <div class="card mb-4 m-context__connection">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <div class="app-name">Phala account monitor</div>
                <div class="build-info">{{ buildInfo }}</div>
            </div>
        </header>
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
}

.build-info {
    font-size: 0.7rem;
}
</style>
