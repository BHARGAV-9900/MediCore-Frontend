import { SidebarItem } from './sidebar-item';

export const SIDEBAR_ITEMS: SidebarItem[] = [

  {
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    route: '/dashboard/dashboard'
  },

  {
    title: 'Patients',
    icon: 'bi bi-people',
    route: '/dashboard/patients'
  },

  {
    title: 'Doctors',
    icon: 'bi bi-person-badge',
    route: '/dashboard/doctors'
  },

  {
    title: 'Departments',
    icon: 'bi bi-diagram-3',
    route: '/dashboard/departments'
  },

  {
    title: 'Appointments',
    icon: 'bi bi-calendar-check',
    route: '/dashboard/appointments'
  },

  {
    title: 'Medical Records',
    icon: 'bi bi-file-medical',
    route: '/dashboard/medical-records'
  },

  {
    title: 'Laboratory',
    icon: 'bi bi-eyedropper',
    route: '/dashboard/laboratory'
  },

  {
    title: 'Laboratory Orders',
    icon: 'bi bi-clipboard-pulse',
    route: '/dashboard/laboratory-orders'
  },

  {
    title: 'Laboratory Results',
    icon: 'bi bi-file-medical',
    route: '/dashboard/laboratory-results'
  },

  {
    title: 'Pharmacy',
    icon: 'bi bi-capsule',
    route: '/dashboard/pharmacy'
  },

  {
    title: 'Prescriptions',
    icon: 'bi bi-file-medical',
    route: '/dashboard/prescriptions'
  },

  {
    title: 'prescription Items',
    icon: 'bi bi-file-medical',
    route: '/dashboard/prescription-items'
  },

  {
    title: 'Billing',
    icon: 'bi bi-receipt',
    route: '/dashboard/billing'
  },

  {
    title: 'Payments',
    icon: 'bi bi-credit-card',
    route: '/dashboard/billing/payments'
  },

  {
    title: 'Notifications',
    icon: 'bi bi-bell',
    route: '/dashboard/notifications'
  },

  {
    title: 'Inventory',
    icon: 'bi bi-box-seam',
    route: '/dashboard/inventory'
  },

  {
    title: 'Reports',
    icon: 'bi bi-bar-chart-line',
    route: '/dashboard/reports'
  },

  {
    title: 'Settings',
    icon: 'bi bi-gear',
    route: '/dashboard/settings'
  }

];