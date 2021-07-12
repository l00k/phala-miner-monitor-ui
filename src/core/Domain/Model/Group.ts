import { GroupSymbol } from './def';
import PropertyDescriptor from './PropertyDescriptor';


export default function Group(groups : string[])
{
    return function(Target : Object, property : string) {
        if (!Target[GroupSymbol]) {
            Target[GroupSymbol] = {};
        }

        Target[GroupSymbol][property] = groups;
    };
}
