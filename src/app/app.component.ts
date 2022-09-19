import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { GlobalService } from './services/global/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private global: GlobalService) {
    this.initializeApp();
  }
  initializeApp(){
    this.platform.ready().then(async ()=>{
      this.global.customStatusbar();
      //this.splashScreen.hide();
      SplashScreen.hide();
    });
  }

}
