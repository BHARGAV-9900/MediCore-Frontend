import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../../shared/material/material';
import { Bill } from '../../models/bill';
import { BillItem } from '../../models/bill-item';
import { BillService } from '../../services/bill.service';
import { BillItemService } from '../../services/bill-item.service';
import { BillItemDialog } from '../../dialogs/bill-item-dialog/bill-item-dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-bill-items',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  templateUrl: './bill-items.html',
  styleUrl: './bill-items.scss'
})
export class BillItems implements OnInit {
  private readonly billService = inject(BillService);
  private readonly itemService = inject(BillItemService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  bills: Bill[] = [];
  items: BillItem[] = [];
  selectedBillId = 0;
  loading = false;

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    this.billService.getAll().subscribe({
      next: response => {
        this.bills = response.data ?? [];

        const selectedStillExists = this.bills.some(x => x.id === this.selectedBillId);

        if (!selectedStillExists) {
          this.selectedBillId = this.bills.length ? this.bills[0].id : 0;
        }

        this.loading = false;
        this.loadItems();
      },
      error: error => {
        this.loading = false;
        this.notification.error(error?.error?.message ?? 'Unable to load bills');
      }
    });
  }

  onBillChange(): void {
    this.loadItems();
  }

  loadItems(): void {
    if (!this.selectedBillId) {
      this.items = [];
      return;
    }

    this.loading = true;
    this.itemService.getByBill(this.selectedBillId).subscribe({
      next: response => {
        this.items = response.data ?? [];
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.notification.error(error?.error?.message ?? 'Unable to load bill items');
      }
    });
  }

  get selectedBill(): Bill | undefined {
    return this.bills.find(x => x.id === this.selectedBillId);
  }

  get itemsTotal(): number {
    return this.items.reduce((sum, item) => sum + item.totalAmount, 0);
  }

  refresh(): void {
    this.loadBills();
  }

  addItem(): void {
    if (!this.selectedBillId) return;

    const ref = this.dialog.open(BillItemDialog, {
      width: '560px',
      maxWidth: '95vw',
      disableClose: true,
      data: { billId: this.selectedBillId }
    });

    ref.afterClosed().subscribe(result => {
      if (result) this.refresh();
    });
  }

  editItem(item: BillItem): void {
    const ref = this.dialog.open(BillItemDialog, {
      width: '560px',
      maxWidth: '95vw',
      disableClose: true,
      data: { billId: item.billId, item }
    });

    ref.afterClosed().subscribe(result => {
      if (result) this.refresh();
    });
  }

  deleteItem(item: BillItem): void {
    if (!confirm(`Delete "${item.description}" from this bill?`)) return;

    this.loading = true;
    this.itemService.delete(item.id).subscribe({
      next: () => {
        this.notification.success('Bill item deleted successfully');
        this.refresh();
      },
      error: error => {
        this.loading = false;
        this.notification.error(error?.error?.message ?? 'Unable to delete bill item');
      }
    });
  }
}