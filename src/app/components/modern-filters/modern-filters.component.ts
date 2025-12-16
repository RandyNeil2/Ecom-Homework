import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

export interface FilterValues {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  minRating: number;
}

@Component({
  standalone: true,
  selector: 'app-modern-filters',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule,
    MatListModule,
  ],
  templateUrl: './modern-filters.component.html',
  styleUrls: ['./modern-filters.component.css'],
})
export class ModernFiltersComponent {
  private fb = inject(FormBuilder);

  @Input() initialFilters: Partial<FilterValues> = {};
  @Output() filtersChange = new EventEmitter<FilterValues>();
  @Output() clearFilters = new EventEmitter<void>();

  filterForm: FormGroup = this.fb.group({
    search: [''],
    category: ['all'],
    minPrice: [0],
    maxPrice: [100],
    sortBy: ['-created_at'],
    minRating: [0],
  });

  @Input() categoriesList: string[] | null = [];

  categories = [
    { value: 'all', label: 'All Categories' }
  ];

  ngOnChanges() {
    if (this.categoriesList) {
      this.categories = [
        { value: 'all', label: 'All Categories' },
        ...this.categoriesList.map(c => ({ value: c, label: c }))
      ];
    }
  }

  sortOptions = [
    { value: '-created_at', label: 'Newest First' },
    { value: 'created_at', label: 'Oldest First' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-name', label: 'Name: Z-A' },
    { value: 'name', label: 'Name: A-Z' },
  ];

  ngOnInit() {
    if (this.initialFilters) {
      this.filterForm.patchValue(this.initialFilters);
    }
    this.filterForm.valueChanges.subscribe((values) => {
      this.filtersChange.emit(values);
    });
  }

  onClear() {
    this.filterForm.reset({
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 100,
      sortBy: '-created_at',
      minRating: 0,
    });
    this.clearFilters.emit();
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  get activeFiltersCount(): number {
    const values = this.filterForm.value;
    let count = 0;
    if (values.search) count++;
    if (values.category !== 'all') count++;
    if (values.minPrice > 0 || values.maxPrice < 100) count++;
    if (values.minRating > 0) count++;
    return count;
  }
}

