import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TypeButton } from './button';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() text: string;

  @Input() typeButton: string;

  @Input() icon: string;

  @Input() disable: boolean;

  @Input() tooltipDisable: string;

  @Input() tooltip: string;

  @Input() outline: boolean;

  @Output() clickButton = new EventEmitter<any>();

  disableButton: boolean;
  tooltipButton: string;
  type = TypeButton;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.disable ||
      changes.tooltipDisable ||
      changes.tooltip
    ) {
      if (this.disable) {
        console.log("is disabled");
        
        this.disableButton = true;
        this.tooltipButton = this.tooltipDisable;
      } else {
        this.disableButton = false;
        this.tooltipButton = this.tooltip;
      }      
    }
  }


  ngOnInit(): void {
  }

  click(event) {
    if (event && event.clientX !== 0 && event.clientY !== 0 && !this.disable) {
      this.clickButton.emit(event);
    }
  }

}
