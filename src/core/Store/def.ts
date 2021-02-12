import AbstractModel from '@/core/Store/AbstractModel';


export type ConstructorType<T> = new (...args : any[]) => T;

export type DatabaseUpdateEvent = {
    model : typeof AbstractModel,
    object? : AbstractModel<any>,
}
