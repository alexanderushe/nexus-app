import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router, private profileService: ProfileService){}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.checkAuth().then(id =>{
      console.log('auth guard checking id: ', id);
      if(id){
        //get profile
        this.profileService.getProfile().then(profile =>{
          console.log('user profile', profile);
          if(profile){
            if(profile?.type==='admin'){
              return true;}
              else {
                return false;
              }
          }else {
            this.authService.logout();
            this.router.navigateByUrl('/login');
          return false;
          }
        })
        .catch(e=>{
          console.log(e);
          this.authService.logout();
          this.router.navigateByUrl('/login');
        return false;
        });
        return true;
      }else {
        this.router.navigateByUrl('/login');
        // return false;
      }
    }).catch(e =>{
        this.router.navigateByUrl('/login');
        return false;
    });
  }
}
