import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/models/item.model';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index;
  @Output() add: EventEmitter <Item> = new EventEmitter();
  @Output() minus: EventEmitter <any> = new EventEmitter();
  fallbackImage = 'assets/imgs/1.jpg';
  constructor() { }

  ngOnInit() {}
  quantityPlus(){
    this.add.emit(this.item);
  }
  quantityMinus(){
    this.minus.emit(this.item);
  }
  onImgError(event){
    event.target.src = this.fallbackImage;
  }

}
