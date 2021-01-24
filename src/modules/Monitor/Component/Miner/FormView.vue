<template>
    <div class="miner-form">
        <be-block title="Miner form">
            <template>
                <form @submit.prevent="submit">

                    <div class="columns justify-spece-between">
                        <div class="column is-6">
                            <b-field label="Name" label-position="on-border">
                                <b-input v-model="miner.name"></b-input>
                            </b-field>
                        </div>
                        <div class="column is-6">
                            <b-field label="Node IP address" label-position="on-border">
                                <b-input v-model="miner.nodeIp"></b-input>
                            </b-field>
                        </div>
                    </div>

                    <b-field label="Stash address" label-position="on-border">
                        <b-input v-model="miner.accountStash.address"></b-input>
                    </b-field>

                    <b-field label="Controller address" label-position="on-border">
                        <b-input v-model="miner.accountController.address"></b-input>
                    </b-field>

                    <div class="is-clearfix">
                        <b-button
                            type="is-primary"
                            class="is-pulled-right"
                            @click="submit"
                        >Save</b-button>
                    </div>
                </form>

            </template>
        </be-block>
    </div>
</template>

<script lang="ts">
import { Component } from '@/core/Vue/Annotations';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import BaseComponent from '@/core/Vue/BaseComponent.vue';

import Miner from '#/Monitor/Model/Miner';


const MinerStore = namespace('Monitor/Miner');

@Component()
export default class HoldersView
    extends BaseComponent
{

    protected miner : Miner = new Miner();

    public setMiner(miner : Miner)
    {
        this.miner = miner;
    }

    protected submit()
    {
        this.$store.commit('Monitor/Miner/submitMiner', this.miner);
        this.$emit('submit', this.miner);
    }

}
</script>

<style scoped lang="scss">
.m-address-rename {
    font-size: 1rem;
    font-family: $family-monospace;
}
</style>
