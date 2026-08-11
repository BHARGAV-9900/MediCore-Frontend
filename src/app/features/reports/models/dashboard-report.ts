export interface DashboardReport {
  totalPatients: number;

  totalDoctors: number;

  totalAppointments: number;

  scheduledAppointments: number;

  completedAppointments: number;

  cancelledAppointments: number;

  noShowAppointments: number;

  totalBills: number;

  totalRevenue: number;

  totalPayments: number;

  totalInventoryItems: number;

  lowStockItems: number;

  expiringInventoryItems: number;
}