import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OptionLanguage } from 'src/app/Models/option_language';

@Component({
  selector: 'app-change_of_anguage',
  templateUrl: './change_of_anguage.component.html'
})
export class Change_of_anguageComponent implements OnInit {

  constructor(private _translateService: TranslateService) { 
    this.assignLanguage();
  }
  
  options_language : OptionLanguage[] = [
    { name: 'language-component.spanish', code: 'local-es' },
    { name: 'language-component.english', code: 'local-en' }
  ]

  option_select: string = "";
  
  ngOnInit() {
    
  }

  assignLanguage(){
    const index_label = this.options_language.findIndex(value=> value.code == this._translateService.currentLang);
    this.option_select = this.options_language[index_label].name;
  }


  changeLanguage(code:string){
    this._translateService.use(code).subscribe(()=>this.assignLanguage());
  }


}
