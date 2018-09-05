import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pm-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent {

  @Output()
  close = new EventEmitter();

}
