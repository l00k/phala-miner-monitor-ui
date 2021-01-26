import Engine from '@/core/Engine';
import { InitObject } from '@100k/intiv-js-tools/InitializerList';
import { ObjectManager } from '@100k/intiv-js-tools/ObjectManager';
import { Store as VuexStore } from 'vuex';
import Database from './Database';


export default class AbstractModel
    extends InitObject<AbstractModel>
{

    public static modelName : string;

    public id : string = null;

    public static getDatabase() : VuexStore<Database>
    {
        return ObjectManager.getInstance(Engine).getVuexStore();
    }

    public static findAll<T>() : Promise<T[]>
    {
        return this.getDatabase()
            .dispatch('Database/findAll', { model: this });
    }

    public static findOne<T>(id : string) : Promise<T>
    {
        return this.getDatabase()
            .dispatch('Database/findOne', { model: this, id });
    }

    public static persist<T>(object : T) : void
    {
        return this.getDatabase()
            .commit('Database/persist', { model: this, object });
    }

    public static delete<T>(object : T) : void
    {
        return this.getDatabase()
            .commit('Database/delete', { model: this, object });
    }

    public static truncate() : void
    {
        return this.getDatabase()
            .commit('Database/truncate', { model: this });
    }

}
