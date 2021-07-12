import { PropertySymbol } from './def';
import PropertyDescriptor from './PropertyDescriptor';


export default function Property(options : Partial<PropertyDescriptor> = {})
{
    return function(Target : Object, property : string) {
        if (!Target[PropertySymbol]) {
            Target[PropertySymbol] = {};
        }

        if (!options.type && !options.preserveRaw) {
            options.type = Reflect.getMetadata('design:type', Target, property);
        }

        Target[PropertySymbol][property] = new PropertyDescriptor(options);
    };
}
