import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ui-kaas-hint',
  templateUrl: './ui-kaas-hint.component.html',
  styleUrls: ['./ui-kaas-hint.component.scss']
})
export class UiKaasHintComponent implements OnInit {

  @Input() label : string = "";
  
  constructor() { }

  ngOnInit() {
  }

}
