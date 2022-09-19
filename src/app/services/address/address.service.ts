import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; //used to fetch latest changes made to the page
import { switchMap } from 'rxjs/operators';
import { Address } from '../../../app/models/address.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  uid: string;
  private oBaddresses = new BehaviorSubject<Address[]>([]);
  private oaddressChange = new BehaviorSubject<Address>(null);

  constructor(private api: ApiService, private auth: AuthService) { }

  get addresses(){
    return this.oBaddresses.asObservable();
  }
  get addressChange(){
    return this.oaddressChange.asObservable();
  }

  async getUid(){
    return await this.auth.getId();
  }
  async getAddressRef(query?){
    if (!this.uid){this.uid =  await this.getUid();}
    return await this.api.collection('address').doc(this.uid).collection('all', query);
  }
  async getAddresses(limit?){
    try{
      //user id

      let addressRef;
      if(limit ){addressRef = await this.getAddressRef(ref => ref.limit(limit));
      }else {
        addressRef =  await this.getAddressRef();
      }
      const allAddress: Address[] = await addressRef.get().pipe(
        switchMap(async (data: any) => {
          const itemData = await data.docs.map(element => {
            const item = element.data();
            item.id = element.id;
           return item;});
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise();
      console.log(allAddress);
      this.oBaddresses.next(allAddress);
      return allAddress;
    } catch(e){
      console.log(e);
      throw(e);
    }
  }
 async addAddresses(param){
   try
   {
    const currentAddresses = this.oBaddresses.value;
    const data = new Address(
      this.uid? this.uid : await this.getUid(),
      param.title,
      param.address,
      param.landmark,
      param.house,
      param.lat,
      param.lng
    );
    const addressData = Object.assign({}, data);
    delete addressData.id;
    const response = await (await this.getAddressRef()).add(addressData);
    console.log(response);
    const id = await response.id;
    const address =  {...addressData, id};
    currentAddresses.push(address);
    this.oBaddresses.next(currentAddresses);
    this.oaddressChange.next(address);
    return address;
   }catch(e){
     throw(e);
   }
  }
  async updateAddresses(id, param){
    try{
      await (await this.getAddressRef()).doc(id).update(param);
      const currentAddresses = this.oBaddresses.value;
      const index = currentAddresses.findIndex(x => x.id === id);
      const data =  new Address(
        param.userId,
        param.title,
        param.address,
        param.landmark,
        param.house,
        param.lat,
        param.lng,
        id,
        );
      currentAddresses[index] = data;
      this.oBaddresses.next(currentAddresses);
      this.oaddressChange.next(data);
      return data;
    }catch(e)
    {
      throw(e);
    }
  }

 async deleteAddress(param){
   try
   {
     await (await this.getAddressRef()).doc(param.id).delete();
    let currentAddresses = this.oBaddresses.value;
    currentAddresses = currentAddresses.filter(x => x.id !== param.id);
    this.oBaddresses.next(currentAddresses);
    return currentAddresses;
   }catch(e)
   {
    throw(e);
   }

  }
  changeAddress(address){
    this.oaddressChange.next(address);
  }
  async checkExistAddress(location){
    try{
      console.log('check exists address: ', location);
      let loc: Address = location;
      const addresses: Address[] = await (await this.getAddressRef(ref => ref.where('lat', '==', location.lat)
        .where('lng', '==', location.lng))).get().pipe(
        switchMap(async (data: any) => {
          const itemData = await data.docs.map(element => {
            const item = element.data();
            item.id = element.id;
           return item;});
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise();
      // const address = await this.api.addresses.find(x => x.lat === location.lat && x.lng === location.lng);
      console.log('addresses', addresses);
      if(addresses?.length > 0){
        loc = addresses[0];
      }
      console.log('loc',loc);
      this.changeAddress(loc);
      return loc;
    }catch(e){
      throw(e);
    }
  }
}
