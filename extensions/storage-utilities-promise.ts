import { StorageUtilities } from "../storage-utilities";

export class StorageUtilitiesPromise<T> extends StorageUtilities<T> {
    // protected getPromise(key: string): Promise<T> {
    //     return Promise.resolve(super.get(key));
    // }
}