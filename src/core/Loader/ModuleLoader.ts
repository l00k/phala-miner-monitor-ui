import { InitiationException } from '@100k/intiv/Exception';


type Callback = (data : any, previousResult : any) => any;

type Listners = {
    [eventName : string] : Callback[]
};


export default class ModuleLoader
{

    public async _loadModules(types : string[], require)
    {
        const modules = [];

        for (const path of require.keys()) {
            const pathParts = path.replace(/^[./]+/g, '').split('/');
            const moduleName = pathParts.shift();
            const objectName = pathParts.join('/');

            if (!path) {
                continue;
            }

            let includable = false;
            for (let type of types) {
                if (objectName.indexOf(type) === 0) {
                    includable = true;
                    break;
                }
            }

            if (includable) {
                const module = require(path);
                modules.push(module);
            }
        }

        return modules;
    }

    public async load(types : string[])
    {
        return this._loadModules(
            types,
            require.context('@/modules', true, /\.(ts|vue)/)
        );
    }

}
