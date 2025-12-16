import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promo-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="promo-summary" *ngIf="discount > 0">
      <div class="row">
        <span>Subtotal</span>
        <span>{{ subtotal | currency:'EUR' }}</span>
      </div>
      <div class="row discount">
        <span>Discount ({{ code }})</span>
        <span>-{{ discount | currency:'EUR' }}</span>
      </div>
      <div class="row tax">
        <span>Tax (20%)</span>
        <span>{{ tax | currency:'EUR' }}</span>
      </div>
      <div class="row total">
        <span>Total</span>
        <span>{{ total | currency:'EUR' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .promo-summary {
      margin-top: 1rem;
      padding: 1rem;
      background: #f0f0f0;
      border-radius: 4px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .discount { color: green; }
    .total {
      font-weight: bold;
      font-size: 1.2rem;
      border-top: 1px solid #ccc;
      padding-top: 0.5rem;
      margin-top: 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoSummaryComponent {
  @Input() subtotal: number = 0;
  @Input() discount: number = 0;
  @Input() code: string = '';
  
  get tax(): number {
    return (this.subtotal - this.discount) * 0.20;
  }

  get total(): number {
    return (this.subtotal - this.discount) + this.tax;
  }
}
