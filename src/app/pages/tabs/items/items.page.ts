import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { Cart } from 'src/app/interfaces/cart.interface';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit, OnDestroy {

  id: any;
  data = {} as Restaurant;
  items: Item[] = [];
  veg  = false;
  isLoading: boolean;
  cartData = {} as Cart;
  storedData = {} as Cart;
  model = {
    icon: 'fast-food-outline',
    title: 'No Menu Available'
  };
  categories: Category[] = [];
  allItems: Item[] = [];
  cartSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cartService: CartService,
    private global: GlobalService
  ) { }

  ngOnInit() {
   const id = this.route.snapshot.paramMap.get('restaurantId');
   console.log('check id: ', id);
   if(!id){
     this.navCtrl.back();
     return;
   }this.id = id;
   console.log('id ', id);
    // this.route.paramMap.pipe(take(1)).subscribe(paramMap => {
    //   console.log('route data: ', paramMap);
    //   if(!paramMap.has('restaurantId')) {
    //     this.navCtrl.back();
    //     return;
    //   }
    //   this.id = paramMap.get('restaurantId');
    //   console.log('id: ', this.id);
    // });
    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart items: ', cart);
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      if(cart && cart?.totalItem > 0) {
        this.storedData = cart;
        this.cartData.totalItem = this.storedData.totalItem;
        this.cartData.totalPrice = this.storedData.totalPrice;
        if(cart?.restaurant?.uid === this.id) {
          this.allItems.forEach(element => {
            let qty = false;
            cart.items.forEach(element2 => {
              if(element.id !== element2.id) {
                // if((cart?.from && cart?.from === 'cart') && element?.quantity){
                //   element.quantity = 0;
                // }
                return;
              }
              element.quantity = element2.quantity;
              qty = true;
            });
            console.log(`element check (${qty}): `, element?.name + ' | ' + element?.quantity);
            if(!qty && element?.quantity){
              element.quantity = 0;
            }
          });
          console.log('allitems: ', this.allItems);
          this.cartData.items = this.allItems.filter(x => x.quantity > 0);
          if(this.veg === true) {this.items = this.allItems.filter(x => x.veg === true);}
          else {this.items = [...this.allItems];}
        } else {
          this.allItems.forEach(element => {
              element.quantity = 0;
          });
          if(this.veg === true) {this.items = this.allItems.filter(x => x.veg === true);}
          else {this.items = [...this.allItems];}
        }
      }else {
        this.allItems.forEach(element => {
          element.quantity = 0;
      });
      if(this.veg === true) {this.items = this.allItems.filter(x => x.veg === true);}
      else {this.items = [...this.allItems];
      }
    }
    });
    this.getItems();
  }

  async getItems() {
    try {
      this.isLoading = true;
      this.data = {} as Restaurant;
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      this.data = await this.api.getRestaurantById(this.id);
      this.categories = await this.api.getRestaurantCategories(this.id);
      this.allItems = await this.api.getRestaurantMenu(this.id);
      this.items = [...this.allItems];
      console.log('restaurants: ', this.data);
      console.log('items: ', this.items);
      await this.cartService.getCartData();
      this.isLoading = false;
      // this.allItems.forEach((element, index) => {
        //     this.allItems[index].quantity = 0;
        //   });
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }

  vegOnly(event) {
    console.log(event.detail.checked);
    this.items = [];
    if(event.detail.checked === true) {this.items = this.allItems.filter(x => x.veg === true);}
    else {this.items = this.allItems;}
    console.log('items: ', this.items);
  }

  quantityPlus(item) {
    const index = this.allItems.findIndex(x => x.id === item.id);
    console.log(index);
    if(!this.allItems[index].quantity || this.allItems[index].quantity === 0) {
      if(!this.storedData.restaurant || (this.storedData.restaurant && this.storedData.restaurant.uid === this.id)) {
        console.log('index item: ', this.allItems);
        this.cartService.quantityPlus(index, this.allItems, this.data);
      } else {
        // alert for clear cart
        this.cartService.alertClearCart(index, this.allItems, this.data);
      }
    } else {
      this.cartService.quantityPlus(index, this.allItems, this.data);
    }
  }

  quantityMinus(item) {
    const index = this.allItems.findIndex(x => x.id === item.id);
    this.cartService.quantityMinus(index, this.allItems);
  }

  saveToCart() {
    try {
      this.cartData.restaurant = {} as Restaurant;
      this.cartData.restaurant = this.data;
      console.log('save cartData: ', this.cartData);
      this.cartService.saveCart();
    } catch(e) {
      console.log(e);
    }
  }

  async viewCart() {
    console.log('save cartdata: ', this.cartData);
    if(this.cartData.items && this.cartData.items.length > 0) {await this.saveToCart();}
    console.log('router url: ', this.router.url);
    this.router.navigate([this.router.url + '/cart']);
  }

  checkItemCategory(id) {
    const item = this.items.find(x => x.categoryId.id === id);
    if(item) {return true;}
    return false;
  }

  async ionViewWillLeave() {
    console.log('ionViewWillLeave ItemsPage');
    if(this.cartData?.items && this.cartData?.items.length > 0) {await this.saveToCart();}
  }

  ngOnDestroy() {
    if(this.cartSub) {this.cartSub.unsubscribe();}
  }

}
