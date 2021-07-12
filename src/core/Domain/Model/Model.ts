import { Mapping, MappingSymbol } from './def';


export type ClassConstructor<T = {}> = new (...args : any[]) => T;

export default function Model<T>(mapping? : Mapping<T>) {
    return function(Target : ClassConstructor) {
        Target.prototype[MappingSymbol] = mapping;

        const code = `(function ${ Target.name }(...args) { const object = new Target(...args); if (args[0] instanceof Object) { object.setData(args[0]); } return object; })`;
        const Extended = eval(code);
        Extended.prototype = Target.prototype;
        Object.assign(Extended, Target);

        return Extended;
    };
}
