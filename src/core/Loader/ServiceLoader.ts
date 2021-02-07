import { ObjectManager, Singleton } from '@100k/intiv/ObjectManager';
import { isArrowFunction } from '@100k/intiv/Utility';


type Callback = (data : any, previousResult : any) => any;

type Listners = {
    [eventName : string] : Callback[]
};


@Singleton()
class ServiceLoader
{

    public async load()
    {
        const services = require('@/config/services').default;

        for (let [name, service] of Object.entries(services)) {
            if (isArrowFunction(service)) {
                service = await (<Function> service)();
            }

            ObjectManager.bindService(service, name);
        }
    }

}


export default ServiceLoader;
