<template>
    <b-modal
        :active.sync="isModalVisible"
        :width="600"
    >
        <div class="miner-form">
            <ui-block title="Miner form">
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
                                native-type="submit"
                                type="is-primary"
                                class="is-pulled-right"
                            >Save
                            </b-button>
                        </div>
                    </form>
                </template>
            </ui-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Miner from '#/Monitor/Domain/Model/Miner';
import MinerService from '#/Monitor/Domain/Service/MinerService';
import Repository from '@/core/Store/Repository';
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
    protected minerService : MinerService;

    protected isModalVisible : boolean = false;

    protected miner : Miner = new Miner();

    public show(miner : Miner)
    {
        this.miner = miner;
        this.isModalVisible = true;
    }

    protected async submit()
    {
        const isNew = !this.miner['@uuid'];

        const result = await this.minerService.fetchNew(this.miner);
        if (result) {
            const minerRepository = Repository.get(Miner);
            minerRepository.persist(this.miner);

            Toast.open({
                message: isNew ? 'Created!' : 'Saved!',
                type: 'is-success',
                position: 'is-bottom-right',
            });

            this.$emit('miner:save', this.miner);
            this.$emit(isNew ? 'miner:created' : 'miner:updated', this.miner);

            this.isModalVisible = false;
        }
        else {
            Toast.open({
                message: 'Nothing found',
                type: 'is-danger',
                position: 'is-bottom-right',
            });
        }
    }

}
</script>
