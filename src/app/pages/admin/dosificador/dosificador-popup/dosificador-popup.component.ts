import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dosificador } from '../../../alimentar/alimentar';
import { DosificadorService } from '../dosificador.service';

@Component({
  selector: 'app-dosificador-popup',
  templateUrl: './dosificador-popup.component.html',
  styleUrls: ['./dosificador-popup.component.scss']
})
export class DosificadorPopupComponent implements OnInit {

  @Input() modal: any;
  @Input() editObject: Dosificador;
  @Output() aceptar = new EventEmitter<any>();


  doserForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public doserServ: DosificadorService, public modalService: NgbModal) {

    this.doserForm = new FormGroup({
      modelo: new FormControl(),
      tasamax: new FormControl(),
      idSilo: new FormControl(),
      idLinea: new FormControl()
    });

   }

  ngOnDestroy(): void {
    this.editObject = undefined;
  }

  ngOnInit(): void {
    this.doserForm = this.formBuilder.group({
      modelo: ['', [Validators.required, Validators.maxLength(30)]],
      tasamax: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(5)]],
      idSilo: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      idLinea: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
    });

    if (this.editObject) {    
      
      this.doserForm.controls['modelo'].setValue(this.editObject.MODELOREDUCTOR);
      this.doserForm.controls['tasamax'].setValue(this.editObject.TASAMAX);
      this.doserForm.controls['idSilo'].setValue(this.editObject.IDSILO);
      this.doserForm.controls['idLinea'].setValue(this.editObject.IDLINEA);

    } 

  }


  save(){
    let doser = {
      modelo: this.doserForm.value.modelo,
      tasamax: this.doserForm.value.tasamax,
      idSilo: this.doserForm.value.idSilo,
      idLinea: this.doserForm.value.idLinea
    }

    this.doserServ.addDosificador(doser).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(doser);
    })
    
  }

  update(){
    let doser = {
      id: this.editObject.ID,
      modelo: this.doserForm.value.modelo,
      tasamax: this.doserForm.value.tasamax,
      idSilo: this.doserForm.value.idSilo,
      idLinea: this.doserForm.value.idLinea
    }

    this.doserServ.updateDosificador(doser.id, doser).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(doser);
    })
  }

}
