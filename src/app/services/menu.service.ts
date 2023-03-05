import { MenuItem } from './../models/menuitem';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  items: MenuItem[] = [];
  returnedItems: MenuItem[] = [];
  constructor(private storageService: StorageService) {}

  addMenuItems(): void {
    var dashboard: MenuItem = new MenuItem(
      'Dashboard',
      'Administrator',
      '/Home',
      'dashboard',
      'fa-home',
      false
    );
    this.items.push(dashboard);

    var patientsMenu: MenuItem = new MenuItem(
      'Patients',
      'Administrator',
      '',
      'patients',
      'fa-plus-square',
      true
    );
    patientsMenu.SubMenus.push(
      new MenuItem('View', 'Administrator', '/Patients', '', 'fa-binoculars')
    );
    patientsMenu.SubMenus.push(
      new MenuItem(
        'Create',
        'Administrator',
        '/CreatePatients',
        '',
        'fa-plus-square'
      )
    );
    this.items.push(patientsMenu);

    var usersMenu: MenuItem = new MenuItem(
      'Users',
      'Administrator',
      '',
      'users',
      'fa-user'
    );
    usersMenu.SubMenus.push(
      new MenuItem('View', 'Administrator', '/Users', '', 'fa-binoculars')
    );
    usersMenu.SubMenus.push(
      new MenuItem('Create', 'Administrator', '/register', '', 'fa-plus-square')
    );
    this.items.push(usersMenu);

    var appointmentMenu: MenuItem = new MenuItem(
      'Appointments',
      'Administrator',
      '',
      'appointments',
      'fa-code-fork'
    );
    appointmentMenu.SubMenus.push(
      new MenuItem(
        'View',
        'Administrator',
        '/Appointments',
        '',
        'fa-binoculars'
      )
    );

    this.items.push(appointmentMenu);

    var procedureMenu: MenuItem = new MenuItem(
      'Procedures',
      'Administrator',
      '',
      'procedures',
      'fa-certificate'
    );
    procedureMenu.SubMenus.push(
      new MenuItem('View', 'Administrator', '/Procedures', '', 'fa-binoculars')
    );
    procedureMenu.SubMenus.push(
      new MenuItem(
        'View Types',
        'Administrator',
        '/ProcedureTypes',
        '',
        'fa-plus-square'
      )
    );
    this.items.push(procedureMenu);

    var medicationMenu: MenuItem = new MenuItem(
      'Medications',
      'Administrator',
      '',
      'medications',
      'fa-medkit'
    );
    medicationMenu.SubMenus.push(
      new MenuItem('View', 'Administrator', '/Medications', '', 'fa-binoculars')
    );
    medicationMenu.SubMenus.push(
      new MenuItem(
        'View Types',
        'Administrator',
        '/MedicationTypes',
        '',
        'fa-binoculars'
      )
    );
    this.items.push(medicationMenu);

    var recieptMenu: MenuItem = new MenuItem(
      'Reciepts',
      'Administrator',
      '',
      'reciepts',
      'fa-calculator'
    );
    recieptMenu.SubMenus.push(
      new MenuItem('View', 'Administrator', '/Reciepts', '', 'fa-binoculars')
    );
    this.items.push(recieptMenu);

    var labMenu: MenuItem = new MenuItem(
      'Lab',
      'Administrator',
      '',
      'labs',
      'fa-hospital'
    );
    labMenu.SubMenus.push(
      new MenuItem('View Tests', 'Administrator', '/Tests', '', 'fa-binoculars')
    );
    labMenu.SubMenus.push(
      new MenuItem(
        'View Params',
        'Administrator',
        '/TestParameters',
        '',
        'fa-binoculars'
      )
    );
    labMenu.SubMenus.push(
      new MenuItem(
        'Create Report',
        'Administrator',
        '/CreateLabReports',
        '',
        'fa-binoculars'
      )
    );
    labMenu.SubMenus.push(
      new MenuItem(
        'View Report',
        'Administrator',
        '/LabReports',
        '',
        'fa-binoculars'
      )
    );
    this.items.push(labMenu);

    var prescriptionMenu: MenuItem = new MenuItem(
      'Prescriptions',
      'Administrator',
      '',
      'prescriptions',
      'fa-prescription'
    );
    prescriptionMenu.SubMenus.push(
      new MenuItem(
        'View',
        'Administrator',
        '/Prescriptions',
        '',
        'fa-binoculars'
      )
    );
    this.items.push(prescriptionMenu);

    ///Doctor Menu
    var doctordashboard: MenuItem = new MenuItem(
      'Dashboard',
      'Doctor',
      '/Home',
      'dashboard',
      'fa-home'
    );
    this.items.push(doctordashboard);

    var doctorDetailsMenu: MenuItem = new MenuItem(
      'Details',
      'Doctor',
      '',
      'details',
      'fa-plus-square'
    );
    doctorDetailsMenu.SubMenus.push(
      new MenuItem('Patients', 'Doctor', '/Patients', '', 'fa-binoculars')
    );
    doctorDetailsMenu.SubMenus.push(
      new MenuItem(
        'Appointments',
        'Doctor',
        '/Appointments',
        '',
        'fa-binoculars'
      )
    );
    doctorDetailsMenu.SubMenus.push(
      new MenuItem('Procedures', 'Doctor', '/Procedures', '', 'fa-binoculars')
    );
    doctorDetailsMenu.SubMenus.push(
      new MenuItem('Medicines', 'Doctor', '/Medications', '', 'fa-binoculars')
    );
    doctorDetailsMenu.SubMenus.push(
      new MenuItem('Reciepts', 'Doctor', '/Reciepts', '', 'fa-binoculars')
    );
    doctorDetailsMenu.SubMenus.push(
      new MenuItem(
        'Prescriptions',
        'Doctor',
        '/Prescriptions',
        '',
        'fa-binoculars'
      )
    );
    this.items.push(doctorDetailsMenu);

    var doctorslabMenu: MenuItem = new MenuItem(
      'Lab',
      'Doctor',
      '',
      'labs',
      'fa-hospital'
    );
    doctorslabMenu.SubMenus.push(
      new MenuItem('View Report', 'Doctor', '/LabReports', '', 'fa-binoculars')
    );
    this.items.push(doctorslabMenu);
    // Staff Menu

    var Staffdashboard: MenuItem = new MenuItem(
      'Dashboard',
      'Staff',
      '/Home',
      'dashboard',
      'fa-home'
    );
    this.items.push(Staffdashboard);

    var StaffpatientsMenu: MenuItem = new MenuItem(
      'Patients',
      'Staff',
      '',
      'patients',
      'fa-plus-square'
    );
    StaffpatientsMenu.SubMenus.push(
      new MenuItem('View', 'Staff', '/Patients', '', 'fa-binoculars')
    );
    StaffpatientsMenu.SubMenus.push(
      new MenuItem('Create', 'Staff', '/Patients/Create', '', 'fa-plus-square')
    );
    this.items.push(StaffpatientsMenu);
    var staffDetailsMenu: MenuItem = new MenuItem(
      'Details',
      'Staff',
      '',
      'details',
      'fa-plus-square'
    );
    staffDetailsMenu.SubMenus.push(
      new MenuItem(
        'Appointments',
        'Staff',
        '/Appointments',
        '',
        'fa-binoculars'
      )
    );
    staffDetailsMenu.SubMenus.push(
      new MenuItem('Procedures', 'Staff', '/Procedures', '', 'fa-binoculars')
    );
    staffDetailsMenu.SubMenus.push(
      new MenuItem('Medicines', 'Staff', '/Medications', '', 'fa-binoculars')
    );
    staffDetailsMenu.SubMenus.push(
      new MenuItem('Reciepts', 'Staff', '/Reciepts', '', 'fa-binoculars')
    );
    staffDetailsMenu.SubMenus.push(
      new MenuItem(
        'Prescriptions',
        'Staff',
        '/Prescriptions',
        '',
        'fa-binoculars'
      )
    );
    this.items.push(staffDetailsMenu);

    var stafflabMenu: MenuItem = new MenuItem(
      'Lab',
      'Staff',
      '',
      'labs',
      'fa-hospital'
    );
    stafflabMenu.SubMenus.push(
      new MenuItem('View Tests', 'Staff', '/Tests', '', 'fa-binoculars')
    );
    stafflabMenu.SubMenus.push(
      new MenuItem(
        'View Params',
        'Staff',
        '/TestParameters',
        '',
        'fa-binoculars'
      )
    );
    stafflabMenu.SubMenus.push(
      new MenuItem(
        'Create Report',
        'Staff',
        '/CreateLabReports',
        '',
        'fa-binoculars'
      )
    );
    stafflabMenu.SubMenus.push(
      new MenuItem('View Report', 'Staff', '/LabReports', '', 'fa-binoculars')
    );
    this.items.push(stafflabMenu);
  }

  getMenu(role: string): MenuItem[] {
    var num: number = 0;
    var i: number = 0;

    for (num = 0; num < this.items.length; num++) {
      var menuItem: MenuItem = this.items[num];
      if (role == menuItem.role) {
        this.returnedItems[i] = menuItem;
        i = i + 1;
      }
    }

    return this.returnedItems;
  }
}
