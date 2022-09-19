import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@capacitor/storage';
import {NavigationExtras, Router} from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
// import { Cart } from 'src/app/models/cart.model';
// import { Order } from 'src/app/models/order.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { AddressService } from 'src/app/services/address/address.service';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Cart } from 'src/app/interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, {static:false}) content: IonContent;
  urlCheck: any;
  url: any;
  model = {} as Cart;
  deliveryCharge = 20;
  instruction: any;
  location = {} as Address;
  cartSub: Subscription;
  addressSub: Subscription;

  constructor( private router: Router, private orderService: OrderService, private global: GlobalService,
    private navCtrl: NavController, private cartService: CartService, private addressService: AddressService ) {   }

  async ngOnInit() {
    await this.getData();
    this.addressSub = this.addressService.addressChange.subscribe(async address =>{
      console.log('location cart',address);
      this.location = address;
      if(this.location?.id && this.location?.id !==''){
        const radius = this.orderService.getRadius();
        const result =  await this.cartService.checkCart(this.location.lat,this.location.lng,radius);
        console.log(result);
        if(result) {
          this.global.errorToast('Location is too far from the grocery store in the cart, kindly search from some other store nearby',5000);
          this.cartService.clearCart();
        }
      }
    });
    this.cartSub = this.cartService.cart.subscribe(cart =>{
      console.log('cart page', cart);
      this.model = cart;
      if(!this.model) {this.location = {} as Address;
    }
    console.log('cart page model: ', this.model);
    });
  }
  async getData(){
    await this.checkUrl();
    // this.location = new Address(
    //   'address1', 'user1','Address', 'my new address', '','', 23.995833,77.889984,
    // );
    await this.cartService.getCartData();
  }

  clearCart(){
    return Storage.remove({key: 'cart'});
  }
  checkUrl(){
    const url: any= this.router.url.split('/');
    console.log(url);
    const spliced = url.splice(url.length-2,2);
    this.urlCheck = spliced[0];
    console.log('checking ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }
  getPreviousUrl(){
    return this.url.join('/');
  }
  quantityPlus(index){
    this.cartService.quantityPlus(index);
  }
  quantityMinus(index){
    this.cartService.quantityMinus(index);
  }
  addAddress(location?){
    let url: any;
    let navData: NavigationExtras;
    if(location){
      location.from = 'cart';
      navData={
        queryParams: {
          data: JSON.stringify(location)
        }
      };
    }
    if(this.urlCheck === 'tabs'){
      url = ['/','tabs','address','edit-address'];
    }else {
      url= [this.router.url, 'address','edit-address'];
    }
    this.router.navigate(url,navData);
  }
  async changeAddress(){
    try{
      const options ={
        component: SearchLocationComponent,
        swipeToClose: true,
        cssClass: 'custom-modal',
        componentProps: {
          from: 'cart'
        }
      };
        const address = await this.global.createModal(options);
        if(address){
          if(address=== 'add'){
            this.addAddress();
          }
          await this.addressService.changeAddress(address);
        }
    }catch(e){
      console.log(e);
    }
  }
  async makePayment(){
    try{
      console.log('model:', this.model);
      const data = {
        instruction: this.instruction ? this.instruction: ' ',
        restaurantId: this.model.restaurant.uid,
        restaurant: this.model.restaurant,
        order: (this.model.items), //JSON.stringify(this.model.items),
        time: moment().format('lll'),
        address: this.location,
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD'
      };
      console.log('order', data);
      await this.orderService.placeOrder(data);
      //clear cart
      await this.cartService.clearCart();
      this.model = {} as Cart;
      this.global.successToast('Your Order is placed successfully');
      this.navCtrl.navigateRoot(['tabs/account']);
    }
    catch(e){
      console.log(e);
    }
  }
  scrollToBottom(){
    this.content.scrollToBottom(500);
  }
  ionViewWillLeave(){
    console.log('will leave');
    if(this.model?.items && this.model.items.length>0){
      this.cartService.saveCart();
    }
  }
  ngOnDestroy(){
      console.log('Destroy cart page');
      if(this.addressSub){
        this.addressSub.unsubscribe();
        if(this.cartSub){
          this.cartSub.unsubscribe();
        }
      }
  }

}
