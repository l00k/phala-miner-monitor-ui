<template>
    <b-field
        label="Range"
        label-position="on-border"
    >
        <b-input
            v-model.lazy="rawValue.gte"
            placeholder="Min"
            @change.native="onRawValueChange"
        />
        <b-input
            v-model.lazy="rawValue.lte"
            placeholder="Max"
            @change.native="onRawValueChange"
        />
    </b-field>
</template>

<script lang="ts">
import UiFilterBase from '#/Core/Component/UI/FilterField/FilterBase.vue';
import { Component } from '@/core/Vue/Annotations';
import { Initialize, Initializable, Property } from '@100k/intiv/Initializable';
import numbro from 'numbro';
import { Prop, Watch } from 'vue-property-decorator';


@Component()
export default class UiFilterRange
    extends UiFilterBase
{

    public rawValue = {
        gte: '',
        lte: '',
    };

}
</script>
