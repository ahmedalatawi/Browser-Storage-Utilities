import * as _ from 'lodash';
import { IStorageSettings } from '../interfaces/storage-settings';
import { StorageTypes } from '../enums/storage-types';
import { StorageBaseOperations } from '../models/storage-base-operations';

const _window: Window = require('global/window');

export abstract class StorageBase<T> extends StorageBaseOperations<T> {
	private _storageType: StorageTypes;
	private _keyPrefix: string;

	constructor(settings: IStorageSettings) {
		super();
		this._keyPrefix = settings.keyPrefix || '';
		this._storageType = settings.type;

		this._validateSettings(settings);
	}

	protected setSettings(settings: IStorageSettings): void {
		this._keyPrefix = settings.keyPrefix || '';
		this._storageType = settings.type;

		this._validateSettings(settings);
	}

	protected get(key: string): T {
		return this._deserializer(_window[this._storageType].getItem(this._keyPrefix + key));
	}

	protected add(key: string, value: T): void {
		return _window[this._storageType].setItem(this._keyPrefix + key, this._serializer(value));
	}

	protected remove(key: string): void {
		return _window[this._storageType].removeItem(this._keyPrefix + key);
	}

	protected clear(): void {
		_window[this._storageType].clear();
	}

	private _deserializer(json: any): T {
		return _.isString(json) ? JSON.parse(json) : json;
	}

	private _serializer(obj: T): any {
		if (_.isUndefined(obj)) return undefined;
		return JSON.stringify(obj);
	}

	private _validateSettings(settings: IStorageSettings): void {
		if (_.get(process, 'env.NODE_ENV') !== 'test') {
			if (_.isNil(_window)) {
				throw new Error('The global window object is undefined!');
			}
			if (_.isNil(_window[settings.type])) {
				throw new Error(`The storage type ${settings.type} is not supported by the browser!`);
			}
		}
	}
}
