import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-menu-item',
  templateUrl: './add-menu-item.page.html',
  styleUrls: ['./add-menu-item.page.scss'],
})
export class AddMenuItemPage implements OnInit {

  @ViewChild('filePicker',{static:false}) filePickerRef: ElementRef;
  restaurants: Restaurant[] =[];
  categories: Category[]=[];
  image: any;
  isLoading = false;
  veg =true;
  status =true;
  category: any;
  imageFile: any;
  constructor(
    public global: GlobalService,
    public apiService: ApiService,
    public afStorage: AngularFireStorage
    ) { }

  ngOnInit() {
    this.getRestaurants();
  }

  async onSubmit(form: NgForm) {
    if(!form.valid || !this.image) {return;}
    try {
      this.isLoading = true;
      const url = await this.uploadImage(this.imageFile);
      console.log(url);
      if(!url) {
        this.isLoading = false;
        this.global.errorToast('Image not uploaded, please try again');
        return;
      }
      const data = {
        cover: url,
        veg: this.veg,
        status: this.status,
        ...form.value
      };
      console.log('data: ', data);
      await this.apiService.addMenuItem(data);
      this.isLoading = false;
      this.global.successToast('Menu Item Added Successfully');
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }
  changeImage()
  {
    this.filePickerRef.nativeElement.click();
  }
  onFileChosen(event)
  {
    const file = event.target.files[0];
    if(!file){
      console.log(file);
      return;
    }
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload =()=>{
      const dataUrl = reader.result.toString();
      this.image = dataUrl;
      console.log('image is :',this.image);
    };
    reader.readAsDataURL(file);
  }
 async getRestaurants()
  {
    try{
      this.global.showLoader();
      this.restaurants = await this.apiService.getRestaurants();
      this.global.hideLoader();
    }catch(e)
    {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }
  async changeRestaurant(event){
    try{
      console.log(event);
      this.global.showLoader();
      this.categories = await this.apiService.getRestaurantCategories(event.detail.value);
      this.category = '';
      this.global.hideLoader();
    }catch(e)
    {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }
  uploadImage(imageFile){
    return new Promise((resolve,reject)=>{
      const mimeType = imageFile.type;
      if(mimeType.match(/image\/*/)=== null){return;}
      const file = imageFile;
      const filePath = 'menu/' + Date.now() + '_' + file.name;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);
      task.snapshotChanges().pipe(
        finalize(()=>{
          const downloadUrl = fileRef.getDownloadURL();
          downloadUrl.subscribe(url =>{
            console.log('url',url);
            if(url){
              resolve(url);
            }
          });
        })
        ).subscribe(url=> {console.log(url);});

    });
  }


}
