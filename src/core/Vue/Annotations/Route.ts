import { RouteConfig } from 'vue-router';
import { ObjectManager } from '@100k/intiv/ObjectManager';
import App from '@/core/App';


export default function Route(path : string, name : string, options : Partial<RouteConfig> = {})
{
    return (Target : any) => {
        const routeRecord : RouteConfig = {
            path,
            name,
            component: Target,
            ...options
        };

        ObjectManager.getInstance(App)
            .getVueRouter()
            .addRoute(routeRecord);
    };
}
