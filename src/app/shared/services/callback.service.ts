import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CallBackService {
  private callBack = new Subject<any>();

  callBackObs = this.callBack.asObservable();

  callBackFunc(event: CallBack) {
    this.callBack.next(event);
  }
}

export interface CallBack {
  functionCallBack: string;
  data: any;
  extraData?: any;
}
