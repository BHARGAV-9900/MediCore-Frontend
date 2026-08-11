export interface Settings {
  id: number;

  hospitalName: string;
  hospitalEmail: string;
  hospitalPhone: string;
  hospitalAddress: string;

  currency: string;
  dateFormat: string;
  timeZone: string;

  defaultAppointmentDuration: number;

  lowStockThreshold: number;
  expiryWarningDays: number;

  enableNotifications: boolean;
  enableAppointmentNotifications: boolean;
  enableBillingNotifications: boolean;
  enableLaboratoryNotifications: boolean;
}