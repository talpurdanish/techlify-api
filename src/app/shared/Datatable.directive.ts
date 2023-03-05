import { Directive } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Directive({
  selector: '[appDatatable]',
})
export class DatatableDirective {
  constructor() {}
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;

  reload() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
