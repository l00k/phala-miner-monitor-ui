<template>
    <b-collapse class="card"
                animation="slide"
                :open="open"
                :aria-id="componentId"
    >
        <div slot="trigger"
             slot-scope="props"
             class="card-header"
             :aria-controls="componentId"
        >
            <div class="card-header-title" @click.stop>
                <slot name="header">{{ title }}</slot>
            </div>
            <a
                v-if="toggable"
                class="card-header-icon"
            >
                <b-icon pack="fas" :icon="props.open ? 'caret-down' : 'caret-up'"/>
            </a>
        </div>

        <div class="card-content">
            <slot></slot>
        </div>
    </b-collapse>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';

import BaseComponent from '@/core/Vue/BaseComponent.vue';


@Component
export default class BeCard
    extends BaseComponent
{

    @Prop()
    public title : String;

    @Prop({ default: true })
    public open : Boolean;

    @Prop({ default: false })
    public toggable : Boolean;

}
</script>

<style scoped lang="scss">
.card {
    overflow: visible;
}
</style>
