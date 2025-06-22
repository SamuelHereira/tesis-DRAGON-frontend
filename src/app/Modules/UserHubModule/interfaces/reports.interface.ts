import { RevisionProfesor } from './reviewer.interface';

export interface ReporteRevisionEstudiante {
  id_juego: string;
  id_profesor: string;
  fecha_creacion: Date;
  fecha_finalizacion: Date;
  estado: string;
  juego_publico: null;
  id_tipo_juego: string;
  num_requerimientos_aleatorios: null;
  aciertos: null;
  errores: null;
  requerimientos: Requerimiento[];
}

export interface Requerimiento {
  id_requerimiento: string;
  titulo: string;
  tipo_requerimiento: string;
  retroalimentacion: string;
  revisiones: Revision[];
}

export interface Revision {
  revisor: string;
  retroalimentacion: string;
  titulo: string;
  tipo: string;
  no_feedback: string;
  fecha_revision: Date;
  revisiones_profesores: RevisionProfesor[];
}

export interface ReporteStatus<T> {
  viewPdf: boolean;
  juegosSeleccionados: T[];
  displayedColumns: string[];
  displayedColumns2?: string[];
  chartsData: any[];
}
