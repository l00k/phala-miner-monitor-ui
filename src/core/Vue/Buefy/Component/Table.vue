<template>
    <b-table v-bind="$attrs"
             v-on="$listeners"
             :data="data ? data : []"
             :loading="loading"
             :striped="striped"
             :paginated="_paginated"
             :per-page="perPage"
    >
        <template v-slot:default="data">
            <slot v-bind="data"></slot>
        </template>

        <template slot="empty">
            <slot name="empty">
                <div class="content has-text-grey has-text-centered">
                    <p>
                        <b-icon pack="fas" icon="heart-broken" size="is-small"/>
                        Nothing here.
                    </p>
                </div>
            </slot>
        </template>

        <template v-slot:detail="data">
            <slot name="detail" v-bind="data"></slot>
        </template>
    </b-table>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';

import BaseComponent from '@/core/Vue/BaseComponent.vue';


@Component
export default class BeTable
    extends BaseComponent
{

    @Prop()
    public data : Object[];

    @Prop()
    public loading : Boolean;

    @Prop()
    public striped : Boolean;

    @Prop({ default: undefined })
    public paginated : Boolean;

    @Prop({ default: 25 })
    public perPage : Number;

    protected get _paginated()
    {
        if (typeof this.paginated == 'undefined') {
            return this.data.length > this.perPage;
        }

        return this.paginated;
    }

}
</script>

<style scoped lang="scss"></style>
