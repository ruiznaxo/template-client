import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiloService } from '../silo.service';

@Component({
  selector: 'app-silo-popup',
  templateUrl: './silo-popup.component.html',
  styleUrls: ['./silo-popup.component.scss']
})
export class SiloPopupComponent implements OnInit {

  @Input() modal: any;

  programacionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public siloServ: SiloService, public modalService: NgbModal) {

    this.programacionForm = new FormGroup({
      nombre: new FormControl(),
      capacidad: new FormControl(),
      saldo: new FormControl(),
      pelletKilo: new FormControl(),
      medicado: new FormControl(),
      alimento: new FormControl()
    });

   }

  ngOnInit(): void {
    this.programacionForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      medicado: [''],
      alimento: ['', [Validators.required, Validators.maxLength(30)]],
      capacidad: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(2)]],
      saldo: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(5)]],
      pelletKilo: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(7)]],
    });

  }

  save(){
    let silo = {
      nombre: this.programacionForm.value.nombre,
      medicado: this.programacionForm.value.medicado ? this.programacionForm.value.medicado : false,
      alimento: this.programacionForm.value.alimento,
      capacidad: this.programacionForm.value.capacidad,
      saldo: this.programacionForm.value.saldo,
      pelletKilo: this.programacionForm.value.pelletKilo,
    }

    console.log(silo);

    this.siloServ.addSilo(silo)
    // .subscribe(() => {
    //   this.modalService.dismissAll();
    // })
    
  }

}
