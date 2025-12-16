import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

// Components
// We will create these later
// import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

const routes: Routes = [
  { 
    path: '', 
    // component: AdminDashboardComponent, // To be created
    children: [
      { path: '', loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products/new', loadComponent: () => import('./products/admin-product-form.component').then(m => m.AdminProductFormComponent) }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
