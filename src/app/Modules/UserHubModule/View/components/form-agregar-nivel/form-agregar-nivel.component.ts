import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Nivel, Requerimiento } from '../../Model/requerimientos.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import {
  GeminiRequest,
  GeminiService,
  RequerimientoIA,
} from '../../../Service/gemini.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ImportService, ResponseExcel } from '../../../Service/import.service';
import { environment } from 'src/environments/environment';

type CreationMode = 'manual' | 'load' | 'ia' | 'import-excel';
@Component({
  selector: 'app-form-agregar-nivel',
  templateUrl: './form-agregar-nivel.component.html',
  styleUrls: ['./form-agregar-nivel.component.scss'],
})
export class FormAgregarNivelComponent implements OnInit {
  @Input() indice!: number;
  @Input() nivel!: Nivel;
  @Input() requerimientosCargados: any[] = [];
  @Input() tipo: string = 'tipo-juego.juego-1-title';

  @Output() _guardarRequerimiento = new EventEmitter();
  @Output() _eliminarRequerimiento = new EventEmitter();
  @Output() _finalizarRequerimiento = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  agregarRequerimiento = true;
  verificarFinalizar = false;
  verificarRequerimientos = false;
  verRequerimientosCargados = false;
  verActualizar = false;
  id_Actualizar = '';

  expandible = true;
  mostrarExpandible = false;
  modoCreacion: CreationMode = 'manual';
  requrimientoCargado = 'no';

  requrimientoData!: Requerimiento;
  requerimientoDataCopy!: Requerimiento;
  dataSource!: MatTableDataSource<any>;
  cdr!: ChangeDetectorRef;

  // ia
  tema: string = '';
  cargandoIA: boolean = false;

  // excel
  excelFile: File | null = null;
  importandoExcel: boolean = false;

  constructor(
    private _translateService: TranslateService,
    cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _geminiService: GeminiService,
    private _importService: ImportService
  ) {
    this.dataSource = new MatTableDataSource();
    this.cdr = cdr;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdr.detectChanges();

    if (changes['requerimientosCargados'] && this.requerimientosCargados) {
      this.dataSource.data = this.requerimientosCargados;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    if (changes['tipo']) {
      switch (this.tipo) {
        case 'tipo-juego.juego-1-title':
          this.options_Requerimientos = [
            { name: 'tipo-juego.juego-1-subtitle-ambiguo', code: 'NFA' },
            { name: 'tipo-juego.juego-1-subtitle-noAmbiguo', code: 'NFN' },
          ];
          this.requrimientoData.opcionRequerimiento = 'NFA';
          this.requerimientoDataCopy.opcionRequerimiento = 'NFA';
          break;
        case 'tipo-juego.juego-2-title':
          this.options_Requerimientos = [
            { name: 'tipo-juego.juego-2-subtitle-ambiguo', code: 'RF' },
            { name: 'tipo-juego.juego-2-subtitle-noAmbiguo', code: 'RNF' },
          ];
          this.requrimientoData.opcionRequerimiento = 'RF';
          this.requerimientoDataCopy.opcionRequerimiento = 'RF';
          break;
        case 'tipo-juego.juego-3-title':
          this.options_Requerimientos = [
            { name: 'tipo-juego.juego-3-subtitle-ambiguo', code: 'FA' },
            { name: 'tipo-juego.juego-3-subtitle-noAmbiguo', code: 'FN' },
          ];
          this.requrimientoData.opcionRequerimiento = 'FA';
          this.requerimientoDataCopy.opcionRequerimiento = 'FA';
          break;
      }
      this.requrimientoCargado = 'no';
      this.valorAntiguoOpcion = 'no';
      this.requrimientoData.requerimiento = '';
      this.requrimientoData.retroalimentacion = '';
      this.reqTemp = '';
      this.requrimientoData.requerimientoBase = 'No';
    }
  }

  options_game: any[] = [];

  options_Requerimientos: any[] = [
    { name: 'tipo-juego.juego-1-subtitle-ambiguo', code: 'NFA' },
    { name: 'tipo-juego.juego-1-subtitle-noAmbiguo', code: 'NFN' },
  ];

  displayedColumns: string[] = [
    'position',
    'req',
    'typeReq',
    'ReqPlus',
    'pts',
    'base',
    'acctions',
  ];

  requisitosCargadosColumnas: string[] = [
    'position',
    'req',
    'typeReq',
    'ReqPlus',
    'acctions',
  ];

  // requerimientosCargados : any[] = [
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola2", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola2", retroalimentacion: "Hola3", opcionRequerimiento: "NFN"},
  //   {id: 1, requerimiento: "Hola3", retroalimentacion: "Hola4", opcionRequerimiento: "NFN"},
  //   {id: 1, requerimiento: "Hola4", retroalimentacion: "Hola6", opcionRequerimiento: "NFN"},
  //   {id: 1, requerimiento: "Hola5", retroalimentacion: "Hola5", opcionRequerimiento: "NFN"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFN"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"},
  //   {id: 1, requerimiento: "Hola", retroalimentacion: "Hola", opcionRequerimiento: "NFA"}
  // ]

