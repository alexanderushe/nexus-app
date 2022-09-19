import { Address } from '../models/address.model';
import { Item } from '../models/item.model';
import { Restaurant } from '../models/restaurant.model';

 export interface Cart {
        restaurant: Restaurant;
        items: Item[];
        totalItem?: number;
        totalPrice?: number;
        grandTotal?: number;
        location?: Address;
        deliveryCharge?: number;
        from?: string;
}
