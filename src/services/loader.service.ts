import { Injectable } from '@angular/core';
import { Loader, NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loaderSubject = new Subject<Loader>();
  loaderState = this.loaderSubject.asObservable();

  constructor(private ngxService: NgxUiLoaderService,) { }

  showLoader() {
    this.ngxService.start();
  }

  hideLoader() {
    this.ngxService.stop();
  }


  startLoader() {
    this.ngxService.start();
  }

  stopLoader() {
    this.ngxService.stop();
  }

}
