import { ViewRecieptsComponent } from './../../Reciepts/view-reciepts/view-reciepts.component';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class FmdcModalService {
  constructor(private ngbModal: NgbModal) {}

  showFeaturedDialog(
    theComponent: any,
    id: number = 0,
    title: string = '',
    uname: string = ''
  ) {
    if (theComponent == ViewRecieptsComponent) {
      const modalRef = this.ngbModal.open(theComponent, {
        modalDialogClass: 'modal-lg',
      });

      modalRef.componentInstance.id = id;
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.uname = uname;
      return modalRef;
    } else {
      const modalRef = this.ngbModal.open(theComponent);

      modalRef.componentInstance.id = id;
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.uname = uname;
      return modalRef;
    }
  }
}
