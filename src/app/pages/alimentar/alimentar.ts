
export interface Jaula {

    ID?: number;
    NOMBRE?: string;
    PESOPROMEDIO?: number;
    CANTIDADPECES?: number;
    POSICIONSELECTORA?: number;
    PRIORIDAD?: number;
    TASA?: number;
    FACTORACTIVIDAD?: number;
    TIPOTASA?: number;
    TIEMPOSOPLADO?: number;
    HZSOPLADOR?: number;
    HABILITADA?: number;
    IDDOSIFICADOR?: number;
    IDPROGRAMACION?: number;
    IDSELECTORA?: number;
    IDLINEA?: number;
    TIEMPOESPERA?: number;
    MONORRACION?: number;
    estado?: number; // 0 = activada, 1 alimentando, 2 pausa, 3 alarma, 4 desactivada
    claseEstado?: string;
}

export interface Linea {  
    
    ID?: number;
    NOMBRE?: string;
    ESTADO?: number;
    PRESION?: number;
    ALARMA?: number;
    HZPAUSA?: number;
    INDICEJAULA?: number;
    MODO?: number;
    POSICIONSELECTOR?: number;
    IDPROGRAMACION?: number;
    IDALARMAPRESION?: number;
    FINALIZADA?: number;

}

export interface Programacion {
    ID?: number;
    NOMBRE?: string;
    HORAS?: number;
    VISITAS?: number;
    USUARIO?: number;
}

export interface Alimentacion {
    
    ID?: number;
    VISITAACTUAL?: number;
    TOTALVISITAS?: number;
    IDJAULA?: number;
    IDLINEA?: number;
    ENTREGADOVISITA?: number;
    OBJETIVOVISITA?: number;
    TOTALENTREGADO?: number;
    OBJETIVOTOTAL?: number;
    HZDOSER?: number;
    VISITASCOMPLETADAS?: number;
    ESTADOALIMENTACION?: string;
    FINALIZADA?: number;

}

export interface Dosificador {
    ID: number;    
    PRIORIDAD: number;   
    MODELOREDUCTOR: string;    
    DIRECCIONMODBUS: number;    
    TASAMAX: number;    
    IDSILO: number;    
    IDLINEA: number;    
    IDALARMA: number;
}

export interface Silo {
    ID: number;
    NOMBRE: string;
    CAPACIDAD: number;
    MEDICADO: number;
    SALDO: number;
    PELLETKILO: number;
    ALIMENTO: string;
}


export interface Alarma {
    ID: number;
    DIRECCIONMODBUS: number;
    IDTIPOALARMA: number;
    ESTADO: number;
    IDLINEA: number;
}


