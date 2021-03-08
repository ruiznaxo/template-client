import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Linea } from 'src/app/pages/alimentar/alimentar';
import { LineaService } from '../linea.service';
import { Programacion } from '../../../alimentar/alimentar';
import { AlimentarService } from '../../../alimentar/alimentar.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-linea-popup',
  templateUrl: './linea-popup.component.html',
  styleUrls: ['./linea-popup.component.scss']
})
export class LineaPopupComponent implements OnInit, OnDestroy {

  @Input() modal: any;
  @Input() editObject: Linea;
  @Output() aceptar = new EventEmitter<any>();


  lineaForm: FormGroup;
  programaciones: Programacion[];

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();

  constructor(private formBuilder: FormBuilder, public lineaServ: LineaService, public modalService: NgbModal, public alimentarService: AlimentarService) {

    this.lineaForm = new FormGroup({
      nombre: new FormControl(),
      idProgramacion: new FormControl()
    });

  }

  ngOnDestroy(): void {
    this.editObject = undefined;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.lineaForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      idProgramacion: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
    });

    this.loadData();

    if (this.editObject) {

      this.lineaForm.controls['nombre'].setValue(this.editObject.NOMBRE);
      this.lineaForm.controls['idProgramacion'].setValue(this.editObject.IDPROGRAMACION);

    }

  }

  loadData() {

    console.log("In LoadData");
    

    let listaPeticionesHttp = [
      this.alimentarService.getProgramaciones()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([programaciones]) => {
        this.programaciones = programaciones;
      });
  }


  save() {
    let linea = {
      nombre: this.lineaForm.value.nombre,
      idProgramacion: this.lineaForm.value.idProgramacion
    }

    this.lineaServ.addLinea(linea).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(linea);
    })

  }

  update() {
    let linea = {
      id: this.editObject.ID,
      nombre: this.lineaForm.value.nombre,
      idProgramacion: this.lineaForm.value.idProgramacion
    }

    this.lineaServ.updateLinea(linea.id, linea).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(linea);
    })
  }

}
