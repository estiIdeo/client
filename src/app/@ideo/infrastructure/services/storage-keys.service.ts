import { Injectable } from '@angular/core';
import { IntelligenceKeys } from '@app/@shared/types/IntelligenceKeys.type';

type StorageKeysType = 'token' | 'credentials' | 'user' | 'permissions' | 'selected-partner-fleet'
type ExtendsStorageKeysType = IntelligenceKeys<StorageKeysType>
@Injectable({
  providedIn: 'root',
})
export class StorageKeysService {
  constructor() { }

  public getItem<T>(key: ExtendsStorageKeysType): T {
    const storageValue = localStorage.getItem(key);
    return storageValue ? JSON.parse(storageValue) : null;
  }

  public setItem(key: ExtendsStorageKeysType, obj: any) {
    if (!!key) {
      const valueString = JSON.stringify(obj);
      localStorage.setItem(key, valueString);
    }
  }

  public removeItem(key: ExtendsStorageKeysType) {
    if (!!key) {
      localStorage.removeItem(key);
    }
  }
}

export class CacheKeys {

  public static TOKEN: StorageKeysType = 'token';
  public static CREDENTIALS: StorageKeysType = 'credentials';
  public static USER: StorageKeysType = 'user';
  public static PERMISSIONS: StorageKeysType = 'permissions';
  public static SELECTED_PARTNER_FLEET: StorageKeysType = 'selected-partner-fleet';

  static clearCache() {
    for (const keyName in CacheKeys) {
      if (Object.prototype.hasOwnProperty.call(CacheKeys, keyName)) {
        const key = CacheKeys[keyName];
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      }
    }
  }
}
