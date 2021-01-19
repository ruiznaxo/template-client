
export interface Jaula {

    id?: number;
    nombre?: string;
    pesoPromedio?: number;
    cantidadPeces?: number;
    posicionSelectora?: number;
    prioridad?: number;
    tasa?: number;
    factorActividad?: number;
    tipoTasa?: number;
    tiempoSoplado?: number;
    hzSoplador?: number;
    habilitada?: number;
    idDocificador?: number;
    idProgramacion?: number;
    idSelectora?: number;
    idLinea?: number;
    tiempoEspera?: number;
    monorracion?: number;
    estado?: number; // 0 = activada, 1 alimentando, 2 pausa, 3 alarma, 4 desactivada
    claseEstado?: string;
}

