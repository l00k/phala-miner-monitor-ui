<template>
    <b-button v-bind="$attrs"
              v-on="$listeners"
              :type="_type"
              :loading="loading"
    />
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';

import BaseComponent from '@/core/Vue/BaseComponent.vue';


@Component
export default class BeActionButton
    extends BaseComponent
{

    @Prop()
    public type : String;

    @Prop()
    public loading : Boolean;

    protected get _type()
    {
        if (this.loading) {
            return 'is-light';
        }

        return this.type;
    }

}
</script>

<style scoped lang="scss"></style>
