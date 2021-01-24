import { RouteConfig } from 'vue-router';
import { ObjectManager } from '@100k/intiv-js-tools/ObjectManager';
import Engine from '@/core/Engine';


export default function Route(path : string, name : string, options : Partial<RouteConfig> = {})
{
    return (Target : any) => {
        const routeRecord : RouteConfig = {
            path,
            name,
            component: Target,
            ...options
        };

        ObjectManager.getInstance(Engine)
            .getVueRouter()
            .addRoutes([ routeRecord ]);
    };
}
