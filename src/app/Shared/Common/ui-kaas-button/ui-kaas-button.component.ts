import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ui-kaas-button',
  templateUrl: './ui-kaas-button.component.html',
  styleUrls: ['./ui-kaas-button.component.scss']
})
export class UiKaasButtonComponent implements OnInit {

  /* Propiedades Out */
  @Output() eventClick  = new EventEmitter();

  // Propiedades de entrada colores
  @Input() background_color : string = "bg-primary-700"
  @Input() text_color : string = "color-white"
  @Input() custom_background_color : boolean = false;
  @Input() custom_text_color : boolean = false;
  @Input() background_color_value! : string;
  @Input() custom_text_color_value! : string;
  @Input() tooltip : string = "";

  // Propiedades de entrada icono
  @Input() icon_visible : boolean = false;
  @Input() icon! : string;
  @Input() icon_img : boolean = false;
  @Input() icon_img_value! : string;
  @Input() iconPosition : "left" | "right" = "left";

  // Propiedades de entrada generales
  @Input() label!: string;
  @Input() buttonSize : "small" | "medium" | "large" = "medium";
  @Input() buttonText : boolean = false;
  @Input() disabled : boolean = false;
  @Input() butonFull : boolean = false;
  @Input() type : string = 'button';

  custom_background_color_class : string = "";
  custom_text_color_class : string = "";
  button_size_class : string = "";
  constructor() { }

  ngOnInit() {
    if(this.custom_background_color)
      this.custom_background_color_class = this.background_color_value;
    if(this.custom_text_color)
      this.custom_text_color_class = "color: "+this.custom_text_color_value;
    this.button_size_class = "ui-kaas-style-button-"+this.buttonSize;
  }

  getColorClass() : string{
    let colors_finally : string = "";
    if(this.buttonText){
      colors_finally = this.text_color  + ' ui-kaas-style-button-text';
    }
    else{
      if (!this.custom_background_color) {
        colors_finally = this.background_color;
      }
      if(!this.custom_text_color)
      {
        colors_finally = (colors_finally != "") ? colors_finally+' '+this.text_color : this.text_color;
      }
      colors_finally = colors_finally + ' ui-kaas-style-button';
  
    }

    if(this.butonFull)
      colors_finally = colors_finally + ' w-full'
    if(this.text_color == 'text-primary')
      colors_finally = colors_finally + ' border-1 border-solid border-primary'
    return colors_finally
  }

  ejecutarAccion(){
    if(!this.disabled)
      this.eventClick.emit();
  }


}
