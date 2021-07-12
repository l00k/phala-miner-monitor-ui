<template>
    <b-table-column
        v-bind="$attrs"
        v-on="$listeners"
        :searchable="searchable"
        :numeric="numeric"
    >
        <slot v-for="(_, name) in $slots" :slot="name" :name="name"/>

        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
            <slot v-bind="slotData" :name="name"/>
        </template>

        <template
            slot="searchable"
            slot-scope="slotData"
        >
            <slot
                v-if="searchable"
                name="searchable"
                v-bind="slotData"
            >
                <!-- Range filters -->
                <div
                    v-if="finalFilterType == FilterType.Range"
                    class="is-flex is-justify-content-center"
                    :style="domStyle"
                >
                    <ui-filter-range
                        :filter.sync="filter"
                        :config="filterConfig"
                        :numeric="numeric"
                    />
                </div>

                <!-- Text filters -->
                <div
                    v-else-if="finalFilterType == FilterType.Text"
                >
                    <ui-filter-text
                        :filter.sync="filter"
                        :config="filterConfig"
                        :numeric="numeric"
                    />
                </div>

                <!-- Options filters -->
                <div
                    v-else-if="finalFilterType == FilterType.Select"
                >
                    <ui-filter-select
                        :filter.sync="filter"
                        :config="filterConfig"
                        :numeric="numeric"
                    />
                </div>
            </slot>
        </template>

        <template slot="default" slot-scope="slotData">
            <slot name="default"></slot>
        </template>
    </b-table-column>
</template>

<script lang="ts">
import { FilterType } from '#/Core/Domain/Model/Filter';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Prop, Watch } from 'vue-property-decorator';


@Component()
export default class UiTableColumn
    extends BaseComponent
{

    public FilterType = FilterType;

    public _isTable : boolean = true;

    @Prop({ default: false })
    public numeric : boolean;

    @Prop({ default: true })
    public searchable : boolean;

    @Prop()
    public filter : any;

    @Prop()
    public filterConfig : any;

    @Prop()
    public filterType : FilterType;

    @Prop()
    public domStyle : any;

    public finalFilterType : FilterType;

    public get visibleData()
    {
        return (<any> this.$parent).visibleData;
    }

    public get newColumns()
    {
        return (<any> this.$parent).newColumns;
    }

    public mounted()
    {
        this.init();
    }

    @Watch('filterType')
    protected init()
    {
        // set final filter type
        if (this.filterType) {
            this.finalFilterType = this.filterType;
        }
        else {
            if (!this.searchable) {
                this.finalFilterType = FilterType.None;
            }
            else if (this.numeric) {
                this.finalFilterType = FilterType.Range;
            }
            else {
                this.finalFilterType = FilterType.Text;
            }
        }
    }

}
</script>
