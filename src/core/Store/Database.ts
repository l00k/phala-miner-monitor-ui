import Engine from '@/core/Engine';
import { StoreManager } from '@/core/Store';
import { ObjectManager } from '@100k/intiv-js-tools/ObjectManager';
import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue';
import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import AbstractModel from './AbstractModel';


type Table = {
    [id : string] : AbstractModel
}
type Tables = {
    [modelName : string] : Table
}

type Payload = {
    model : typeof AbstractModel,
    object? : AbstractModel,
    id? : string,
}

@Module({
    dynamic: true,
    store: ObjectManager.getInstance(Engine).getVuexStore(),
    preserveState: StoreManager.isModulePersisted('Database'),
    namespaced: true,
    name: 'Database',
})
export default class Database
    extends VuexModule<Database>
{

    public tables : Tables = {};

    @Mutation
    public async persist({ model, object } : Payload)
    {
        if (!this.tables[model.modelName]) {
            this.tables[model.modelName] = {};
        }

        const table = this.tables[model.modelName];

        if (!object.id) {
            object.id = uuidv4();
        }

        const existing = table[object.id];
        if (existing) {
            Object.assign(existing, object);
        }
        else {
            table[object.id] = object;
        }
    }

    @Mutation
    public async delete({ model, object } : Payload)
    {
        const table = this.tables[model.modelName];
        if (!table) {
            return;
        }

        if (table[object.id]) {
            Vue.delete(table, object.id);
        }
    }

    @Mutation
    public async truncate({ model } : Payload)
    {
        this.tables[model.modelName] = {};
    }

    @Action
    public findAll({ model } : Payload) : AbstractModel[]
    {
        const table = this.context.state.tables[model.modelName];
        return table
            ? Object.values(table)
            : [];
    }

    @Action
    public findOne({ model, id } : Payload) : AbstractModel | null
    {
        const table = this.context.state.tables[model.modelName];
        return table
            ? table[id]
            : null;
    }

}
