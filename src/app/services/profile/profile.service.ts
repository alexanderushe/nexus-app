import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private oprofile = new BehaviorSubject<User>(null);
  constructor(private apiService: ApiService,private authService: AuthService) { }

  get profile(){
    return this.oprofile.asObservable();
  }

  async getProfile() {
    try {
      const uid = await this.authService.getId();
      const profile: any = await (await (this.apiService.collection('users').doc(uid).get().toPromise())).data();
      console.log('profile: ', profile);
      const data = new User(
        profile.email,
        profile.phone,
        profile.name,
        uid,
        profile.type,
        profile.status
      );
      this.oprofile.next(data);
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async updateProfile(profile, param) {
    try {
      const uid = await this.authService.getId();
      const result = await this.apiService.collection('users').doc(uid).update(param);
      const data = new User(
        param.email,
        param.phone,
        profile.name,
        profile.uid,
        profile.type,
        profile.status
      );
      this.oprofile.next(data);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updateProfilewithEmail(profile, param, password) {
    try {
      await this.authService.updateEmail(profile.email, param.email, password);
      await this.updateProfile(profile, param);
      return profile;
    } catch(e) {
      throw(e);
    }
  }
}
