import { Component, DoCheck, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ui-kaas-input-select',
  templateUrl: './ui-kaas-input-select.component.html',
  styleUrls: ['./ui-kaas-input-select.component.scss']
})
export class UiKaasInputSelectComponent implements OnInit, DoCheck {

  @Input() label : string = "";
  @Input() hint : string = "";
  @Input() options : any[] = [];
  @Input() value! : any;
  @Input() classIn : string = "";
  @Input() id_menu : string = "";
  @Input() readOnly : boolean = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() onChange = new EventEmitter<string>();

  classStyleActive : boolean = false;
  selectString : string = "";
  constructor() { 
    
  }

  ngOnInit() {
    this.selectTypeGame(this.value);
  }
  
  ngDoCheck(){
    this.adjustPanelWidth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.ejecutarMetodo(changes['value'].currentValue);
    }
  }

  ejecutarMetodo(code: any) {
    const index_label = this.options.findIndex(value=> value.code == code);
    if(index_label == -1){
      this.selectString = "";
    }
    else {
      this.selectString = this.options[index_label].name;
    }
  }

  adjustPanelWidth(): void {
    const widthButton= document.getElementById("menuElement")?.offsetWidth;
    const element = document.getElementsByClassName('mat-mdc-menu-content') as HTMLCollectionOf<HTMLElement>;
    const elementPanel = document.getElementsByClassName('mat-mdc-menu-panel') as HTMLCollectionOf<HTMLElement>;
    for(var i = 0; i < element.length; i++) {
      if(element[i].offsetParent?.classList.contains(this.id_menu))
        {
          element[i].style.width = widthButton+"px";
          elementPanel[i].style.maxWidth = "none";
          elementPanel[i].style.marginTop = "4px";
        }
    }
  }

  onValueChange(value: string) {
    this.value = value;
    this.valueChange.emit(value);
  }

  openMenu(){
    this.classStyleActive = true;
  }

  closeMenu() {
    this.classStyleActive = false;
  }

  selectTypeGame(code : string) {
    const index_label = this.options.findIndex(value=> value.code == code);
    this.selectString = this.options[index_label].name;
    this.value = this.options[index_label].code;
    this.valueChange.emit(this.value);
    this.onChange.emit(this.value);
  }

  onChangeTypeGame(code : string){
    this.selectTypeGame(code);
  }

}
