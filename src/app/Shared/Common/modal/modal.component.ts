import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy  {

  /* Datos entrada */
  @Input() titulo! : string;
  @Input() ocultarHeader : boolean = false;
  @Input() content : string = "";
  @Input() hideClose : boolean = true;
  @Output() emmiterClose : EventEmitter<any> = new EventEmitter<any>();
  @Input() peticionError : boolean = false;
  @Input() width : string = "40%";
  constructor() { }
  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }

  ngOnInit() {
    document.body.classList.add('modal-open');
  }

  cerrarModal() {
    this.emmiterClose.emit();
  }

}
