import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  uid: string;
  private sOrders = new BehaviorSubject<Order[]>([]);
  constructor(private api: ApiService, private auth: AuthService) { }
  get orders(){
    return this.sOrders.asObservable();
  }

  getRadius()
  {
    return this.api.radius;
  }
  async getUid(){
    if(!this.uid){ return await this.auth.getId();}
    else { return this.uid;}
  }
  async getOrderRef()
  {
    this.uid = await this.getUid();
    return this.api.collection('orders').doc(this.uid).collection('all');
  }
  async getOrders(){
    try{
      const orders: Order[] = await (await this.getOrderRef()).get().pipe(
        switchMap(async (data: any) => {
          const itemData = await data.docs.map(element => {
            const item = element.data();
            item.id = element.id;
            item.order = JSON.parse(item.order);
            item.restaurant.get()
            .then(rData => {
              item.restaurant = rData.data();
            })
            .catch(e => { throw(e); });
           return item;});
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise();;
    console.log('orders', orders);
    this.sOrders.next(orders);
    return orders;
    }catch(e){
      throw(e);
    }
  }
  async placeOrder(param){
    try {
      const data = {...param};
      data.order = JSON.stringify(param.order);
      const uid = await this.getUid();
      data.restaurant = await this.api.firestore.collection('restaurants').doc(param.restaurantId);
      const orderRef = await (await this.getOrderRef()).add(data);
      const orderId = await orderRef.id;
    // const currentOrders  = this.sOrders.value;
    console.log('Get latest orders', param);
    let currentOrders: Order[] =[];
    currentOrders.push(new Order(
      param.restaurant,
      param.restaurantId,
      param.order,
      param.total,
      param.grandTotal,
      param.address,
      param.deliveryCharge,
      param.status,
      param.time,
      param.paid,
      param.id,
      uid,
      param.instruction
    ));
    console.log('latest order: ', currentOrders);
    currentOrders = currentOrders.concat(this.sOrders.value);
    this.sOrders.next(currentOrders);
    return currentOrders;
    }catch(e){
      throw(e);
    }
  }

}
