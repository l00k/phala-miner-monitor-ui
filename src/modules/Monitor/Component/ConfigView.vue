<template>
    <div class="card mb-4 m-context__connection">
        <header class="card-header">
            <div class="card-header-title is-justify-content-space-between">
                <div class="app-name">Phala account monitor</div>
                <div class="build-info">{{ buildVersion }}</div>
            </div>
        </header>
        <div class="card-content">
            <div class="content has-text-right">

                <b-button
                    size="is-small"
                    type="is-warning"
                    @click="clearLocalStorage()"
                >Clear local storage
                </b-button>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Component } from 'vue-property-decorator';


declare const window;

@Component({
    components: {}
})
export default class ConfigView
    extends BaseComponent
{

    public get buildVersion() : string
    {
        return window.appData.buildVersion;
    }

    public async clearLocalStorage()
    {
        const confirm = await this.confirm({
            title: 'Clear local storage',
            message: 'All saved data on local device will be cleared. Are you sure you want to proceed?'
        });

        if (confirm) {
            window.localStorage.clear();
            window.location.reload();
        }
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
