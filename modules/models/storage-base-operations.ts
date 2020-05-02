export abstract class StorageBaseOperations<T> {
	protected abstract add(key: string, item: T): void;
	protected abstract get(key: string): T;
	protected abstract remove(key: string): void;
	protected abstract clear(): void;
}
