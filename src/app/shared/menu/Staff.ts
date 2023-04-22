export class Staff {
  public static items = [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-house',
      routerLink: '/',
    },
    {
      label: 'Patients',
      icon: 'fa-solid fa-plus-square',
      items: [
        {
          label: 'View',
          icon: 'pi pi-angle-right',
          routerLink: '/Patients',
        },
        {
          label: 'Create',
          icon: 'pi pi-angle-right',
          routerLink: '/CreatePatient',
        },
      ],
    },

    {
      label: 'Users',
      icon: 'fa-solid fa-user',
      routerLink: '/Users',
    },

    {
      label: 'Appointment',
      icon: 'fa-folid fa-code-fork',
      routerLink: '/Appointments',
    },
    {
      label: 'Procedures & Types',
      icon: 'fa-solid fa-certificate',
      items: [
        {
          label: 'Procedures',
          icon: 'pi pi-angle-right',
          routerLink: '/Procedures',
        },
        {
          label: 'Types',
          icon: 'pi pi-angle-right',
          routerLink: '/ProcedureTypes',
        },
      ],
    },

    {
      label: 'Medication & Types',
      icon: 'fa-solid fa-medkit',
      items: [
        {
          label: 'Medications',
          icon: 'pi pi-angle-right',
          routerLink: '/Medications',
        },
        {
          label: 'Types',
          icon: 'pi pi-angle-right',
          routerLink: '/MedicationTypes',
        },
      ],
    },

    {
      label: 'Reciepts',
      icon: 'fa-solid fa-calculator',
      routerLink: '/Reciepts',
    },
    {
      label: 'Labortory',
      icon: 'fa-solid fa-flask-vial',
      items: [
        {
          label: 'Tests & Params',
          icon: 'fa-solid fa-microscope',
          styleClass: 'sub-menu',
          items: [
            {
              label: 'Tests',
              icon: 'pi pi-angle-right',
              routerLink: '/Tests',
            },
            {
              label: 'Parameters',
              icon: 'pi pi-angle-right',
              routerLink: '/TestParameters',
            },
          ],
        },
        {
          label: 'Reports',
          icon: 'pi pi-book',
          styleClass: 'sub-menu',
          routerLink: '/Reports',
        },
      ],
    },

    {
      label: 'Prescriptions',
      icon: 'fa-solid fa-prescription',
      routerLink: '/Prescriptions',
    },
  ];
}
