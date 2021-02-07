import App from '@/core/App';
import { Initializable } from '@100k/intiv/Initializable';
import { ObjectManager } from '@100k/intiv/ObjectManager';
import { Store as VuexStore } from 'vuex';
import Database from './Database';


export default class AbstractModel<T>
    extends Initializable<AbstractModel<T>>
{

    public static modelName : string;

    public id : string = null;


    public static getDatabase() : VuexStore<Database>
    {
        return ObjectManager.getInstance(App).getVuexStore();
    }

    public static findAll<T>() : T[]
    {
        return this.getDatabase().getters['Database/findAll'](this);
    }

    public static findOne<T>(id : string) : T
    {
        return this.getDatabase().getters['Database/findAll'](this, id);
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
