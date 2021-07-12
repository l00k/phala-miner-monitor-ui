<template>
    <b-field
        label="Phrase"
        label-position="on-border"
    >
        <b-input
            v-model.lazy="rawValue.like"
            placeholder="Type phrase to search.."
            @change.native="onRawValueChange"
        />
    </b-field>
</template>

<script lang="ts">
import UiFilterBase from '#/Core/Component/UI/FilterField/FilterBase.vue';
import { Component } from '@/core/Vue/Annotations';
import { Prop } from 'vue-property-decorator';


@Component()
export default class UiFilterText
    extends UiFilterBase
{

    public rawValue = {
        like: '',
    };

}
</script>
