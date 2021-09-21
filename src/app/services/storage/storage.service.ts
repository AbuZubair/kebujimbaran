import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key)
  }

  public remove(key: string){
    this._storage.remove(key);
  }

  public clear(){
    this.storage.clear()
  }

  public storeDate(data,datetime,key){
    let store = {
      data: data,
      time: datetime
    }

    if(this.getCacheData(key))this._storage.remove(`cache:${key}`)
    this._storage.set(`cache:${key}`, store)
  }

  public getCacheData(key){
    return this._storage.get(`cache:${key}`)
  }

  public ageOfData(date,ages=0){
    let age = (ages!=0)?ages:2.16e+7; //6 hour
    const anHoursAgo = Date.now() - age;
    let compare = new Date(date).getTime()
    return compare > anHoursAgo
  }
}