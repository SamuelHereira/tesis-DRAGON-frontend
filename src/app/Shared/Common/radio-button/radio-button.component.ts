import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {
  
  @Input() label : string = "";
  @Input() hint : string = "";
  @Input() options : any[] = [];
  @Input() value! : string;
  @Input() classIn : string = "my-2 pt-2 pb-1";
  @Output() valueChange = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {
  }

  onValueChange(value: string) {
    this.value = value;
    this.valueChange.emit(value);
  }

}
