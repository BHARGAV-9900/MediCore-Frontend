import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/authentication/pages/login/login').then(c => c.Login)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layouts/dashboard-layout/dashboard-layout').then(c => c.DashboardLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(c => c.Dashboard) },
      { path: 'patients', canActivate: [roleGuard], data: { roles: ['Admin','Doctor','Receptionist'] }, loadComponent: () => import('./features/patient/pages/patient-list/patient-list').then(c => c.PatientList) },
      { path: 'departments', canActivate: [roleGuard], data: { roles: ['Admin','Receptionist'] }, loadComponent: () => import('./features/department/pages/department-list/department-list').then(c => c.DepartmentList) },
      { path: 'doctors', canActivate: [roleGuard], data: { roles: ['Admin','Doctor','Receptionist'] }, loadComponent: () => import('./features/doctor/pages/doctor-list/doctor-list').then(m => m.DoctorList) },
      { path: 'appointments', canActivate: [roleGuard], data: { roles: ['Admin','Doctor','Receptionist'] }, loadComponent: () => import('./features/appointment/pages/appointment-list/appointment-list').then(m => m.AppointmentList) },
      { path: 'medical-records', canActivate: [roleGuard], data: { roles: ['Admin','Doctor'] }, loadComponent: () => import('./features/medical-record/pages/medical-record-list/medical-record-list').then(m => m.MedicalRecordList) },
      { path: 'laboratory', canActivate: [roleGuard], data: { roles: ['Admin','Lab Technician','Doctor'] }, loadComponent: () => import('./features/laboratory/pages/laboratory-test-list/laboratory-test-list').then(m => m.LaboratoryTestList) },
      { path: 'laboratory-orders', canActivate: [roleGuard], data: { roles: ['Admin','Lab Technician','Doctor'] }, loadComponent: () => import('./features/laboratory/pages/laboratory-order-list/laboratory-order-list').then(m => m.LaboratoryOrderList) },
      { path: 'laboratory-results', canActivate: [roleGuard], data: { roles: ['Admin','Lab Technician','Doctor'] }, loadComponent: () => import('./features/laboratory/pages/laboratory-result-list/laboratory-result-list').then(m => m.LaboratoryResultList) },
      { path: 'pharmacy', canActivate: [roleGuard], data: { roles: ['Admin','Pharmacist'] }, loadComponent: () => import('./features/pharmacy/pages/medicines/medicines').then(m => m.Medicines) },
      { path: 'prescriptions', canActivate: [roleGuard], data: { roles: ['Admin','Doctor','Pharmacist'] }, loadComponent: () => import('./features/pharmacy/pages/prescriptions/prescriptions').then(m => m.Prescriptions) },
      { path: 'prescription-items', canActivate: [roleGuard], data: { roles: ['Admin','Doctor','Pharmacist'] }, loadComponent: () => import('./features/pharmacy/pages/prescription-items/prescription-items').then(m => m.PrescriptionItems) },
      { path: 'billing', canActivate: [roleGuard], data: { roles: ['Admin','Accountant','Receptionist'] }, loadComponent: () => import('./features/billing/pages/billing/billing').then(m => m.Billing) },
      { path: 'billing/items', canActivate: [roleGuard], data: { roles: ['Admin','Accountant','Receptionist'] }, loadComponent: () => import('./features/billing/pages/bill-items/bill-items').then(m => m.BillItems) },
      { path: 'billing/payments', canActivate: [roleGuard], data: { roles: ['Admin','Accountant','Receptionist'] }, loadComponent: () => import('./features/billing/pages/payments/payments').then(m => m.Payments) },
      { path: 'notifications', canActivate: [roleGuard], data: { roles: ['Admin','Doctor','Receptionist','Lab Technician','Pharmacist','Accountant'] }, loadComponent: () => import('./features/notification/pages/notification-list/notification-list').then(m => m.NotificationListComponent) },
      { path: 'inventory', canActivate: [roleGuard], data: { roles: ['Admin','Pharmacist'] }, loadComponent: () => import('./features/inventory/pages/inventory/inventory').then(m => m.Inventory) },
      { path: 'reports', canActivate: [roleGuard], data: { roles: ['Admin','Accountant'] }, loadComponent: () => import('./features/reports/pages/reports/reports').then(m => m.Reports) },
      { path: 'settings', canActivate: [roleGuard], data: { roles: ['Admin'] }, loadComponent: () => import('./features/settings/pages/settings/settings').then(m => m.SettingsComponent) },
      { path: 'users', canActivate: [roleGuard], data: { roles: ['Admin'] }, loadComponent: () => import('./features/user/pages/user-list/user-list').then(m => m.UserList) },
      { path: 'profile', loadComponent: () => import('./features/authentication/pages/profile/profile').then(m => m.Profile) },
      { path: 'change-password', loadComponent: () => import('./features/authentication/pages/change-password/change-password').then(m => m.ChangePassword) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];