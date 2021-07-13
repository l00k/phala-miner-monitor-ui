import isEmpty from 'lodash/isEmpty';
import { Properties, PropertySymbol, MappingSymbol, ClassConstructor, GroupSymbol } from './def';
import Property from './Property';
import PropertyDescriptor from './PropertyDescriptor';


type RecursivePartial<T> = {
    [P in keyof T]? : T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
            ? RecursivePartial<T[P]>
            : T[P];
};

type SerializationOptions = {
    includeGroups? : string[],
    excludeGroups? : string[],
};

export default class AbstractModel<T>
{

    @Property()
    public '@uuid' : string;

    public constructor(data? : RecursivePartial<T>)
    {
    }

    public setData(data? : RecursivePartial<T>)
    {
        if (!data) {
            return;
        }

        const Target = Object.getPrototypeOf(this);

        const mapping = Target[MappingSymbol] || {};
        const properties : Properties = Target[PropertySymbol] || {};

        Object.entries(data)
            .forEach(([ fieldName, rawValue ]) => {
                const property = mapping[fieldName]
                    ? mapping[fieldName]
                    : fieldName;

                let propertyDsrp = properties[property];

                if (
                    typeof this[property] === 'undefined'
                    && !propertyDsrp
                ) {
                    return;
                }

                if (!propertyDsrp) {
                    propertyDsrp = new PropertyDescriptor({ preserveRaw: true });
                }

                // population blocked
                if (!propertyDsrp.populate) {
                    return;
                }

                if (rawValue === null) {
                    this[property] = null;
                }
                else if (propertyDsrp.preserveRaw) {
                    this[property] = rawValue;
                }
                else if (propertyDsrp.isPrimitive) {
                    if (propertyDsrp.type === Boolean) {
                        this[property] = !!rawValue;
                    }
                    else if (propertyDsrp.type === Number) {
                        this[property] = +rawValue;
                    }
                    else if (<any> propertyDsrp.type === BigInt) {
                        this[property] = BigInt(<any> rawValue);
                    }
                    else {
                        this[property] = rawValue;
                    }
                }
                else {
                    if (propertyDsrp.isArray) {
                        this[property] = [];

                        if (rawValue instanceof Array) {
                            rawValue.forEach(elm => {
                                let subElm = this._setDataSubObject(propertyDsrp.arrayOf, elm);
                                this[property].push(subElm);
                            });
                        }
                        else if (this[property] instanceof Object) {
                            Object.keys(rawValue).forEach(idx => {
                                let subElm = this._setDataSubObject(propertyDsrp.arrayOf, rawValue[idx]);
                                this[property].push(subElm);
                            });
                        }
                    }
                    else {
                        this[property] = this._setDataSubObject(propertyDsrp.type, rawValue);
                    }
                }
            });
    }

    protected _setDataSubObject(type : ClassConstructor, rawValue : Object)
    {
        if (type.prototype instanceof AbstractModel) {
            const object : AbstractModel<any> = <any> new type();
            object.setData(rawValue);
            return object;
        }
        else {
            return new type(rawValue);
        }
    }

    public serialize<S>(options : SerializationOptions) : S
    {
        const serialized : any = {};

        const Target = Object.getPrototypeOf(this);

        const serializationGroups = Target[GroupSymbol] || Object;
        const properties : Properties = Target[PropertySymbol] || {};

        for (const property of Object.getOwnPropertyNames(this)) {
            if (!this.hasOwnProperty(property)) {
                continue;
            }

            const propertySerializationGroups : string[] = serializationGroups[property];

            // inclusive conditions
            let include = true;

            if (!isEmpty(options.includeGroups)) {
                if (
                    !propertySerializationGroups
                    || !propertySerializationGroups.length
                    || !propertySerializationGroups.find(group => options.includeGroups.includes(group))
                ) {
                    include = false;
                }
            }

            // exclusion conditions
            if (
                include
                && !isEmpty(options.excludeGroups)
            ) {
                if (
                    propertySerializationGroups
                    && propertySerializationGroups.length
                    && propertySerializationGroups.find(group => options.excludeGroups.includes(group))
                ) {
                    include = false;
                }
            }

            if (!include) {
                continue;
            }

            let propertyDsrp = properties[property];
            if (!propertyDsrp) {
                propertyDsrp = new PropertyDescriptor({ preserveRaw: true });
            }

            // format value
            let value = null;

            if (this[property] === null) {
                value = null;
            }
            else if (propertyDsrp.preserveRaw) {
                value = this[property];
            }
            else if (propertyDsrp.isPrimitive) {
                if (propertyDsrp.type === Boolean) {
                    value = !!this[property];
                }
                else if (propertyDsrp.type === Number) {
                    value = +this[property];
                }
                else if (<any> propertyDsrp.type === BigInt) {
                    value = BigInt(this[property]);
                }
                else {
                    value = this[property];
                }
            }
            else {
                if (propertyDsrp.isArray) {
                    value = [];

                    if (this[property] instanceof Array) {
                        this[property].forEach(elm => {
                            value.push(elm.serialize(serializationGroups));
                        });
                    }
                    else if (this[property] instanceof Object) {
                        Object.keys(this[property]).forEach(idx => {
                            value.push(this[property][idx].serialize(serializationGroups));
                        });
                    }
                }
                else {
                    value = this[property].serialize(serializationGroups);
                }
            }

            serialized[property] = value;
        }

        return serialized;
    }

}