  ngOnInit() {
    this.requrimientoData = this.llenarDatoRequerimiento();
    this.requerimientoDataCopy = { ...this.requrimientoData };
    this.options_game = [
      { label: 'general.boton-si', value: 'si' },
      { label: 'general.boton-no', value: 'no' },
    ];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  llenarDatoRequerimiento(): Requerimiento {
    const id_req = this.indice + 'req' + (this.nivel.requerimientos.length + 1);
    const data: Requerimiento = {
      requerimiento: '',
      retroalimentacion: '',
      opcionRequerimiento: this.options_Requerimientos?.[0]?.code,
      puntosAdicionales: 100,
      id: id_req,
      requerimientoFallido: false,
      requerimientoCompleto: 'No',
      requerimientoBase: 'No',
    };
    return data;
  }

  cancelarRegistro() {
    this.agregarRequerimiento = false;
    this.requrimientoData = this.llenarDatoRequerimiento();
  }
  validarGuardarRequerimiento(): boolean {
    return this.requrimientoData.requerimiento == '' ? true : false;
  }

  guardarRequerimiento() {
    this.agregarRequerimiento = false;
    const requerimientoTemp = { ...this.requrimientoData };
    this.requrimientoData = this.llenarDatoRequerimiento();
    this._guardarRequerimiento.emit(requerimientoTemp);
  }

  eliminarRequerimiento(indice: number) {
    this._eliminarRequerimiento.emit(indice);
  }

  editarRequerimiento(indice: number) {}

  _agregarRequerimiento() {
    this.agregarRequerimiento = true;
    this.requrimientoData = this.llenarDatoRequerimiento();
    this.requerimientoDataCopy = { ...this.requrimientoData };
    this.requrimientoCargado = 'no';
    this.valorAntiguoOpcion = 'no';
  }

  finalizarNivel() {
    this.verificarFinalizar = false;
    this.expandible = false;
    this.mostrarExpandible = true;
    this._finalizarRequerimiento.emit();
  }

  verificarDosRequisitos() {
    const requerimientoTemp = this.nivel.requerimientos[0].opcionRequerimiento;
    const RequerimientosTemp = this.nivel.requerimientos.filter(
      (_) => _.opcionRequerimiento != requerimientoTemp
    );
    if (RequerimientosTemp.length == 0) {
      this.verificarRequerimientos = true;
    } else {
      this.verificarFinalizar = true;
    }
  }

  valorAntiguoOpcion: string = 'no';
  onChangeRequerimientos(event: any) {
    if (this.valorAntiguoOpcion != event) {
      if (event == 'si') {
        this.requerimientoDataCopy = { ...this.requrimientoData };
        this.requrimientoData.opcionRequerimiento = '';
        this.requrimientoData.requerimiento = '';
        this.requrimientoData.retroalimentacion = '';
        this.reqTemp = '';
        this.requrimientoData.requerimientoBase = 'Sí';
      } else {
        this.requrimientoData = { ...this.requerimientoDataCopy };
        this.requrimientoData.requerimientoBase = 'No';
      }
      this.valorAntiguoOpcion = event;
    }
  }

  reqTemp = '';
  seleccionarRequerimientoCargado(index: number) {
    this.requrimientoData.requerimiento =
      this.requerimientosCargados[index].requerimiento;
    this.requrimientoData.retroalimentacion =
      this.requerimientosCargados[index].retroalimentacion;
    this.requrimientoData.opcionRequerimiento =
      this.requerimientosCargados[index].opcionRequerimiento;
    this.reqTemp = this._translateService.instant(
      this.options_Requerimientos.find(
        (item) => item.code == this.requrimientoData.opcionRequerimiento
      ).name
    );
    this.salirEscogerRequerimiento();
  }

  salirEscogerRequerimiento() {
    this.verRequerimientosCargados = false;
  }

  abrirModalRequerimientosCargados() {
    this.verRequerimientosCargados = true;
    this.dataSource.data = this.requerimientosCargados;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abirModalActualiza(index: number) {
    this.verActualizar = true;
    this.id_Actualizar = this.nivel.requerimientos[index].id;
    this.requrimientoData.requerimiento =
      this.nivel.requerimientos[index].requerimiento;
    this.requrimientoData.retroalimentacion =
      this.nivel.requerimientos[index].retroalimentacion;
    this.requrimientoData.opcionRequerimiento =
      this.nivel.requerimientos[index].opcionRequerimiento;
    this.requrimientoData.puntosAdicionales =
      this.nivel.requerimientos[index].puntosAdicionales;
  }

  cerrarModalActualiza() {
    this.verActualizar = false;
    this.id_Actualizar = '';
  }

  actualizarRegisto() {
    const index = this.nivel.requerimientos.findIndex(
      (data) => data.id == this.id_Actualizar
    );
    this.nivel.requerimientos[index].id = this.id_Actualizar;
    this.nivel.requerimientos[index].requerimiento =
      this.requrimientoData.requerimiento;
    this.nivel.requerimientos[index].retroalimentacion =
      this.requrimientoData.retroalimentacion;
    this.nivel.requerimientos[index].opcionRequerimiento =
      this.requrimientoData.opcionRequerimiento;
    this.nivel.requerimientos[index].puntosAdicionales =
      this.requrimientoData.puntosAdicionales;
    this.cerrarModalActualiza();
  }

  cambiarText(value: string): string {
    return this._translateService.instant(value);
  }

  openSnackBar(message: string, class_customer: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = [class_customer];
    this._snackBar.open(message, '', config);
  }

  changeModoCreacion(value: CreationMode) {
    this.modoCreacion = value;
  }

  generarPorIA() {
    if (!this.tema || !this.tipo) return;
    this.cargandoIA = true;

    let tipoJuegoNumber = 0;
    if (this.tipo == 'tipo-juego.juego-1-title') tipoJuegoNumber = 1;
    if (this.tipo == 'tipo-juego.juego-2-title') tipoJuegoNumber = 2;
    if (this.tipo == 'tipo-juego.juego-3-title') tipoJuegoNumber = 3;

    const data: GeminiRequest = {
      topic: this.tema,
      gameMode: tipoJuegoNumber,
    };

    this._geminiService.generarRequerimientosPorIA(data).subscribe({
      next: (res: RequerimientoIA[]) => {
        // const nivel = this.datosJuego.niveles[0];

        const actualLength = this.nivel.requerimientos.length;

        const nivelesGenerados = res.map((req, idx) => ({
          id: (actualLength + idx + 1).toString(),
          requerimiento: req.title,
          retroalimentacion: req.feedback,
          opcionRequerimiento: req.type_code,
          requerimientoBase: 'No',
          requerimientoCompleto: '',
          requerimientoFallido: false,
          puntosAdicionales: 100,
        }));

        this.nivel.requerimientos = [
          ...this.nivel.requerimientos,
          ...nivelesGenerados,
        ];
        this.cargandoIA = false;

        this.openSnackBar(
          this._translateService.instant(
            'user-hub-module.crear-juego.componente-form.generar-ia-success'
          ),
          'custom-snackbar_exitoso'
        );
        this.agregarRequerimiento = false;
      },
      error: (err) => {
        this.openSnackBar(
          this._translateService.instant(
            'user-hub-module.crear-juego.componente-form.generar-ia-error'
          ),
          'custom-snackbar_fallido'
        );
        this.cargandoIA = false;
      },
      complete: () => {
        this.tema = '';
        this.cargandoIA = false;
      },
    });
  }

  get labelGenerarIA(): string {
    return this.cargandoIA
      ? this._translateService.instant(
          'user-hub-module.crear-juego.componente-form.generar-ia-button-loading'
        )
      : this._translateService.instant(
          'user-hub-module.crear-juego.componente-form.generar-ia-button'
        );
  }

  get labelImportarExcel(): string {
    return this.importandoExcel
      ? this._translateService.instant(
          'user-hub-module.crear-juego.componente-form.import-excel-loading'
        )
      : this._translateService.instant(
          'user-hub-module.crear-juego.componente-form.import-excel-button'
        );
  }

  guardarArchivoExcel(event: any) {
    const archivo = event.target.files[0];
    this.excelFile = archivo ?? null;
  }

  importarExcel() {
    if (!this.excelFile) return;

    this._importService.importarDesdeExcel(this.excelFile).subscribe({
      next: (res: ResponseExcel) => {
        if (res.code != '200') {
          this.openSnackBar(res.msg, 'custom-snackbar_fallido');
          return;
        }

        const actualLength = this.nivel.requerimientos.length;

        this.nivel.requerimientos = [
          ...this.nivel.requerimientos,
          ...res.result.map((req, idx) => ({
            id: (actualLength + idx + 1).toString(),
            requerimiento: req.title,
            retroalimentacion: req.feedback,
            opcionRequerimiento: req.type_code,
            requerimientoBase: 'No',
            requerimientoCompleto: '',
            requerimientoFallido: false,
            puntosAdicionales: 100,
          })),
        ];
        this.openSnackBar(
          'Requerimientos importados con éxito',
          'custom-snackbar_exitoso'
        );
        this.agregarRequerimiento = false;
      },
      error: () => {
        this.openSnackBar(
          'Error al procesar el archivo Excel',
          'custom-snackbar_fallido'
        );
      },
      complete: () => {
        this.importandoExcel = false;
        this.excelFile = null;
      },
    });
  }

  descargarPlantilla() {
    let tipoJuegoNumber = 0;
    if (this.tipo == 'tipo-juego.juego-1-title') tipoJuegoNumber = 1;
    if (this.tipo == 'tipo-juego.juego-2-title') tipoJuegoNumber = 2;
    if (this.tipo == 'tipo-juego.juego-3-title') tipoJuegoNumber = 3;

    const link = document.createElement('a');
    link.href = `assets/plantillas/tipo${tipoJuegoNumber}_plantilla.xlsx`;
    link.download = `plantilla_tipo${tipoJuegoNumber}.xlsx`;
    link.click();
  }
}
