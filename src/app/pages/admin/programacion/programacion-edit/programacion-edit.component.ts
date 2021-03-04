import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Programacion } from '../../../alimentar/alimentar';
import { ProgramacionService } from '../programacion.service';

@Component({
  selector: 'app-programacion-edit',
  templateUrl: './programacion-edit.component.html',
  styleUrls: ['./programacion-edit.component.scss']
})
export class ProgramacionEditComponent implements OnInit {

  @Input() modal: any;
  @Input() editProgramacion: Programacion;
  @Output() aceptar = new EventEmitter<any>();


  programacionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public prograService: ProgramacionService, public modalService: NgbModal) {

    this.programacionForm = new FormGroup({
      nombre: new FormControl(),
      horas: new FormControl(),
      visitas: new FormControl(),
      kilos: new FormControl()
    });

   }

  ngOnDestroy(): void {
    this.editProgramacion = undefined;
  }

  ngOnInit(): void {
    this.programacionForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      horas: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(2)]],
      visitas: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      kilos: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(7)]],
    });

    if (this.editProgramacion) {    
      
      this.programacionForm.controls['nombre'].setValue(this.editProgramacion.NOMBRE);
      this.programacionForm.controls['horas'].setValue(this.editProgramacion.HORAS);
      this.programacionForm.controls['visitas'].setValue(this.editProgramacion.VISITAS);
      this.programacionForm.controls['kilos'].setValue(this.editProgramacion.KILOS);

    } 

  }


  save(){
    let programacion = {
      nombre: this.programacionForm.value.nombre,
      horas: this.programacionForm.value.horas,
      visitas: this.programacionForm.value.visitas,
      kilos: this.programacionForm.value.kilos,
    }

    this.prograService.addProgramacion(programacion).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(programacion);
    })
    
  }

  update(){
    let programacion = {
      id: this.editProgramacion.ID,
      nombre: this.programacionForm.value.nombre,
      horas: this.programacionForm.value.horas,
      visitas: this.programacionForm.value.visitas,
      kilos: this.programacionForm.value.kilos,
    }

    this.prograService.updateProgramacion(programacion.id, programacion).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(programacion);
    })
  }

}
