import { Component, ChangeDetectionStrategy, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-promo-code-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="promo-input">
      <mat-form-field>
        <mat-label>Promo Code</mat-label>
        <input matInput [formControl]="promoCode" placeholder="SUMMER2025">
      </mat-form-field>
      <button mat-raised-button color="accent" (click)="apply()" [disabled]="promoCode.invalid || promoCode.pristine">
        Apply
      </button>
    </div>
  `,
  styles: [`
    .promo-input {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    mat-form-field {
      flex-grow: 1;
      margin-bottom: -1.25em; /* Fix spacing */
    }
    button {
      height: 56px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoCodeInputComponent {
  @Output() applyCode = new EventEmitter<string>();
  
  promoCode = new FormControl('', [Validators.required, Validators.minLength(3)]);

  apply() {
    if (this.promoCode.valid && this.promoCode.value) {
      this.applyCode.emit(this.promoCode.value);
    }
  }
}
