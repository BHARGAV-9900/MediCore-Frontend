import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../../shared/material/material';
import { Appointment } from '../../models/appointment';
import { CreateAppointment } from '../../models/create-appointment';
import { UpdateAppointment } from '../../models/update-appointment';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../../patient/services/patient.service';
import { Patient } from '../../../patient/models/patient';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { Doctor } from '../../../doctor/models/doctor';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ...MATERIAL_MODULES],
  templateUrl: './appointment-dialog.html',
  styleUrl: './appointment-dialog.scss'
})
export class AppointmentDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly service = inject(AppointmentService);
  private readonly patientService = inject(PatientService);
  private readonly doctorService = inject(DoctorService);
  private readonly notification = inject(NotificationService);

  readonly data = inject(MAT_DIALOG_DATA, { optional: true }) as Appointment | null;

  patients: Patient[] = [];
  doctors: Doctor[] = [];

  /**
   * Minimum date allowed for an appointment.
   * Format: YYYY-MM-DD
   */
  minDate = this.getTodayDate();

  /**
   * Maximum supported date for the HTML date input.
   * This prevents years beyond four digits.
   */
  maxDate = '9999-12-31';

  readonly hours = Array.from({ length: 12 }, (_, index) => index + 1);
  readonly minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  readonly periods = ['AM', 'PM'];

  form = this.fb.group({
    patientId: [null as number | null, Validators.required],
    doctorId: [null as number | null, Validators.required],
    appointmentDate: ['', Validators.required],
    appointmentHour: [null as number | null, Validators.required],
    appointmentMinute: ['', Validators.required],
    appointmentPeriod: ['', Validators.required],
    reason: ['', [Validators.required, Validators.maxLength(500)]],
    notes: ['', Validators.maxLength(1000)]
  });

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();

    if (this.data) {
      const dateTime = new Date(this.data.appointmentDate);

      this.form.patchValue({
        patientId: this.data.patientId,
        doctorId: this.data.doctorId,
        appointmentDate: this.formatDateForInput(this.data.appointmentDate),
        appointmentHour: this.get12Hour(dateTime),
        appointmentMinute: String(dateTime.getMinutes()).padStart(2, '0'),
        appointmentPeriod: dateTime.getHours() >= 12 ? 'PM' : 'AM',
        reason: this.data.reason,
        notes: this.data.notes
      });
    }
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: response => this.patients = response.data,
      error: error => {
        console.error('Unable to load patients', error);
        this.notification.error(this.getErrorMessage(error, 'Unable to load patients'));
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getAll().subscribe({
      next: response => this.doctors = response.data,
      error: error => {
        console.error('Unable to load doctors', error);
        this.notification.error(this.getErrorMessage(error, 'Unable to load doctors'));
      }
    });
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private formatDateForInput(value: string): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Prevent the browser date control from accepting
   * a year with more than four digits, such as:
   *
   * 199999-11-11
   *
   * The application only supports the normal
   * four-digit calendar year format:
   *
   * 1999-11-11
   */
  normalizeDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!value) {
      return;
    }

    const parts = value.split('-');

    if (parts.length !== 3) {
      return;
    }

    const [year, month, day] = parts;

    if (year.length > 4) {
      const normalizedYear = year.substring(0, 4);
      const normalizedValue = `${normalizedYear}-${month}-${day}`;

      input.value = normalizedValue;

      this.form.controls.appointmentDate.setValue(
        normalizedValue,
        { emitEvent: false }
      );
    }
  }

  private get12Hour(date: Date): number {
    const hour = date.getHours();

    if (hour === 0) return 12;
    if (hour > 12) return hour - 12;

    return hour;
  }

  private buildAppointmentDate(): Date {
    const date = this.form.value.appointmentDate!;
    const hour = this.form.value.appointmentHour!;
    const minute = Number(this.form.value.appointmentMinute!);
    const period = this.form.value.appointmentPeriod!;

    let hour24 = hour;

    if (period === 'AM') {
      if (hour === 12) hour24 = 0;
    } else if (hour !== 12) {
      hour24 = hour + 12;
    }

    const [year, month, day] = date.split('-').map(Number);

    return new Date(
      year,
      month - 1,
      day,
      hour24,
      minute,
      0,
      0
    );
  }

  private buildAppointmentDateString(): string {
    const date = this.form.value.appointmentDate!;
    const hour = this.form.value.appointmentHour!;
    const minute = Number(this.form.value.appointmentMinute!);
    const period = this.form.value.appointmentPeriod!;

    let hour24 = hour;

    if (period === 'AM') {
      if (hour === 12) hour24 = 0;
    } else if (hour !== 12) {
      hour24 = hour + 12;
    }

    return `${date}T${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  }

  private isAppointmentInPast(): boolean {
    return this.buildAppointmentDate() <= new Date();
  }

  createAppointment(): void {
    if (this.isAppointmentInPast()) {
      this.notification.error('Appointment date and time must be in the future');
      return;
    }

    const model: CreateAppointment = {
      patientId: this.form.value.patientId!,
      doctorId: this.form.value.doctorId!,
      appointmentDate: this.buildAppointmentDateString(),
      reason: this.form.value.reason!,
      notes: this.form.value.notes ?? ''
    };

    this.service.create(model).subscribe({
      next: () => {
        this.notification.success('Appointment created successfully');
        this.dialogRef.close(true);
      },
      error: error => {
        console.error(error);
        this.notification.error(this.getErrorMessage(error, 'Unable to create appointment'));
      }
    });
  }

  updateAppointment(): void {
    if (this.isAppointmentInPast()) {
      this.notification.error('Appointment date and time must be in the future');
      return;
    }

    const model: UpdateAppointment = {
      id: this.data!.id,
      appointmentDate: this.buildAppointmentDateString(),
      reason: this.form.value.reason!,
      notes: this.form.value.notes ?? ''
    };

    this.service.update(model).subscribe({
      next: () => {
        this.notification.success('Appointment updated successfully');
        this.dialogRef.close(true);
      },
      error: error => {
        console.error(error);
        this.notification.error(this.getErrorMessage(error, 'Unable to update appointment'));
      }
    });
  }

  private getErrorMessage(error: any, fallback: string): string {
    return error?.error?.message
      || error?.error?.Message
      || error?.message
      || fallback;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}