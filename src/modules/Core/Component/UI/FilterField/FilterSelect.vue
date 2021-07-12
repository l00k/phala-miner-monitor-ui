<template>
    <b-taginput
        ref="optionsFilterInput"
        v-bind="$attrs"
        v-on="$listeners"
        v-model="selectedOptions"
        :data="visibleOptions"
        field="label"
        :autocomplete="true"
        :open-on-focus="true"
        :append-to-body="true"
        placeholder="Type to see suggestions..."
        class="m-filter-select"
        @typing="filterVisibleOptions"
        @input="onSelect"
    >
        <template #selected="props">
            <b-tag
                v-for="(option, index) in props.tags"
                :key="index"
                :style="option.style"
                :closable="true"
                class="m-tag"
                :class="{
                    'tag--incl': option.mode == SelectOptionMode.Inclusive,
                    'tag--excl': option.mode == SelectOptionMode.Exclusive,
                }"
                @close="onUnselect(option)"
            >
                {{ option.label }}
            </b-tag>
        </template>
        <template #empty>
            <div class="content has-text-grey has-text-centered">
                <p>
                    <b-icon
                        pack="fas"
                        icon="heart-broken"
                        size="is-small"
                        class="is-vcentered"
                    />
                    Nothing here.
                </p>
            </div>
        </template>
    </b-taginput>
</template>

<script lang="ts">
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Initialize, Initializable, Property } from '@100k/intiv/Initializable';
import Color from 'color';
import cloneDeep from 'lodash/cloneDeep';
import objectGet from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Prop, Watch } from 'vue-property-decorator';


export enum SelectOptionMode
{
    Inclusive = 'inclusive',
    Exclusive = 'exclusive',
}

export type SelectOption = {
    id? : number,
    label? : string,
    mode? : SelectOptionMode,
    type? : string,
    style? : any,
};

@Initialize()
export class FilterSelectConfig
    extends Initializable<FilterSelectConfig>
{

    @Property()
    public options : SelectOption[] = [];

}

@Component()
export default class UiFilterSelect
    extends BaseComponent
{

    public SelectOptionMode = SelectOptionMode;

    @Prop({ default: () => new FilterSelectConfig() })
    public config : Partial<FilterSelectConfig>;

    @Prop()
    public filter : any;

    public options : SelectOption[] = [];

    public visibleOptions : SelectOption[] = [];

    public selectedOptions : SelectOption[] = [];

    public mounted()
    {
        this.onFilterChange();

        // prepare options
        this.options = [];
        this.config.options.forEach(iOption => {
            if (!iOption.style) {
                iOption.style = {};
            }

            // include option
            const inclOption : any = cloneDeep(iOption);
            inclOption.label = 'Incl: ' + inclOption.label;
            inclOption.mode = SelectOptionMode.Inclusive;
            this.options.push(inclOption);

            // exclude option
            const exclOption : any = cloneDeep(iOption);
            exclOption.label = 'Excl: ' + exclOption.label;
            exclOption.mode = SelectOptionMode.Exclusive;
            this.options.push(exclOption);
        });

        this.visibleOptions = this.options;
    }

    public clear()
    {
        Object.keys(this.filter)
            .forEach(key => {
                this.$delete(this.filter, key);
            });
    }

    @Watch('filter', { deep: true })
    public onFilterChange()
    {
        this.selectedOptions = [];

        if (!this.filter) {
            return;
        }

        if (!isEmpty(this.filter.in)) {
            const filtered = this.options
                .filter(option => option.mode === SelectOptionMode.Inclusive)
                .filter(option => this.filter.in.includes(option.id));
            this.selectedOptions.push(...filtered);
        }
        if (!isEmpty(this.filter.nin)) {
            const filtered = this.options
                .filter(option => option.mode === SelectOptionMode.Exclusive)
                .filter(option => this.filter.nin.includes(option.id));
            this.selectedOptions.push(...filtered);
        }
    }

    public onSelect()
    {
        const inclusive = this.selectedOptions
            .filter(option => option.mode === SelectOptionMode.Inclusive)
            .map(option => option.id);
        this.$set(this.filter, 'in', inclusive);

        const exclusive = this.selectedOptions
            .filter(option => option.mode === SelectOptionMode.Exclusive)
            .map(option => option.id);
        this.$set(this.filter, 'nin', exclusive);
    }

    public onUnselect(option : SelectOption)
    {
        const index = this.selectedOptions.findIndex(_option => _option === option);
        if (index !== -1) {
            this.selectedOptions.splice(index, 1);
        }

        this.onSelect();
    }

    public filterVisibleOptions(text : string)
    {
        this.visibleOptions = this.options
            .filter(option => option.label.toLowerCase().includes(text.toLowerCase()));
    }

}
</script>

<style lang="scss">
.m-filter-select {
    font-weight: normal;


    .tag {
        color: #fff;
        background: #aaa;
        border-color: rgba(0,0,0, 0.5);

        &--excl {
            border-color: rgba(200,0,0, 0.8);
        }
    }
}
</style>
