export class DatatableOptions {
  static groupColumn: number = 6;
  static domValue: string = 'Bfrtip';

  static GetOptions(id: string): any {
    var NoOrderCols = [0];
    var SearchableCols = [1];
    var ExportCols = [1, ':visible'];
    var InitialOrderCol = 1;
    var callback = id;

    var myOptions: any = {};

    switch (id) {
      case 'appointments':
        NoOrderCols = [5];
        SearchableCols = [1, 2, 3, 4];
        ExportCols = [1, 2, 3, 4, ':visible'];
        InitialOrderCol = 2;
        //callback = "appointments";
        break;
      case 'pendingappointments':
        NoOrderCols = [5];
        SearchableCols = [1, 2, 3, 4];
        ExportCols = [1, 2, 3, 4, ':visible'];
        InitialOrderCol = 0;
        //callback = "pendingappointments";
        break;
      case 'patients':
        NoOrderCols = [0, 7, 8];
        SearchableCols = [1, 2, 3, 4, 5, 6];
        ExportCols = [1, 2, 3, 4, 5, 6, ':visible'];
        InitialOrderCol = 3;
        //callback = "patients";

        break;
      case 'users':
        NoOrderCols = [0, 2, 10, 11];
        SearchableCols = [1, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14];
        ExportCols = [1, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, ':visible'];
        InitialOrderCol = 6;
        //callback = "users";
        break;
      case 'reciepts':
        NoOrderCols = [7, 8];
        SearchableCols = [1, 2, 3, 4, 5, 6];
        ExportCols = [1, 2, 3, 4, 5, 6, ':visible'];
        InitialOrderCol = 7;
        //callback = "reciepts";
        break;
      case 'proceduretypes':
        NoOrderCols = [1];
        SearchableCols = [0];
        ExportCols = [0, ':visible'];
        InitialOrderCol = 0;
        //callback = "proceduretypes";
        break;
      case 'procedures':
        NoOrderCols = [3];
        SearchableCols = [0, 1, 2];
        ExportCols = [0, 1, 2, ':visible'];
        InitialOrderCol = 2;
        //callback = "procedures";
        break;
      case 'prescriptions':
        NoOrderCols = [3];
        SearchableCols = [0, 1, 2];
        ExportCols = [0, 1, 2, ':visible'];
        InitialOrderCol = 0;
        //callback = "prescriptions";
        break;
      case 'tests':
        NoOrderCols = [2];
        SearchableCols = [0, 1];
        ExportCols = [0, 1, ':visible'];
        InitialOrderCol = 0;
        //callback = "tests";
        break;
      case 'testsparameters':
        NoOrderCols = [5];
        SearchableCols = [0, 1, 2, 3, 4];
        ExportCols = [0, 1, 2, 3, 4, ':visible'];
        InitialOrderCol = 0;
        //callback = "testparameters";
        break;
      case 'medications':
        NoOrderCols = [3];
        SearchableCols = [0, 1, 2];
        ExportCols = [0, 1, 2, ':visible'];
        InitialOrderCol = 0;
        //callback = "medications";
        break;
      case 'medicationtypes':
        NoOrderCols = [1];
        SearchableCols = [0];
        ExportCols = [0, ':visible'];
        InitialOrderCol = 0;
        //callback = "medicationtypes";
        break;
      case 'labreports':
        NoOrderCols = [7];
        SearchableCols = [0, 1, 2, 3, 4, 5, 6];
        ExportCols = [0, 1, 2, 3, 4, 5, 6, ':visible'];
        InitialOrderCol = 0;
        //callback = "labreports";
        break;
      case 'pda':
        SearchableCols = [0, 1, 2, 3];
        ExportCols = [0, 1, 2, 3, ':visible'];
        InitialOrderCol = 0;
        break;
      case 'pdr':
        SearchableCols = [0, 1, 2, 3, 4];
        ExportCols = [0, 1, 2, 3, , 4, ':visible'];
        InitialOrderCol = 0;
        break;
    }

    myOptions = {
      lengthMenu: [
        [10, 25, 50, -1],
        ['Show 10 Rows', 'Show 25 Rows', 'Show 50 Rows', 'Show All Rows'],
      ],
      responsive: true,
      columnDefs: [{ orderable: false, targets: NoOrderCols }],
      order: [[InitialOrderCol, 'desc']],
      destroy: true,
      dom: this.domValue,
      // Configure the buttons
      buttons: [
        {
          extend: 'pageLength',
        },
        {
          extend: 'copy',
          text: '<i class="fa fa-copy"></i>',
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print"></i>',
          exportOptions: {
            columns: ExportCols,
          },
        },
        {
          extend: 'collection',
          text: '<i class="fa fa-cog"></i>',
          buttons: ['csv', 'excel', 'pdf'],
        },

        {
          extend: 'colvis',
          text: '<i class="fa fa-columns"></i>',
        },
        {
          text: '<i class="fa fa-refresh"></i>',
          key: 1,
          action: function (e, dt, node, config) {},
        },
      ],
    };

    return myOptions;
  }
}
