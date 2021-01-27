import AbstractModel from '@/core/Store/AbstractModel';
import { ConstructorType } from '../def';
import StoreManager from '../StoreManager';


export default function Model(modelName: string)
{
    return (Target : typeof AbstractModel) => {
        Target.modelName = modelName;
        StoreManager.registerModel(modelName, Target);
    };
}
