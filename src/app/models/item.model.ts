export class Item {
    constructor(
        public id: string,
        public uid: string,
        public categoryId: any,
        public cover: string,
        public name: string,
        public desc: string,
        public price: number,
        public status: boolean,
        public veg: boolean,
        public variation: boolean,
        public rating: number,
        public quantity?: number
    ){}
}
