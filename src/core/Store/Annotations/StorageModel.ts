import { AbstractModel } from '@/core/Domain/Model';
import StoreManager from '../StoreManager';


export default function StorageModel(modelName : string) : ClassDecorator {
    return (Target : any) => {
        Target.STORAGE_MODEL = modelName;
        StoreManager.registerModel(modelName, Target);
    };
}
