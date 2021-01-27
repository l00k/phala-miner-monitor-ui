import Engine from '@/core/Engine';
import { StoreManager } from '@/core/Store';
import { ObjectManager } from '@100k/intiv-js-tools/ObjectManager';
import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue';
import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import AbstractModel from './AbstractModel';


type Tables = {
    [modelName : string] : AbstractModel<any>[]
}

type Payload = {
    model : typeof AbstractModel,
    object? : AbstractModel<any>,
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

    public get findAll()
    {
        return (model : typeof AbstractModel) => {
            return this.tables[model.modelName] || [];
        }
    }

    public get findOne()
    {
        return (model : typeof AbstractModel, id : string) => {
            return this.tables[model.modelName]
                ? this.tables[model.modelName].find(object => object.id === id)
                : null;
        }
    }

    @Mutation
    public async persist({ model, object } : Payload)
    {
        if (!this.tables[model.modelName]) {
            this.tables[model.modelName] = [];
        }

        const table = this.tables[model.modelName];

        if (!object.id) {
            object.id = uuidv4();
        }

        const existing = table.find(_object => _object.id === object.id);
        if (existing) {
            Object.assign(existing, object);
        }
        else {
            table.push(object);
        }
    }

    @Mutation
    public async delete({ model, object } : Payload)
    {
        const table = this.tables[model.modelName];
        if (!table) {
            return;
        }

        const found = table.findIndex(_object => _object.id === object.id);
        if (found !== -1) {
            this.tables[model.modelName].splice(found, 1);
        }
    }

    @Mutation
    public async truncate({ model } : Payload)
    {
        this.tables[model.modelName] = [];
    }

}
