import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ui-kaas-heading',
  templateUrl: './ui-kaas-heading.component.html',
  styleUrls: ['./ui-kaas-heading.component.scss']
})
export class UiKaasHeadingComponent implements OnInit {

  @Input() label : string = "";
  constructor() { }

  ngOnInit() {
  }

}
