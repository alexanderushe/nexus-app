import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.page.html',
  styleUrls: ['./add-banner.page.scss'],
})
export class AddBannerPage implements OnInit {
bannerImage: any;
  constructor(public afStorage: AngularFireStorage,
    public apiService: ApiService,
    public global: GlobalService) { }

  ngOnInit() {
  }
  preview(event){
    console.log(event);
    const files = event.target.files;
    if(files.length===0){return;}
    const mimeType = files[0].type;
    if(mimeType.match(/image\/*/)=== null){return;}
    const file = files[0];
    const filePath = 'banners/' + Date.now() + '_' + file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    task.snapshotChanges().pipe(
      finalize(()=>{
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url =>{
          console.log(url);
          if(url){
            this.bannerImage = url;
          }
        });
      })
      ).subscribe(url=>{
      console.log('data: ', url);
    });
  }
  async saveBanner(){
    try{
      if(this.bannerImage ==='' || !this.bannerImage){return;}
      this.global.showLoader();
      const data = {
        banner: this.bannerImage,
        status: 'active'
      };
      await this.apiService.addBanner(data);
      this.global.hideLoader();
      this.global.successToast('Banner Created');
    }catch(e){
      this.global.errorToast();
    }
  }
}
