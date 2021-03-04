import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiloService } from '../silo.service';
import { Silo } from '../../../alimentar/alimentar';

@Component({
  selector: 'app-silo-popup',
  templateUrl: './silo-popup.component.html',
  styleUrls: ['./silo-popup.component.scss']
})
export class SiloPopupComponent implements OnInit, OnDestroy {

  @Input() modal: any;
  @Input() editSilo: Silo;
  @Output() aceptar = new EventEmitter<any>();


  siloForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public siloServ: SiloService, public modalService: NgbModal) {

    this.siloForm = new FormGroup({
      nombre: new FormControl(),
      capacidad: new FormControl(),
      saldo: new FormControl(),
      pelletKilo: new FormControl(),
      medicado: new FormControl(),
      alimento: new FormControl()
    });

   }

  ngOnDestroy(): void {
    this.editSilo = undefined;
  }

  ngOnInit(): void {
    this.siloForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      medicado: [''],
      alimento: ['', [Validators.required, Validators.maxLength(30)]],
      capacidad: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(2)]],
      saldo: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(5)]],
      pelletKilo: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(7)]],
    });

    if (this.editSilo) {    
      
      this.siloForm.controls['nombre'].setValue(this.editSilo.NOMBRE);
      this.siloForm.controls['medicado'].setValue(this.editSilo.MEDICADO);
      this.siloForm.controls['alimento'].setValue(this.editSilo.ALIMENTO);
      this.siloForm.controls['capacidad'].setValue(this.editSilo.CAPACIDAD);
      this.siloForm.controls['saldo'].setValue(this.editSilo.SALDO);
      this.siloForm.controls['pelletKilo'].setValue(this.editSilo.PELLETKILO);

    } 

  }


  save(){
    let silo = {
      nombre: this.siloForm.value.nombre,
      medicado: this.siloForm.value.medicado ? this.siloForm.value.medicado : false,
      alimento: this.siloForm.value.alimento,
      capacidad: this.siloForm.value.capacidad * 1000,
      saldo: this.siloForm.value.saldo * 1000,
      pelletKilo: this.siloForm.value.pelletKilo,
    }

    this.siloServ.addSilo(silo).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(silo);
    })
    
  }

  update(){
    let silo = {
      id: this.editSilo.ID,
      nombre: this.siloForm.value.nombre,
      medicado: this.siloForm.value.medicado ? this.siloForm.value.medicado : false,
      alimento: this.siloForm.value.alimento,
      capacidad: this.siloForm.value.capacidad * 1000,
      saldo: this.siloForm.value.saldo * 1000,
      pelletKilo: this.siloForm.value.pelletKilo,
    }

    this.siloServ.updateSilo(silo.id, silo).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(silo);
    })
  }

}
