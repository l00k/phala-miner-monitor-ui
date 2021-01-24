import { ConstructorType } from '../def';
import StoreManager from '../StoreManager';


export default function StoreModel(storeModelKey: string)
{
    return (Target : ConstructorType<any>) => {
        StoreManager.registerStoreModel(storeModelKey, Target);
    };
}
