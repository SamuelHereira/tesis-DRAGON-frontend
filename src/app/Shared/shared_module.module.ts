import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from './Common/page-404/page-404.component';
import { Change_of_anguageComponent } from './Common/change_of_anguage/change_of_anguage.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule} from '@ngx-translate/core';
import { UiKaasButtonComponent } from './Common/ui-kaas-button/ui-kaas-button.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import { DragulaModule } from 'ng2-dragula';
import { ModalComponent } from './Common/modal/modal.component';
import { UiKaasInputComponent } from './Common/ui-kaas-input/ui-kaas-input/ui-kaas-input.component';
import { UiKaasHeadingComponent } from './Common/ui-kaas-input/ui-kaas-heading/ui-kaas-heading.component';
import { UiKaasHintComponent } from './Common/ui-kaas-input/ui-kaas-hint/ui-kaas-hint.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { CalendareComponent } from './Common/calendare/calendare.component';
import { RadioButtonComponent } from './Common/radio-button/radio-button.component';
import { UiKaasInputSelectComponent } from './Common/ui-kaas-input-select/ui-kaas-input-select.component';
import {MatSliderModule} from '@angular/material/slider';
import { UiKaasSliderComponent } from './Common/ui-kaas-slider/ui-kaas-slider.component';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MY_DATE_FORMATS } from '../Utils/fechaFormateada';
import { DurationPipe } from './Pipes/horas.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UiChargeComponent } from './Common/ui-charge/ui-charge.component';

// export const MY_DATE_FORMATS = {
//   parse: {
//     dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
//   },
//   display: {
//     dateInput: 'input',
//     monthYearLabel: { year: 'numeric', month: 'short' },
//     dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
//     monthYearA11yLabel: { year: 'numeric', month: 'long' },
//   },
// };

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule, 
    MatMenuModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDatepickerModule,
    MatRadioModule,
    FormsModule,
    MatSliderModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSortModule,
    CdkDrag,
    CdkDragHandle,
    DragulaModule.forRoot(),
  ],
  declarations: [
    Page404Component,
    Change_of_anguageComponent,
    UiKaasButtonComponent,
    ModalComponent,
    UiKaasInputComponent,
    UiKaasHeadingComponent,
    UiKaasHintComponent,
    CalendareComponent,
    RadioButtonComponent,
    UiKaasInputSelectComponent,
    UiKaasSliderComponent,
    DurationPipe,
    UiChargeComponent
  ],
  exports: [
    Page404Component,
    Change_of_anguageComponent,
    MatButtonModule, 
    MatMenuModule,
    UiKaasButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    CdkDrag,
    CdkDragHandle,
    DragulaModule,
    ModalComponent,
    UiKaasInputComponent,
    UiKaasHeadingComponent,
    UiKaasHintComponent,
    MatDatepickerModule,
    MatRadioModule,
    CalendareComponent,
    RadioButtonComponent,
    FormsModule,
    UiKaasInputSelectComponent,
    MatSliderModule,
    UiKaasSliderComponent,
    MatTableModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    DurationPipe,
    UiChargeComponent,
    MatProgressSpinnerModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Define tus propios formatos de fecha
    { provide: DateAdapter, useClass: NativeDateAdapter }
  ],
})
export class Shared_moduleModule { }
