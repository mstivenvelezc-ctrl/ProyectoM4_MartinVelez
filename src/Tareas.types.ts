    // src/tareas.types.ts — tipos compartidos de tareas
    
    export type EstadoTarea = "normal" | "prioridad" | "perdida" | "completada";
    
    export interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    fechaHora: Date;
    fechaEntrega?: Date;
    estado: EstadoTarea;
    completada: boolean;
    }
    