import AbstractModel from '@/core/Domain/Model/AbstractModel';


export type StorageModelClass = {

    readonly STORAGE_MODEL : string;
    new : (...args : any[]) => AbstractModel<any>;

}

export type ConstructorType<T> = new (...args : any[]) => T;

export type DatabaseUpdateEvent = {
    model : typeof AbstractModel,
    object? : AbstractModel<any>,
}
