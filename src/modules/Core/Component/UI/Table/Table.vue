<template>
    <div class="ui-table">

        <div class="columns is-justify-content-space-between">
            <div class="column">
                <b-field
                    label="Items per page"
                    label-position="on-border"
                >
                    <b-select v-model="pagination.itemsPerPage">
                        <option
                            v-for="option in pagination.itemsPerPageOptions"
                            :key="option"
                            :value="option"
                        >{{ option }}
                        </option>
                    </b-select>
                </b-field>
            </div>
            <div class="column">
                <b-pagination
                    :per-page="pagination.itemsPerPage"
                    :total="pagination.total"
                    :current.sync="pagination.page"
                    order="is-right"
                    class="is-flex-grow-0"
                />
            </div>
        </div>

        <b-table
            ref="table"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <slot v-for="(_, name) in $slots" :slot="name" :name="name"/>

            <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
                <slot v-bind="slotData" :name="name"/>
            </template>

            <template slot="default" slot-scope="slotData">
                <slot v-bind="slotData" name="default"/>

                <ui-table-column
                    v-if="showActions"
                    label="Actions"
                    :searchable="true"
                    :filter-type="FilterType.None"
                    :style="{ width: '50px' }"
                >
                    <template #searchable>
                        <div class="b-table__cell--actions">
                            <b-button
                                size="is-small"
                                type="is-warning is-light"
                                @click="clearFilters()"
                            >Clear
                            </b-button>
                        </div>
                    </template>
                    <template>
                        ...
                    </template>
                </ui-table-column>
            </template>

            <template slot="empty">
                <slot name="empty">
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
                </slot>
            </template>
        </b-table>

        <div class="columns is-justify-content-space-between mt-4">
            <div class="column">
                <b-field
                    label="Items per page"
                    label-position="on-border"
                >
                    <b-select v-model="pagination.itemsPerPage">
                        <option
                            v-for="option in pagination.itemsPerPageOptions"
                            :key="option"
                            :value="option"
                        >{{ option }}
                        </option>
                    </b-select>
                </b-field>
            </div>
            <div class="column">
                <b-pagination
                    :per-page="pagination.itemsPerPage"
                    :total="pagination.total"
                    :current.sync="pagination.page"
                    order="is-right"
                    class="is-flex-grow-0"
                />
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import UiFilterBase from '#/Core/Component/UI/FilterField/FilterBase.vue';
import { FilterType } from '#/Core/Domain/Model/Filter';
import { Pagination } from '@/core/GraphQL/Struct';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Prop, Ref } from 'vue-property-decorator';
import Vue from 'vue';


@Component()
export default class UiTable
    extends BaseComponent
{

    protected FilterType = FilterType;

    @Ref('table')
    protected $table : Vue;

    @Prop({ default: true })
    public showActions : boolean;

    @Prop({
        default: () => new Pagination()
    })
    public pagination : Pagination;


    public clearFilters()
    {
        // todo ld 2021-04-26 05:06:20 - to check after build
        this.$table.$children
            .filter(($child : Vue) => $child.$options.name === 'BSlotComponent')
            .map(($child : Vue) => $child.$children[0])
            .forEach(($child : any) => {
                if (typeof $child.clear != 'undefined') {
                    $child.clear();
                }
            });
    }

}
</script>
