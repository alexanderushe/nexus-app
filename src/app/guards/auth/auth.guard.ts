import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Strings } from 'src/app/enum/strings';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router,
    private alertCtrl: AlertController, private global: GlobalService,
    private addressService: AddressService){}
  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean > {
      const roleType = route.data.type;
      try{
        const type = await this.authService.checkUserAuth();
        if(type){
          if(type=== roleType){
            return true;
          }
          else{
            let url = Strings.TABS;
            if(type==='admin'){
              url = Strings.ADMIN;
              this.navigate(url);
            }
          }
        }else {
          this.checkForAlert(roleType);
        }
      }catch(e){
        console.log(e);
        this.checkForAlert(roleType);
      }
  }
  navigate(url){
    this.router.navigateByUrl(url, {replaceUrl:true});
    return false;
  }
  async checkForAlert(roleType){
    const id = await this.authService.getId();
    if(id){
      console.log('alert', id);
      this.showAlert(roleType);
    }else
      {
        this.authService.logout();
        this.navigate(Strings.LOGIN);
      }
  }
  showAlert(role){
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: 'Please check your Internet Connectivity and try again',
      buttons:[
        {
          text: 'Logout',
        handler: () =>{
          this.authService.logout();
          this.navigate(Strings.LOGIN);
          return;
        }
      },
      {
        text: 'Retry',
      handler: () =>{
        let url = Strings.TABS;
        if(role === 'admin'){
          url = Strings.ADMIN;
        }
        this.navigate(url);
      }
      }
    ]
    })
    .then(alertEl => alertEl.present());
  }
}
