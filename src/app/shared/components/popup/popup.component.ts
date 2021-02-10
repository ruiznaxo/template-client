import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {


  @Input() showPopup: boolean;

  @Input() title: string;

  @Input() btnSaveText = 'General.Save';
  @Input() btnCancelText = 'Btn.Cancel';

  @Input() showCancelSaveBtn = false;
  @Input() showOnlyCancelBtn = false;
  @Input() showOnlySaveBtn = false;

  @Input() disableSaveBtn = false;
  @Input() isClosePopupAfterSave = true;

  @Output() clickSaveBtnPopup: EventEmitter<any> = new EventEmitter();
  @Output() clickCancelBtnPopup: EventEmitter<any> = new EventEmitter();


  constructor() { }




  ngOnChanges(changes: SimpleChanges): void {

  }
  

  ngOnInit(): void {
  }

}
