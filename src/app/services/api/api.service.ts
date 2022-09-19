import { Injectable } from '@angular/core';
import { Address } from 'src/app/models/address.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import * as geofirestore from 'geofirestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Banner } from 'src/app/models/banner.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  radius = 5; // in kilometers
  firestore = firebase.firestore();
  geoFirestore = geofirestore.initializeApp(this.firestore);

  restaurants: Restaurant[] = [];
  allRestaurants: Restaurant[] = [];
  restaurants1: Restaurant[] = [];
  categories: Category[] = [];
  allItems: Item[] = [];
  addresses: Address[] = [];
  orders: Order[] = [];

  constructor(
    private adb: AngularFirestore
  ) {}

  collection(path, queryFn?) {
    return this.adb.collection(path, queryFn);
  }

  geoCollection(path) {
    return this.geoFirestore.collection(path);
  }

  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  // banner apis
  async addBanner(data) {
    try {
      const id = this.randomString();
      const bannerData = new Banner(id,data.banner,data.status);
      const banner  = Object.assign({},bannerData);
      delete bannerData.resId;
      await this.collection('banners').doc(id).set(banner);
      return true;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async getBanners() {
    try {
      const banners: Banner[] = await this.collection('banners').get().pipe(
        switchMap(async (data: any) => {
          const bannerData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log(bannerData);
          return bannerData;
        })
      ).toPromise();
      console.log(banners);
      return banners;
    } catch(e) {
      throw(e);
    }
  }

  // city apis
  async getCities() {
    try {
      const cities = await this.collection('cities').get().pipe(
        switchMap(async (data: any) => {
          const cityData = await data.docs.map(element => {
            const item = element.data();
            item.uid = element.id;
            return item;
          });
          console.log(cityData);
          return cityData;
        })
      ).toPromise();
      console.log(cities);
      return cities;
    } catch(e) {
      throw(e);
    }
  }

  //  restaurant apis
  async addRestaurant(data: any, uid) {
    try {
      const restaurant  = Object.assign({}, data);
      delete restaurant.g;
      delete restaurant.distance;
      console.log(restaurant);
      const response = await this.geoCollection('restaurants').doc(uid).set(restaurant);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async getRestaurants() {
    try {
      const restaurants = await this.collection('restaurants').get().pipe(
        switchMap(async (data: any) => {
          const restaurantData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log(restaurantData);
          return restaurantData;
        })
      ).toPromise();
      console.log(restaurants);
      return restaurants;
    } catch(e) {
      throw(e);
    }
  }

  async getRestaurantById(id): Promise<any> {
    try {
      const restaurant = (await (this.collection('restaurants').doc(id).get().toPromise())).data();
      console.log(restaurant);
      return restaurant;
    } catch(e) {
      throw(e);
    }
  }

  async getNearbyRestaurants(lat, lng): Promise<any> {
    try {
      const center = new firebase.firestore.GeoPoint(lat, lng);
      const radius = this.radius;
      const data = await (await this.geoCollection('restaurants').near({ center, radius: this.radius })
      .get()).docs.sort((a, b) => a.distance - b.distance).map(element => {
        const item = element.data();
        item.id = element.id;
        item.distance = element.distance;
        return item;
      });
      return data;
    } catch(e) {
      throw(e);
    }
  }

  // categories
  async getRestaurantCategories(uid) {
    try {
      const categories = await this.collection(
        'categories',
        ref => ref.where('uid', '==', uid)
      ).get().pipe(
        switchMap(async (data: any) => {
          const categoryData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log(categoryData);
          return categoryData;
        })
      ).toPromise();
      console.log(categories);
      return categories;
    } catch(e) {
      throw(e);
    }
  }

  async addCategories(categories, uid) {
    try {
      categories.forEach(async (element) => {
        const id = this.randomString();
        const data = new Category(
          id,
          element,
          uid
        );
        const result = await this.collection('categories').doc(id).set(Object.assign({}, data));
      });
      return true;
    } catch(e) {
      throw(e);
    }
  }

  // menu
  async addMenuItem(data) {
    try {
      const id = this.randomString();
      const item = new Item(
        id,
        data.restaurant_id,
        this.firestore.collection('categories').doc(data.categoryId),
        data.cover,
        data.name,
        data.description,
        data.price,
        data.veg,
        data.status,
        false,
        0
      );
      const itemData = Object.assign({}, item);
      delete itemData.quantity;
      console.log(itemData);
      const result = await this.collection('menu').doc(data.restaurantId).collection('allItems').doc(id).set(itemData);
      return true;
    } catch(e) {
      throw(e);
    }
  }

  async getRestaurantMenu(uid) {
    try {
      const itemsRef = await this.collection('menu').doc(uid)
          .collection('allItems', ref => ref.where('status', '==', true));
      const items = itemsRef.get().pipe(
        switchMap(async (data: any) => {
          const itemData = await data.docs.map(element => {
            const item = element.data();
            item.categoryId.get()
            .then(cData => {
              item.categoryId = cData.data();
            })
            .catch(e => { throw(e); });
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise();
      console.log(items);
      return items;
    } catch(e) {
      throw(e);
    }
  }

}
