import PropertyDescriptor from './PropertyDescriptor';


export type ClassConstructor<T = {}> = new (...args : any[]) => T;

export const PropertySymbol = Symbol('Property');

export const GroupSymbol = Symbol('Group');

export const MappingSymbol = Symbol('Mapping');

export type Properties = {
    [property : string] : PropertyDescriptor
};

export type Mapping<T> = {
    [input : string] : keyof T
};
