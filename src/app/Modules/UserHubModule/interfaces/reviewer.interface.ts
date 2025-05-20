import { Nivel } from '../View/Model/requerimientos.model';

export interface JuegoRevisor {
  id_revision_revisor_juego: string;
  id_revisor_juego: string;
  id_juego: string;
  fecha_creacion: string;
  fecha_finalizacion: string;
  id_profesor: string;
  profesor: string;
  total_revision: string;
  json: string;
  total_requerimientos: number;
}

export interface JuegoRevisorDecoded {
  id_revision_revisor_juego: string;
  id_revisor_juego: string;
  id_juego: string;
  fecha_creacion: string;
  fecha_finalizacion: string;
  id_profesor: string;
  profesor: string;
  total_revision: string;
  json: Nivel;
  total_requerimientos: number;
  revisiones: Revision[];
}

export interface Revision {
  titulo: string;
  retroalimentacion: string;
  tipo: string;
  fecha_revision: Date;
  id_requerimiento: number;
  id_revisor_juego: number;
  id_revision_revisor_juego: number;
}

export interface RevisionRevisorResponse {
  id_revision_revisor_juego: string;
  id_revisor_juego: string;
  id_requerimiento: string;
  titulo: string;
  retroalimentacion: string;
  tipo: string;
  fecha_revision: Date;
  no_feedback: string;
  estudiante: string;
}
