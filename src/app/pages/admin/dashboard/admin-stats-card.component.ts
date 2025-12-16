import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-stats-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stats-card">
      <mat-card-content>
        <div class="stats-header">
          <div class="stats-icon" [class]="color">
            <mat-icon>{{ icon }}</mat-icon>
          </div>
          <div class="stats-trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
            <mat-icon>{{ trend > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
            <span>{{ trend }}%</span>
          </div>
        </div>
        
        <div class="stats-info">
          <h3 class="stats-value">{{ value }}</h3>
          <p class="stats-title">{{ title }}</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stats-card {
      height: 100%;
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stats-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    mat-card-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .stats-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .stats-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .stats-icon.primary { 
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
    }
    .stats-icon.accent { 
      background: linear-gradient(135deg, #ffa000 0%, #ffc107 100%);
    }
    .stats-icon.warn { 
      background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
    }
    
    .stats-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 20px;
    }

    .stats-trend.positive { 
      color: #2e7d32;
      background: #e8f5e9;
    }
    .stats-trend.negative { 
      color: #c62828;
      background: #ffebee;
    }

    .stats-trend mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .stats-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stats-value {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1a237e;
      font-family: 'Playfair Display', serif;
    }

    .stats-title {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
      font-weight: 500;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminStatsCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() trend: number = 0;
}
