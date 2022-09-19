import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { Strings } from 'src/app/enum/strings';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
profile: any = {};
isLoading: boolean;
  orders: Order[]=[];
  ordersSub: Subscription;
  profileSub: Subscription;

  constructor(private orderService: OrderService, private cartService: CartService, private global: GlobalService,
    private profileService: ProfileService, private authService: AuthService, private navCtrl: NavController) { }

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(order =>{console.log('order data', order);
    this.orders = order;
  },
    e => {
      console.log(e);
    });
    this.profileSub = this.profileService.profile.subscribe(profile =>{
      this.profile = profile;
      console.log(this.profile);
    });
    this.getData();
  }
  ionViewDidEnter(){
    this.global.customStatusbar(true);
  }

  async getData() {
    this.isLoading = true;
    await this.profileService.getProfile();
    await this.orderService.getOrders();
    this.isLoading = false;
  }
  confirmLogout(){
    this.global.showAlert(
      'Are you sure you want to sign-out?',
      'Confirm',
      [{
        text: 'No',
        role: 'cancel'
      },
    {text: 'Yes',
  handler: () =>{
    this.logout();
  }}]
  );
  }

  logout() {
    this.global.showLoader();
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot(Strings.LOGIN);
      this.global.hideLoader();
    })
    .catch(e => {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast('Logout Failed! Check your internet connection');
    });
  }
  async reorder(order: Order){
    console.log('order',order);
    //you need to access cart services first. to check if there any data, and it needs to be cleared before reordering
    const data: any = await this.cartService.getCart();
    console.log('data', data);
    if(data?.value){
      this.cartService.alertClearCart(null,null,null, order);
    }else {
      this.cartService.orderToCart(order);
    }
  }
  gethelp(order){
    console.log('help', order);
  }

  async editProfile(){
    const options = {
      component: EditProfileComponent,
      componentProps: {
        profile: this.profile
      },
      cssClass: 'custom-modal',
      swipeToClose: true
    };
    const modal = await this.global.createModal(options);
  }

  ionViewDidLeave(){
    this.global.customStatusbar(true);
  }
  ngOnDestroy() {
    if(this.ordersSub) {this.ordersSub.unsubscribe();}
    if(this.profileSub){this.profileSub.unsubscribe();}
  }
}
