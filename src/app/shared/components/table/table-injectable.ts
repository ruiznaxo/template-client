
import { Injectable } from '@angular/core';
import { CallBack } from '../../services/callback.service';

@Injectable()
export class TableCallbackInjectable {
  constructor() { }

  callBack(event: CallBack) {    
    if (this[event.functionCallBack]) {
      event.extraData ? this[event.functionCallBack](event.data, event.extraData) :
        event.data ? this[event.functionCallBack](event.data) : this[event.functionCallBack]();
    }
  }
}
