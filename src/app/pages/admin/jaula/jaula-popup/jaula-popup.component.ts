import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Jaula, Linea, Selectora, Dosificador, Silo } from '../../../alimentar/alimentar';
import { JaulaService } from '../jaula.service';

@Component({
  selector: 'app-jaula-popup',
  templateUrl: './jaula-popup.component.html',
  styleUrls: ['./jaula-popup.component.scss']
})
export class JaulaPopupComponent implements OnInit {

  @Input() modal: any;
  @Input() editObject: Jaula;
  @Input() lineas: Linea[];
  @Input() selectoras: Selectora[];
  @Input() dosificadores: Dosificador[];
  @Input() silos: Silo[];

  @Output() aceptar = new EventEmitter<any>();


  jaulaForm: FormGroup;
  selectoraDropdown: any[];
  silosDropdown: any[];



  constructor(private formBuilder: FormBuilder, public jaulaService: JaulaService, public modalService: NgbModal) {

    this.jaulaForm = new FormGroup({
      nombre: new FormControl(),
      idLinea: new FormControl(),
      pesoPromedio: new FormControl(),
      cantidadPeces: new FormControl(),
      idSelectora: new FormControl(),
      posicionSelectora: new FormControl(),
      idSilo: new FormControl(),
    });

  }

  ngOnDestroy(): void {
    this.editObject = undefined;
  }

  ngOnInit(): void {
    this.jaulaForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      idLinea: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      pesoPromedio: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      cantidadPeces: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      idSilo: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      idSelectora: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
      posicionSelectora: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
    });

    if (this.editObject) {

      this.jaulaForm.controls['nombre'].setValue(this.editObject.NOMBRE);
      this.jaulaForm.controls['idLinea'].setValue(this.editObject.IDLINEA);
      this.jaulaForm.controls['pesoPromedio'].setValue(this.editObject.PESOPROMEDIO);
      this.jaulaForm.controls['cantidadPeces'].setValue(this.editObject.CANTIDADPECES);
      this.jaulaForm.controls['idSelectora'].setValue(this.editObject.IDSELECTORA);
      this.jaulaForm.controls['posicionSelectora'].setValue(this.editObject.POSICIONSELECTORA);

      
      let dosers = this.dosificadores.filter(doser => doser?.IDLINEA === this.editObject.IDLINEA).map(a => a.ID);
      this.silosDropdown = this.silos.filter((({ ID }) => dosers.includes(ID)));

      let siloID = this.silos.find(d => d.ID == this.dosificadores.find(d => d.ID == this.editObject.IDDOSIFICADOR).IDSILO).ID
      

      //verificar
      this.jaulaForm.controls['idSilo'].setValue(siloID);

    }

    this.onChanges();

  }

  onChanges(): void {
    this.jaulaForm.get('idLinea').valueChanges.subscribe(val => {

      //clear selectores
      this.jaulaForm.controls['idSilo'].setValue(undefined);
      this.jaulaForm.controls['idSelectora'].setValue(undefined);
      this.jaulaForm.controls['posicionSelectora'].setValue(undefined);

      //buscar la selectora de la linea seleccionada
      let selectora = this.selectoras.find(s => s.IDLINEA === val)
      //set id selectora para jaula
      this.jaulaForm.controls['idSelectora'].setValue(selectora?.ID);
      //Set cantidad de salidas para el selector
      this.selectoraDropdown = Array.from({ length: selectora?.SALIDAS }, (_, i) => i + 1)

      let dosers = this.dosificadores.filter(doser => doser?.IDLINEA === val).map(a => a.ID);
      this.silosDropdown = this.silos.filter((({ ID }) => dosers.includes(ID)));
      
      console.log(this.findInvalidControls());

    });
  }

  save() {
    let idDoser = this.dosificadores.find(d => d.IDSILO == this.jaulaForm.value.idSilo).ID

    let jaula = {
      nombre: this.jaulaForm.value.nombre,
      idLinea: this.jaulaForm.value.idLinea,
      pesoPromedio: this.jaulaForm.value.pesoPromedio,
      cantidadPeces: this.jaulaForm.value.cantidadPeces,
      idDosificador: idDoser,
      idSelectora: this.jaulaForm.value.idSelectora,
      posicionSelectora: this.jaulaForm.value.idSelectora,
    }

    console.log(jaula);

    this.jaulaService.addJaula(jaula).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(jaula);
    })

  }

  update() {

    let idDoser = this.dosificadores.find(d => d.IDSILO == this.jaulaForm.value.idSilo).ID

    let jaula = {
      id: this.editObject.ID,
      nombre: this.jaulaForm.value.nombre,
      idLinea: this.jaulaForm.value.idLinea,
      pesoPromedio: this.jaulaForm.value.pesoPromedio,
      cantidadPeces: this.jaulaForm.value.cantidadPeces,
      idDosificador: idDoser,
      idSelectora: this.jaulaForm.value.idSelectora,
      posicionSelectora: this.jaulaForm.value.idSelectora,
    }


    this.jaulaService.updateJaula(jaula.id, jaula).subscribe(() => {
      this.modalService.dismissAll();
      this.aceptar.emit(jaula);
    })
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.jaulaForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

}
