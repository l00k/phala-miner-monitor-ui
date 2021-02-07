import { ObjectManager } from '@100k/intiv/ObjectManager/index';
import { componentFactory } from 'vue-class-component/lib/component';


interface ConstructorType extends Function
{
    new(...args : any[]) : any;

    [name : string] : any
}


function Component(config : any = {})
{
    return (Target : any) => {
        if (!config.mixins) {
            config.mixins = [];
        }

        // add dependency load
        config.mixins.push({
            created()
            {
                ObjectManager.loadDependencies(this, Target.prototype);
            }
        });

        return <any> componentFactory(Target, config);
    };
}

export default Component;
