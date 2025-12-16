import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-checkout-stepper',
  imports: [CommonModule, RouterModule, MatStepperModule, MatIconModule],
  template: `
    <div class="checkout-stepper">
      <div class="stepper-steps">
        <!-- Step 1 -->
        <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
          <div class="step-circle mat-elevation-z2">
            <mat-icon *ngIf="currentStep > 1">check</mat-icon>
            <span *ngIf="currentStep <= 1">1</span>
          </div>
          <div class="step-label">Summary</div>
        </div>
        
        <div class="step-connector" [class.completed]="currentStep > 1"></div>
        
        <!-- Step 2 -->
        <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
          <div class="step-circle mat-elevation-z2">
            <mat-icon *ngIf="currentStep > 2">check</mat-icon>
            <span *ngIf="currentStep <= 2">2</span>
          </div>
          <div class="step-label">Address</div>
        </div>
        
        <div class="step-connector" [class.completed]="currentStep > 2"></div>
        
        <!-- Step 3 -->
        <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
          <div class="step-circle mat-elevation-z2">
            <mat-icon *ngIf="currentStep > 3">check</mat-icon>
            <span *ngIf="currentStep <= 3">3</span>
          </div>
          <div class="step-label">Confirm</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-stepper {
      margin-bottom: 48px;
      padding: 24px 0;
    }

    .stepper-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .step-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      border: 2px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #999;
      transition: all 0.3s ease;
    }

    .step.active .step-circle {
      border-color: var(--mat-sys-primary);
      color: var(--mat-sys-primary);
    }

    .step.completed .step-circle {
      background: var(--mat-sys-primary);
      border-color: var(--mat-sys-primary);
      color: white;
    }

    .step-label {
      margin-top: 12px;
      font-size: 0.875rem;
      color: #999;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .step.active .step-label {
      color: var(--mat-sys-primary);
      font-weight: 600;
    }

    .step.completed .step-label {
      color: var(--mat-sys-primary);
    }

    .step-connector {
      flex: 1;
      height: 2px;
      background: #e0e0e0;
      margin: 0 12px;
      margin-bottom: 24px; /* Align with circle center roughly */
      transform: translateY(-14px); /* Adjust based on label height */
      transition: background 0.3s ease;
    }

    .step-connector.completed {
      background: var(--mat-sys-primary);
    }

    @media (max-width: 600px) {
      .step-circle {
        width: 32px;
        height: 32px;
        font-size: 0.875rem;
      }
      
      .step-label {
        font-size: 0.75rem;
      }
      
      .step-connector {
        transform: translateY(-12px);
      }
    }
  `]
})
export class CheckoutStepperComponent {
  @Input() currentStep: number = 1;
}

