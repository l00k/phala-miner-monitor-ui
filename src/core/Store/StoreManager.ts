import AbstractModel from '@/core/Store/AbstractModel';
import { Store } from 'vuex';
import { plainToClass } from 'class-transformer';
import { ConstructorType } from './def';


type Models = {
    [storeModelKey : string] : typeof AbstractModel
}

type ModelsMap = Map<typeof AbstractModel, string>;

export default class StoreManager
{

    protected static readonly STORAGE_KEY = 'appStorage';

    protected static models : Models = {};

    protected static modelsMap : ModelsMap = new Map();


    protected static serialize(state) : string
    {
        this._serializeTraverse(state);
        return JSON.stringify(state);
    }

    protected static _serializeTraverse(object : Object)
    {
        for (const property in object) {
            const value = object[property];
            if (value instanceof Object) {
                if (value instanceof AbstractModel) {
                    const Type = value.constructor.prototype;
                    const storeModelKey = this.modelsMap.get(Type);
                    if (storeModelKey) {
                        value['__storeModelKey'] = storeModelKey;
                    }
                }

                this._serializeTraverse(value);
            }
        }
    }

    protected static deserialize(json) : Object
    {
        const state = JSON.parse(json);
        this._deserializeTraverse(state);
        return state;
    }

    protected static _deserializeTraverse(object : Object)
    {
        for (const property in object) {
            const value = object[property];
            if (value instanceof Object) {
                const storeModelKey = value['__storeModelKey'];

                if (storeModelKey) {
                    delete value['__storeModelKey'];
                    const Model = this.models[storeModelKey];
                    object[property] = plainToClass(Model, value)
                }

                this._deserializeTraverse(object[property]);
            }
        }
    }

    public static getVuexPersister(store : Store<any>) : any
    {
        const storedStateRaw = window.localStorage.getItem(StoreManager.STORAGE_KEY);
        if (storedStateRaw !== null) {
            const storedState = StoreManager.deserialize(storedStateRaw);
            store.replaceState(storedState);
        }

        store.subscribe((mutation, state) => {
            window.localStorage.setItem(StoreManager.STORAGE_KEY, StoreManager.serialize(state));
        });
    }

    public static isModulePersisted(module : string) : boolean
    {
        const storedStateRaw = window.localStorage.getItem(this.STORAGE_KEY);
        if (storedStateRaw === null) {
            return false;
        }

        const storedState = JSON.parse(storedStateRaw);
        return !!storedState[module];
    }

    public static registerStoreModel(modelName : string, Model : typeof AbstractModel)
    {
        this.models[modelName] = Model;
        this.modelsMap.set(Model, modelName);
    }

}
