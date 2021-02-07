import AbstractModel from '@/core/Store/AbstractModel';
import { Store } from 'vuex';
import { ConstructorType } from './def';


type Models = {
    [storeModelKey : string] : typeof AbstractModel
}

export default class StoreManager
{

    protected static readonly STORAGE_KEY = 'appStorage';

    protected static models : Models = {};


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
                    const Type = <any> value.constructor;
                    const modelName = Type.modelName;
                    if (modelName) {
                        value['__modelName'] = modelName;
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
                const modelName = value['__modelName'];
                if (modelName) {
                    delete value['__modelName'];
                    const Model = this.models[modelName];
                    object[property] = new Model();
                    object[property].setData(value);
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

    public static registerModel(modelName : string, Model : typeof AbstractModel)
    {
        this.models[modelName] = Model;
    }

}
