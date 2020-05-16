import * as _ from 'lodash';
import { IStorageSettings } from '../interfaces/storage-settings';
import { StorageBaseOperations } from './storage-base-operations';
import { StorageTypes } from '../enums/storage-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStorageNotifier } from '../interfaces/storage-typings';

const _window: Window = require('global/window');

export abstract class StorageBase<T> extends StorageBaseOperations<T> {
	private _settings: IStorageSettings;
	private _stateSubject = new BehaviorSubject(null);

	constructor(settings: IStorageSettings) {
		super();
		this._settings = settings;
		this._validateSettings(settings);
	}

	protected setSettings(settings: IStorageSettings): void {
		this._settings = settings;
		this._validateSettings(settings);
	}

	protected get(key: string, type?: StorageTypes): T {
		return this._getWithExpiry(key, type);
	}

	protected add(key: string, value: T, expiry?: number, type?: StorageTypes): void {
		if (expiry) {
			value = this._setWithExpiry(value, expiry);
		} else if (this._settings.setExpiryMilliseconds) {
			value = this._setWithExpiry(value, this._settings.setExpiryMilliseconds);
		}

		if (this._settings.notifiedOfStateChanges) {
			const state = {
				storage: type || this._settings.type,
				oldValue: this._deserializer(
					_window[type || this._settings.type].getItem(this._settings.keyPrefix + key)
				),
				newValue: value
			};
			this._setStorageState(state);
		}

		_window[type || this._settings.type].setItem(this._settings.keyPrefix + key, this._serializer(value));
	}

	protected remove(key: string, type?: StorageTypes): void {
		if (this._settings.notifiedOfStateChanges) {
			const state = {
				storage: type || this._settings.type,
				oldValue: this._deserializer(
					_window[type || this._settings.type].getItem(this._settings.keyPrefix + key)
				),
				newValue: null
			};
			this._setStorageState(state);
		}

		_window[type || this._settings.type].removeItem(this._settings.keyPrefix + key);
	}

	protected removeAll(keys: string[], type?: StorageTypes): void {
		_.forEach(keys, (key) => {
			this.remove(key, type);
		});
	}

	protected getStorage(type?: StorageTypes): Storage {
		return _window[type || this._settings.type];
	}

	protected clear(type?: StorageTypes): void {
		_window[type || this._settings.type].clear();
	}

	protected getNotifierObservable(): Observable<IStorageNotifier<T>> {
		return this._stateSubject.asObservable();
	}

	private _setStorageState(state: any): void {
		this._stateSubject.next({
			storage: state.storage,
			oldValue: state.oldValue,
			newValue: state.newValue
		} as IStorageNotifier<T>);
	}

	private _deserializer(json: any): T {
		return _.isString(json) ? JSON.parse(json) : json;
	}

	private _serializer(obj: T): any {
		if (_.isUndefined(obj)) return undefined;
		return JSON.stringify(obj);
	}

	private _setWithExpiry(value: T, expiry: number): any {
		const now = new Date();
		return {
			value,
			expiry: now.getTime() + expiry
		};
	}

	private _getWithExpiry(key: string, type?: StorageTypes): T {
		const item: any = this._deserializer(
			_window[type || this._settings.type].getItem(this._settings.keyPrefix + key)
		);
		if (!item) {
			return null;
		}
		if (!item.expiry) {
			return item;
		}

		const now = new Date();

		if (now.getTime() > item.expiry) {
			this.remove(key);
			return null;
		}

		return item.value;
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
