import { SidebarItem } from './sidebar-item';

export const SIDEBAR_ITEMS: SidebarItem[] = [

  {
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    route: '/dashboard/dashboard',
    roles: ['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Pharmacist', 'Accountant']
  },

  {
    title: 'Patients',
    icon: 'bi bi-people',
    route: '/dashboard/patients',
    roles: ['Admin', 'Doctor', 'Receptionist']

  },

  {
    title: 'Doctors',
    icon: 'bi bi-person-badge',
    route: '/dashboard/doctors',
    roles: ['Admin', 'Doctor', 'Receptionist']
  },

  {
    title: 'Departments',
    icon: 'bi bi-diagram-3',
    route: '/dashboard/departments',
    roles: ['Admin', 'Receptionist']
  },

  {
    title: 'Appointments',
    icon: 'bi bi-calendar-check',
    route: '/dashboard/appointments',
    roles: ['Admin', 'Doctor', 'Receptionist']
  },

  {
    title: 'Medical Records',
    icon: 'bi bi-file-medical',
    route: '/dashboard/medical-records',
    roles: ['Admin', 'Doctor']
  },

  {
    title: 'Laboratory',
    icon: 'bi bi-eyedropper',
    route: '/dashboard/laboratory',
    roles: ['Admin', 'Lab Technician', 'Doctor']
  },

  {
    title: 'Laboratory Orders',
    icon: 'bi bi-clipboard-pulse',
    route: '/dashboard/laboratory-orders',
    roles: ['Admin', 'Lab Technician', 'Doctor']
  },

  {
    title: 'Laboratory Results',
    icon: 'bi bi-file-medical',
    route: '/dashboard/laboratory-results',
    roles: ['Admin', 'Lab Technician', 'Doctor']
  },

  {
    title: 'Pharmacy',
    icon: 'bi bi-capsule',
    route: '/dashboard/pharmacy',
    roles: ['Admin', 'Pharmacist']
  },

  {
    title: 'Prescriptions',
    icon: 'bi bi-file-medical',
    route: '/dashboard/prescriptions',
    roles: ['Admin', 'Doctor', 'Pharmacist']
  },

  {
    title: 'Prescription Items',
    icon: 'bi bi-file-medical',
    route: '/dashboard/prescription-items',
    roles: ['Admin', 'Doctor', 'Pharmacist']
  },

  {
    title: 'Billing',
    icon: 'bi bi-receipt',
    route: '/dashboard/billing',
    roles: ['Admin', 'Accountant', 'Receptionist']
  },

  {
    title: 'Payments',
    icon: 'bi bi-credit-card',
    route: '/dashboard/billing/payments',
    roles: ['Admin', 'Accountant', 'Receptionist']
  },

  {
    title: 'Notifications',
    icon: 'bi bi-bell',
    route: '/dashboard/notifications',
    roles: ['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Pharmacist', 'Accountant']
  },

  {
    title: 'Inventory',
    icon: 'bi bi-box-seam',
    route: '/dashboard/inventory',
    roles: ['Admin', 'Pharmacist']
  },

  {
    title: 'Reports',
    icon: 'bi bi-bar-chart-line',
    route: '/dashboard/reports',
    roles: ['Admin', 'Accountant']
  },

  {
    title: 'Users',
    route: '/dashboard/users',
    icon: 'bi bi-person-gear',
    roles: ['Admin']
  },

  {
    title: 'Settings',
    icon: 'bi bi-gear',
    route: '/dashboard/settings',
    roles: ['Admin']
  }

];