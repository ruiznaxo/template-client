import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-programacion-edit',
  templateUrl: './programacion-edit.component.html',
  styleUrls: ['./programacion-edit.component.scss']
})
export class ProgramacionEditComponent implements OnInit {

  programacionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public modalService: NgbModal) {

    this.programacionForm = new FormGroup({
      nombre: new FormControl(),
      horas: new FormControl(),
      visitas: new FormControl(),
      kilos: new FormControl()
    });

   }

  ngOnInit(): void {
    this.programacionForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      horas: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(2)]],
      visitas: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(5)]],
      kilos: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(7)]],
    });
  }

  openPopup(content){
    this.modalService.open(content)
  }

}
