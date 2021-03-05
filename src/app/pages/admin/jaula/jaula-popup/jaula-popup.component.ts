import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Jaula } from '../../../alimentar/alimentar';
import { JaulaService } from '../jaula.service';

@Component({
  selector: 'app-jaula-popup',
  templateUrl: './jaula-popup.component.html',
  styleUrls: ['./jaula-popup.component.scss']
})
export class JaulaPopupComponent implements OnInit {

  @Input() modal: any;
  @Input() editObject: Jaula;
  @Output() aceptar = new EventEmitter<any>();


  jaulaForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public jaulaService: JaulaService, public modalService: NgbModal) {

    this.jaulaForm = new FormGroup({
      nombre: new FormControl(),
      idProgramacion: new FormControl(),
      idLinea: new FormControl(),
      pesoPromedio: new FormControl(),
      cantidadPeces: new FormControl(),
      idDosificador: new FormControl(),
      idSelectora: new FormControl(),
    });

  }

  ngOnDestroy(): void {
    this.editObject = undefined;
  }

  ngOnInit(): void {
    this.jaulaForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      idProgramacion: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(5)]],
      idLinea: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      pesoPromedio: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      cantidadPeces: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      idDosificador: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      idSelectora: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
    });

    if (this.editObject) {

      this.jaulaForm.controls['nombre'].setValue(this.editObject.NOMBRE);
      this.jaulaForm.controls['idProgramacion'].setValue(this.editObject.IDPROGRAMACION);
      this.jaulaForm.controls['idLinea'].setValue(this.editObject.IDLINEA);
      this.jaulaForm.controls['pesoPromedio'].setValue(this.editObject.PESOPROMEDIO);
      this.jaulaForm.controls['cantidadPeces'].setValue(this.editObject.CANTIDADPECES);
      this.jaulaForm.controls['idDosificador'].setValue(this.editObject.IDDOSIFICADOR);
      this.jaulaForm.controls['idSelectora'].setValue(this.editObject.IDSELECTORA);

    }

  }


  save() {
    let jaula = {
      nombre: this.jaulaForm.value.nombre,
      idProgramacion: this.jaulaForm.value.idProgramacion,
      idLinea: this.jaulaForm.value.idLinea,
      pesoPromedio: this.jaulaForm.value.pesoPromedio,
      cantidadPeces: this.jaulaForm.value.cantidadPeces,
      idDosificador: this.jaulaForm.value.idDosificador,
      idSelectora: this.jaulaForm.value.idSelectora,
    }

    this.jaulaService.addJaula(jaula).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(jaula);
    })

  }

  update() {
    let jaula = {
      id: this.editObject.ID,
      nombre: this.jaulaForm.value.nombre,
      idProgramacion: this.jaulaForm.value.idProgramacion,
      idLinea: this.jaulaForm.value.idLinea,
      pesoPromedio: this.jaulaForm.value.pesoPromedio,
      cantidadPeces: this.jaulaForm.value.cantidadPeces,
      idDosificador: this.jaulaForm.value.idDosificador,
      idSelectora: this.jaulaForm.value.idSelectora,
    }


    this.jaulaService.updateJaula(jaula.id, jaula).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(jaula);
    })
  }

}
