import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/authentication/pages/login/login')
        .then(c => c.Login)
  },


  {
    path: 'dashboard',

  canActivate: [authGuard],

  loadComponent: () =>
    import('./shared/layouts/dashboard-layout/dashboard-layout')
      .then(c => c.DashboardLayout),


    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard')
            .then(c => c.Dashboard)
      },

      {
        path: 'patients',
        loadComponent: () =>
          import('./features/patient/pages/patient-list/patient-list')
            .then(c => c.PatientList)
      },

      {
        path: 'departments',
        loadComponent: () =>
          import('./features/department/pages/department-list/department-list')
            .then(c => c.DepartmentList)
      },

      {
        path: 'doctors',
        loadComponent: () =>
          import('./features/doctor/pages/doctor-list/doctor-list')
            .then(m => m.DoctorList)
      },

      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/appointment/pages/appointment-list/appointment-list')
            .then(m => m.AppointmentList)
      },

      {
        path: 'medical-records',
        loadComponent: () =>
          import('./features/medical-record/pages/medical-record-list/medical-record-list')
            .then(m => m.MedicalRecordList)
      },

      {
        path: 'laboratory',
        loadComponent: () =>
          import('./features/laboratory/pages/laboratory-test-list/laboratory-test-list')
            .then(m => m.LaboratoryTestList)
      },

      {
        path: 'laboratory-orders',
        loadComponent: () =>
          import('./features/laboratory/pages/laboratory-order-list/laboratory-order-list')
            .then(m => m.LaboratoryOrderList)
      },

      {
        path: 'laboratory-results',
        loadComponent: () =>
          import('./features/laboratory/pages/laboratory-result-list/laboratory-result-list')
            .then(m => m.LaboratoryResultList)
      },

      {
        path: 'pharmacy',
        loadComponent: () =>
          import('./features/pharmacy/pages/medicines/medicines')
            .then(m => m.Medicines)
      },

      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./features/pharmacy/pages/prescriptions/prescriptions')
            .then(m => m.Prescriptions)
      },

      {
        path: 'prescription-items',
        loadComponent: () =>
          import('./features/pharmacy/pages/prescription-items/prescription-items')
            .then(m => m.PrescriptionItems)
      },

      {
        path: 'billing',
        loadComponent: () =>
          import('./features/billing/pages/billing/billing')
            .then(m => m.Billing)
      },

      {
        path: 'billing/payments',
        loadComponent: () =>
          import('./features/billing/pages/payments/payments')
            .then(m => m.Payments)
      },

      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notification/pages/notification-list/notification-list')
            .then(m => m.NotificationListComponent)
      },

      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/inventory/pages/inventory/inventory')
            .then(m => m.Inventory)
      },

      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/pages/reports/reports')
            .then(m => m.Reports)
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings')
            .then(m => m.SettingsComponent)
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./features/authentication/pages/profile/profile')
            .then(m => m.Profile)
      },

      {
        path: 'change-password',
        loadComponent: () =>
          import('./features/authentication/pages/change-password/change-password')
            .then(m => m.ChangePassword)
      }

    ]

  },

  {
    path: '**',
    redirectTo: 'login'
  }

];