import { Singleton } from '@100k/intiv/ObjectManager';
import { InitiationException } from '@100k/intiv/Exception';


type Callback = (data : any, previousResult : any) => any;

type Listners = {
    [eventName : string] : Callback[]
};


@Singleton()
class ModuleLoader
{

    public async _loadModules(types : string[], require)
    {
        for (const path of require.keys()) {
            const pathParts = path.replace(/^[./]+/g, '').split('/');
            const moduleName = pathParts.shift();
            const objectType = pathParts.shift();
            const objectName = pathParts.join('/');

            if (!path) {
                continue;
            }

            const includable = types.indexOf(objectType) !== -1;
            if (includable) {
                require(path);
            }
        }
    }

    public async load(types : string[])
    {
        this._loadModules(
            types,
            require.context('@/modules', true, /\.(ts|vue)/)
        );
    }

}


export default ModuleLoader;
