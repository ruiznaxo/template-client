import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Linea, Programacion} from 'src/app/pages/alimentar/alimentar';
import { AlimentarService } from '../../../alimentar/alimentar.service';
import { forkJoin, Subject, Subscription, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProgramacionService } from '../programacion.service';
import {
  CdkDragDrop,
  CDK_DRAG_CONFIG,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import Swal from 'sweetalert2';


const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000
};



@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.scss'],
  host: {
    '[style.display]': '"flex"',
    '[style.flex-direction]': '"column"',
    '[style.overflow]': '"hidden"'
  },
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: DragConfig }]
})


export class AsignacionComponent implements OnInit, OnDestroy {

  @Input() modal: any;
  lineas: Linea[];
  programaciones: Programacion[];
  @Output() asignar = new EventEmitter<any>();

  private eventsSubscription: Subscription;

  @Input() events: Observable<void>;
  
  selectedLineas: Linea[];

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();

  constructor(public modalService: NgbModal, public alimentarService: AlimentarService, public programacionService: ProgramacionService) { }

  ngOnInit(): void {

    this.eventsSubscription = this.events.subscribe(() => this.loadData());
    this.loadData();

  }

  ngOnDestroy(){
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.eventsSubscription.unsubscribe();
  }

  loadData(){
    let listaPeticiones = [
      this.alimentarService.getLineas(),
      this.alimentarService.getProgramaciones()
    ]

    forkJoin(listaPeticiones).pipe(takeUntil(this.unsubscribe)).subscribe(([lineas, programaciones]) => {
      this.lineas = lineas
      this.programaciones = programaciones      
    })
  }

  save(){

    let ids: {idLinea: number, idProgramacion: number}[] = [];

    this.lineas.forEach(linea => {
      ids.push({idLinea: linea.ID, idProgramacion: linea.IDPROGRAMACION})
    });

    this.programacionService.updateProgramacionesEnLineas(ids).subscribe(()=> {
      let timerInterval;
      Swal.fire({
        title: 'Asignando Programaciones',
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,

  
        onBeforeOpen: () => {
          Swal.showLoading();
        },
        onClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (
          result.dismiss === Swal.DismissReason.timer
        ) {
          this.modalService.dismissAll();
          this.asignar.emit();
        } 
      });

    });
    
    
  }

  // ngAfterViewInit(): void {
  //   this.loadData()
  //   this.changeDetectorRef.detectChanges();
  // }
  
  drop(event: CdkDragDrop<any[]>, id: any) {
    let linea = event.previousContainer.data[event.previousIndex]
    let previousID = linea.IDPROGRAMACION
    if (event.previousContainer === event.container) {
      // moveItemInArray(
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
    } else {
      let lineaEncontrada = this.lineas.findIndex(x => x.ID == linea.ID);
      this.lineas[lineaEncontrada].IDPROGRAMACION = id;
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
    }
  }

}
