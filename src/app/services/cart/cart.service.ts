import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Cart } from 'src/app/interfaces/cart.interface';
// import { Cart } from 'src/app/models/cart.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { GlobalService } from '../global/global.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  model: any= {} as Cart;
  deliveryCharge = 20;
  private oCart = new BehaviorSubject<Cart>(null);
  constructor(private storage: StorageService, private global: GlobalService, private router: Router) { }

  get cart(){
    return this.oCart.asObservable();
  }
  getCart(){
    return this.storage.getStorage('cart');
  }
  async getCartData(val?){
    const data: any = await this.getCart();
    console.log('data', data);
    if(data?.value){
      this.model = await JSON.parse(data.value);
      console.log(this.model);
      await this.calculate();
      if(!val){this.oCart.next(this.model);}
    }
  }
  alertClearCart(index, items, data, order?){
    this.global.showAlert(order? 'Would you like to reset your cart before re-ordering from this store?':
    'Your cart contains items from a different store. Would you like to reset your cart before browsing items',
    'Items already in Cart',
      [{
        text: 'No',
        role: 'cancel',
        handler: () => {}
      },
      {
        text: 'Yes',
        handler: () =>{
          this.clear(index, items, data, order);
        }
      }
    ]
    );
  }
  async clear(index, items, data, order?){
    await this.clearCart();
    this.model = {} as Cart;
    if(order) {
      this.orderToCart(order);
    }
    else{this.quantityPlus(index,items,data);}
  }

  async orderToCart(order: Order){
    console.log('order', order);
    const data = {
      restaurant: order.restaurant,
      items: order.order
    };
    this.model = data;
    await this.calculate();
    this.saveCart();
    console.log('model ', this.model);
    this.oCart.next(this.model);
    this.router.navigate(['/','tabs','restaurants',order.restaurantId]);
  }
  async quantityPlus(index, items?: Item[], restaurant?: Restaurant){
    try{
      if (items) {
        console.log('model', this.model);
        this.model.items = [...items];
        if(this.model.from) {this.model.from='';}
      }
      if(restaurant) {
      //this.model.restaurant = {};
      this.model.restaurant=restaurant; }
      console.log(this.model.items[index]);
      if(!this.model.items[index].quantity || this.model.items[index].quantity===0){
        this.model.items[index].quantity = 1;

      } else {
        this.model.items[index].quantity +=1; //this index will add 1 to the items quantity
      }
      await this.calculate();
      this.oCart.next(this.model);
      return this.model;
    }catch (e){
      console.log(e);
      throw(e);
    }
  }
  async quantityMinus(index, items?: Item[]){
    try{
      if (items) {
        console.log('model', this.model);
        this.model.items = [...items];
        if(this.model.from) {this.model.from='';}
      } else {
        this.model.from = 'cart';
      }
        if(this.model.items[index].quantity && this.model.items[index].quantity !==0 ){
          this.model.items[index].quantity -= 1;
         // this.model.items[index].quantity = this.model.items[index].quantity - 1;//this index will subtract from the items
        }else {
          this.model.items[index].quantity =0;
        }
        await this.calculate();
          this.oCart.next(this.model);
          return this.model;
        }catch(e){
          console.log(e);
          throw(e);
        }
      }


  async calculate(){
    const item = this.model.items.filter(x => x.quantity >0);
    this.model.items = item;
    this.model.totalPrice = 0;
    this.model.totalItem = 0;
    this.model.deliveryCharge = 0;
    this.model.grandTotal=0;
    item.forEach(element =>{
      this.model.totalItem += element.quantity;
      // this.model.totalPrice += parseFloat(element.price) * parseFloat(element.quantity);
      this.model.totalPrice += element.price * element.quantity;
    });
    this.model.deliveryCharge = this.deliveryCharge;
    // this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
    // this.model.grandTotal = (parseFloat(this.model.totalPrice) + parseFloat(this.model.deliveryCharge)).toFixed(2);
    this.model.grandTotal = this.model.totalPrice + this.model.deliveryCharge;
    if(this.model.totalItem === 0){
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = {} as Cart;
    }
    console.log('cart ', this.model);
  }
  async clearCart(){
    this.global.showLoader();
    await this.storage.removeStorage('cart');
    this.oCart.next(null);
    this.global.hideLoader();
  };
  saveCart(model?){
    if(model) {this.model = model;}
    this.storage.setStorage('cart', JSON.stringify(this.model));
  }

  degree2radient(deg){
    return deg * (Math.PI/180);
  }
  getDistanceFromLatLngInKm(lat1,lng1,lat2,lng2){
    //1mile = 6km
    const radius = 6371; //radius of earth in km
    const lat = this.degree2radient(lat2 - lat1);
    const lng = this.degree2radient(lng2 - lng1);
 //formular for distance
    const result =  Math.sin(lat/2) * Math.sin(lat/2) +
                  Math.cos(this.degree2radient(lat1)) * Math.cos(this.degree2radient(lat2)) *
                  Math.sin(lng/2) * Math.sin(lng/2);
                  const c = 2 * Math.atan2(Math.sqrt(result), Math.sqrt(1-result));
                  const d = radius * c; // Distance in km
                  return d;
  }
  async checkCart(lat1,lng1, radius){
    let distance: number;
    // if(this.model?.restaurant){
    //   distance = this.getDistanceFromLatLngInKm(lat1,lng1,this.model.restaurant.latitude,this.model.restaurant.longitude);

    // }else{
    //   await this.getCartData(1);
    //   if(this.model?.restaurant){
    //     distance = this.getDistanceFromLatLngInKm(lat1,lng1,this.model.restaurant.latitude,this.model.restaurant.longitude);
    //   }
    // }
    await this.getCartData(1);
    if(this.model?.restaurant){
      distance = this.getDistanceFromLatLngInKm(
        lat1,lng1,
        this.model.restaurant.g.geopoint.latitude,
        this.model.restaurant.g.geopoint.longitude
        );
        console.log('distance', distance);
        if(distance > radius ){
          // this.clearCart();
          return true;
        }else {return false;}
    }else {
      return false;
    }
  }
}
