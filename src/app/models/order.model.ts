import { Address } from './address.model';
import { Item } from './item.model';
import { Restaurant } from './restaurant.model';

export class Order {
    constructor(
        // public categoryId: string,
        public address: Address,
        public restaurant: Restaurant,
        public restaurantId: string,
        public order: Item[],
        public total: number,
        public grandTotal: number,
        public deliveryCharge: number,
        public status: string,
        public time: string,
        public paid: string,
        public instruction?: string,
        public uid?: string,
        public id?: string
    ){}
}
