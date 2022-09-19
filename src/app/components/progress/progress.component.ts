import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  user: any={};
  progress = 0;
  statuses: any[] = [
    {
      title: '1 of 5',
      description: 'Order has been received by store'
    },
    {
      title: '2 of 5',
      description: 'We are now packing...'
    },
    {
      title: '3 of 5',
      description: 'Driver picking up order'
    },
    {
      title: 'Dispatched',
      description: 'Driver on their way'
    },
    {
      title: 'Arrived',
      description: 'Driver has arrived'
    }
  ];


  constructor() { }

  ngOnInit() {}

}
