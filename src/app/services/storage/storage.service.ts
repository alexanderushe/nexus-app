import { Injectable } from '@angular/core';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  setStorage(key, value){
    return Storage.set({key, value});
  }
  getStorage(key){
    //use migrate function
    return Storage.get({key});
  }
  removeStorage(key){
    return Storage.remove({key});
  }
  clearStorage(){
    Storage.clear();
  }
}
