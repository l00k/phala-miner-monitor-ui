import { ClassConstructor } from './def';


type ObjectType = Object & Function;

export default class PropertyDescriptor
{

    public populate : boolean = true;

    public type : ClassConstructor;

    public arrayOf : ClassConstructor;

    public preserveRaw : boolean = false;

    public constructor(options : Partial<PropertyDescriptor> = {})
    {
        this.type = options.type ? options.type : this.type;
        this.arrayOf = options.arrayOf ? options.arrayOf : this.arrayOf;
    }

    public get isPrimitive() : boolean
    {
        return [Boolean, null, undefined, Number, BigInt, String, Symbol].indexOf(<any> this.type) !== -1;
    }

    public get isArray() : boolean
    {
        return this.arrayOf !== undefined;
    }

    public get isDate() : boolean
    {
        return this.type === Date;
    }

}
