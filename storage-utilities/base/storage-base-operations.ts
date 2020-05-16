import { StorageTypes } from '../enums/storage-types';
import { Observable } from 'rxjs';
import { IStorageNotifier } from 'interfaces/storage-typings';

export abstract class StorageBaseOperations<T> {
	protected abstract add(key: string, item: T, expiry?: number, type?: StorageTypes): void;
	protected abstract get(key: string, type?: StorageTypes): T;
	protected abstract getStorage(type?: StorageTypes): Storage;
	protected abstract getNotifierObservable(): Observable<IStorageNotifier<T>>;
	protected abstract remove(key: string, type?: StorageTypes): void;
	protected abstract removeAll(keys: string[], type?: StorageTypes): void;
	protected abstract clear(type?: StorageTypes): void;
}
