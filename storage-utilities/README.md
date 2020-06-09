[![Build Status](https://travis-ci.org/AhmedAlatawi/Browser-Storage-Utilities.svg?branch=master)](https://travis-ci.org/AhmedAlatawi/Browser-Storage-Utilities)
[![Coverage Status](https://coveralls.io/repos/github/AhmedAlatawi/Browser-Storage-Utilities/badge.svg?branch=master)](https://coveralls.io/github/AhmedAlatawi/Browser-Storage-Utilities?branch=master)
[![npm version](https://badge.fury.io/js/browser-storage-utilities.svg)](https://badge.fury.io/js/browser-storage-utilities)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/AhmedAlatawi/Browser-Storage-Utilities/issues)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/ahmedalatawi?locale.x=en_US)

### [Live example in Angular](https://stackblitz.com/edit/angular-storage-utilities-example) :movie_camera:

## Browser Storage Utilities :hammer_and_pick:

:fire: StorageUtilities is a front-end library that provides handy methods to facilitate CRUD operations to data stored in the browser. It also allows global/class level settings to easily, and consistently, manage the state of the stored data. 

StorageUtilities provides optional expiry/TTL (Time To Live) functionality to allow temporary data storage. It also allows subscribers to be notified of any state changes to stored data.

The internal implementation relys on the web storage objects `localStorage` and `sessionStorage`, as well as the methods they provide `setItem/getItem/removeItem/clear`

### :pencil2: Key Goals
* Simplify CRUD operations to stored data in `localStorage` & `sessionStorage`
* Allow global/class level settings for consistency 
* Support expiry/TTL (Time To Live) feature
* Provide state change notifications to subscribers
* Can be easily used in any front-end JavaScript codebase application

### :arrow_down: Installation 
```sh
npm install browser-storage-utilities --save
```
### Usage :bulb:
### TypeScript
```typescript
import { StorageUtilities } from 'browser-storage-utilities';

export class UserStorageService extends StorageUtilities < User > {
    ...

    constructor() {
        super({ /* global settings (optional) */ });
    }

}
```
### The settings interface :checkered_flag:
```typescript
export interface IStorageSettings {
    keyPrefix ? : string; // prefixes all items' keys prior to being stored, e.g. 'user-'
    type ? : StorageTypes; // localStorage (default) / sessionStorage
    setExpiryMilliseconds ? : number; // time to live (TTL), e.g. 5000ms
    setReturnType ? : StorageReturnTypes; // the item(s) to be returned as a Promise or Observable
    notifiedOfStateChanges ? : boolean; // for subscriber(s) to be notified of any storage state changes
}
```
**Note: :bulb:** Some of these settings **(type, setExpiryMilliseconds, and setReturnType)** can be applied per method as well, which always take precedence over global settings:
 ```typescript
 // set globally
...
constructor() {
    super({ keyPrefix: 'user-', setExpiryMilliseconds: 5000, notifiedOfStateChanges: true, setReturnType: StorageReturnTypes.Promise, type: StorageTypes.SESSION });
...

// set per method
this.userStorageService.addUser('123', user, 5000, StorageTypes.SESSION);

// return item
const storedUser = this.userStorageService.getUser('123', StorageTypes.SESSION);
console.log('storedUser: ', storedUser); // user data

// return item as a Promise
const storedUserPromise = this.userStorageService.getUser('123', StorageTypes.SESSION, StorageReturnTypes.Promise);

storedUserPromise.then(user => {
   console.log('user: ', user); // user data
})
```

### Default settings :pushpin:
```typescript
export const defaultSettings: IStorageSettings = {
    keyPrefix: '',
    type: StorageTypes.LOCAL // set to localStorage by default
};
```
### Example :rocket:
```typescript
import { StorageUtilities, StorageTypes } from 'browser-storage-utilities';

export class UserStorageService extends StorageUtilities < User > {

    constructor() {
        super({ keyPrefix: 'user-', notifiedOfStateChanges: true, type: StorageTypes.SESSION });
    }

    addUser(id: string, user: User, expiry ? : number, storageType ? : StorageTypes): void {
        this.addItem(id, user, expiry, storageType);
    }

    getUser(id: string, storageType ? : StorageTypes): User {
        return this.getItem(id, storageType);
    }

    updateUserProperty(id: string, propName: string, newValue: any, storageType ? : StorageTypes): User {
        return this.updateItemProperty(id, propName, newValue, storageType);
    }

    removeUserProperty(id: string, propName: string, storageType ? : StorageTypes): User {
        return this.updateItemProperty(id, propName, newValue, storageType);
    }

    removeUser(id: string, storageType ? : StorageTypes): void {
        this.removeItem(id, storageType);
    }

    removeUsers(ids: string[], storageType ? : StorageTypes): void {
        this.removeItems(ids, storageType);
    }

}
```

### Subscribe to storage state changes :dart:
```typescript
import { IStorageNotifier } from 'browser-storage-utilities';

...

this.userStorageService.storageStateChanged.subscribe((userData: IStorageNotifier <User> ) => {
    if (userData) {
        console.log('storage: ', userData.storage); // localStorage or sessionStorage
        console.log('oldValue: ', userData.oldValue); // previous data
        console.log('newValue: ', userData.newValue); // current data
    }
});
```
### Store data with a 5 second expiry (TTL) :hourglass_flowing_sand:
```typescript
...

this.userStorageService.addUser('123', user, 5000);
/* 
localStorage: {
  expiry: 1590853867699,
  value: {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    ...
  }
}
*/

// if expiry time has elapsed, item is removed from storage, and null will be returned.
const storedUser = this.userStorageService.getUser('123');

console.log('storedUser: ', storedUser); // null
```

### :page_facing_up: Settings API

| Methods | Description |
| --- | --- |
| `static get defaultSettings(): IStorageSettings` | Returns default settings applied to StorageUtilities | 
| `static get currentSettings(): IStorageSettings` | Returns current settings applied to StorageUtilities |
| `static set customSettings(settings: IStorageSettings)` | Sets custom settings to be applied to StorageUtilities. They will always overwrite default settings |
| `static resetSettings(): void` | Resets to default settings applied to StorageUtilities |

### :page_facing_up: Core methods API

| Methods | Description |
| --- | --- |
`addItem(key: string, item: T, expiry?: number, storageType?: StorageTypes): void` | Adds the item to Storage with its key. The item is added to `localStorage` by default, or `sessionStorage` if specified by `@param storageType`. The item can be added with an expiry time (in milliseconds). This is to add a TTL (Time to live) to invalidate item after the expiry time elapses. 
| `getItem(key: string, storageType?: StorageTypes, returnType?: StorageReturnTypes): T` | Returns the item stored in Storage by its key. If item is not found, or it has an expiry time which has elapsed, `null` will be returned. The item can be returned as a `Promise` or `Observable` if `@param returnType` is specified. The item is returned from `localStorage` by default, or `sessionStorage` as specified by `@param storageType`. 
| `updateItemProperty(key: string, propName: string, newValue: any, storageType?: StorageTypes): T` | Updates the value of a specific property for the stored item. The property can be of any type. If the property doesn't exist, a new property will be created. If the item is not found by key, or has expired, `null` will be returned, or updated item will be returned otherwise.
| `removeItemProperty(key: string, propName: string, storageType?: StorageTypes): T` | Removes the item's specified property. If the item is not found by key, or has expired, `null` will be returned, or updated item will be returned otherwise. 
| `removeItem(key: string, storageType?: StorageTypes): void` | Removes item from Storage by its key. The item is removed from `localStorage` by default, or `sessionStorage` if specified by `@param storageType`.
| `removeItems(keys: string[], storageType?: StorageTypes): void` | Removes items from Storage by their keys. The items are removed from `localStorage` by default, or `sessionStorage` if specified by `@param storageType`.
| `clearStorage(storageType?: StorageTypes): void` | Removes all items from storage. The items are removed from `localStorage` by default, or `sessionStorage` if specified by `@param storageType`. |

### :page_facing_up: Additional methods API
| Methods | Description |
| --- | --- |
| `getStorageState(): Observable<IStorageNotifier<T>>` | Returns storage state as an `Observable` of type `IStorageNotifier<T>`. All subscribers will be notified when state changes. | 
| `getStorageItems(storageType?: StorageTypes, returnType?: StorageReturnTypes): StorageItem<T>[]` | Returns an `Array` of all storage items. The items are returned from `localStorage` by default, or `sessionStorage` if specified by `@param storageType`. The items can be returned as a `Promise` or `Observable` if `@param returnType` is specified. |
| `getStorageValues(storageType?: StorageTypes, returnType?: StorageReturnTypes): T[]` | Returns an `Array` of all storage values. The values are returned from `localStorage` by default, or `sessionStorage` if specified by `@param storageType`. The values can be returned as a `Promise` or `Observable` if `@param returnType` is specified. |
| `getStorageKeys(storageType?: StorageTypes, returnType?: StorageReturnTypes): string[]` | Returns an `Array` of all storage keys. The keys are returned from `localStorage` by default, or `sessionStorage` if specified by `@param storageType`. The keys can be returned as a `Promise` or `Observable` if `@param returnType` is specified. |

### Author :books:
[Ahmed Alatawi](https://github.com/AhmedAlatawi)