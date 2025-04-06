import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ui-kaas-slider',
  templateUrl: './ui-kaas-slider.component.html',
  styleUrls: ['./ui-kaas-slider.component.scss']
})
export class UiKaasSliderComponent implements OnInit {

  @Input() label : string = "";
  @Input() hint : string = "";
  @Input() value! : number;
  @Input() classIn : string = "";
  @Output() valueChange = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit() {
  }

  onValueChange(value: any) {
    this.valueChange.emit(this.value);
  }

}
