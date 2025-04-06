import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ui-kaas-input',
  templateUrl: './ui-kaas-input.component.html',
  styleUrls: ['./ui-kaas-input.component.scss']
})
export class UiKaasInputComponent implements OnInit {

  @Input() characterFilter : 'num' | 'letra' | 'all' | any = 'all';
  @Input() label : string = "";
  @Input() hint : string = "";
  @Input() placeholder : string = "";
  @Input() value : string = "";
  @Input() icono : string = "";
  @Input() readOnly : boolean = false;
  @Input() type : string = "text";
  @Input() selectType : boolean = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() iconClick = new EventEmitter<string>();
  constructor(private _translateService: TranslateService) { }

  mostrar_password: boolean = false;
  ngOnInit() {
    if(this.selectType) {
      this.value = this._translateService.instant(this.value);
    }
  }  

  blockEvent(event: KeyboardEvent) {
    if(this.characterFilter != 'all'){
      const patternMap: Record<typeof this.characterFilter, string> = {
        'num': '/[0-9]/',
        'letra': 'AAAAA',
        'all': '*****',
      };
      
      const pattern = patternMap[this.characterFilter] || this.characterFilter;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
          event.preventDefault();
      }
    }
  }

  onInputChange() {
    this.valueChange.emit(this.value);
  }

  clickIcon() {
    this.iconClick.emit();
  }

} 
