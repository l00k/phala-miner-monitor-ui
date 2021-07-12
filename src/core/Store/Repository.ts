import App from '@/core/App';
import { AbstractModel } from '@/core/Domain/Model';
import { EventBus } from '@100k/intiv/EventBus/index';
import { ObjectManager } from '@100k/intiv/ObjectManager/index';
import { Store as VuexStore } from 'vuex';


export default class Repository<T extends AbstractModel<T>>
{

    protected eventBus : EventBus;

    protected store : VuexStore<any>;

    protected model : typeof AbstractModel;

    protected constructor(model : typeof AbstractModel)
    {
        this.eventBus = ObjectManager.getInstance(EventBus);
        this.store = ObjectManager.getInstance(App).getVuexStore();
        this.model = model;
    }

    public static get(model : typeof AbstractModel) : Repository<any>
    {
        return new Repository(model);
    }

    public findAll<T>() : T[]
    {
        return this.store.getters['Database/findAll'](this.model);
    }

    public findOne<T>(id : string) : T
    {
        return this.store.getters['Database/findAll'](this.model, id);
    }

    public persist<T>(object : T) : void
    {
        this.store.commit('Database/persist', { model: this.model, object });
        this.eventBus.emit('database:update', { model: this.model, object });
    }

    public delete<T>(object : T) : void
    {
        this.store.commit('Database/delete', { model: this.model, object });
        this.eventBus.emit('database:delete', { model: this.model, object });
    }

    public truncate() : void
    {
        this.store.commit('Database/truncate', { model: this.model });
        this.eventBus.emit('database:delete', { model: this.model });
    }

}
