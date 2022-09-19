import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index: any;
  @Output() add: EventEmitter <any> = new EventEmitter();
  @Output() minus: EventEmitter <any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}
  quantityPlus(){
    this.add.emit(this.index);
  }
  quantityMinus(){
    this.minus.emit(this.index);
  }

}
