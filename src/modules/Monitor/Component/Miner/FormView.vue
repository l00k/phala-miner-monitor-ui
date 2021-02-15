<template>
    <b-modal
        :active.sync="isMinerFormModalVisible"
        :width="600"
    >
        <div class="miner-form">
            <be-block title="Miner form">
                <template>
                    <form @submit.prevent="submit">
                        <b-field label="Controller address" label-position="on-border">
                            <b-input v-model="miner.controllerAccount.address"></b-input>
                        </b-field>

                        <b-field label="Name" label-position="on-border">
                            <b-input v-model="miner.name"></b-input>
                        </b-field>

                        <div class="is-clearfix">
                            <b-button
                                type="is-primary"
                                class="is-pulled-right"
                                @click="submit"
                            >Save
                            </b-button>
                        </div>
                    </form>
                </template>
            </be-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Miner from '#/Monitor/Model/Miner';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager/index';
import { ToastProgrammatic as Toast } from 'buefy';
import { namespace } from 'vuex-class';


const MinerStore = namespace('Monitor/Miner');

@Component()
export default class FormView
    extends BaseComponent
{

    @Inject()
    protected monitorApi : MonitorApi;

    protected isMinerFormModalVisible : boolean = false;

    protected miner : Miner = new Miner();

    public show(miner : Miner)
    {
        this.miner = miner;

        this.isMinerFormModalVisible = true;
    }

    protected async submit()
    {
        const isNew = !this.miner['@id'];

        const result = await this.monitorApi.fetchNewMiner(this.miner);
        if (result) {
            Miner.persist(this.miner);

            Toast.open({
                message: isNew ? 'Created!' : 'Saved!',
                type: 'is-success',
                position: 'is-bottom-right',
            });

            this.$emit('miner:save', this.miner);
            this.$emit(isNew ? 'miner:created' : 'miner:updated', this.miner);
        }
        else {
            Toast.open({
                message: 'Nothing found',
                type: 'is-danger',
                position: 'is-bottom-right',
            });
        }

        this.isMinerFormModalVisible = false;
    }

}
</script>

<style scoped lang="scss">
.m-address-rename {
    font-size: 1rem;
    font-family: $family-monospace;
}
</style>
