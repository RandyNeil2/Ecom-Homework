import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-floating-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="floating-input-container">
      <div class="input-wrapper" [class.focused]="isFocused" [class.has-value]="!!value" [class.error]="!!error">
        <input
          [type]="type"
          [id]="id"
          [value]="value"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          placeholder=" "
          [disabled]="isDisabled"
        />
        <label [for]="id">{{ label }}</label>
      </div>
      <div class="error-message" *ngIf="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .floating-input-container {
      margin-bottom: 1rem;
      width: 100%;
    }

    .input-wrapper {
      position: relative;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      background: white;
      transition: all 0.2s ease;
    }

    .input-wrapper.focused {
      border-color: var(--color-accent, #2563eb);
      box-shadow: 0 0 0 1px var(--color-accent, #2563eb);
    }

    .input-wrapper.error {
      border-color: #ef4444;
    }
    
    .input-wrapper.error.focused {
      box-shadow: 0 0 0 1px #ef4444;
    }

    input {
      width: 100%;
      padding: 1.25rem 0.75rem 0.5rem;
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.875rem;
      color: #1f2937;
      border-radius: 0.375rem;
    }

    label {
      position: absolute;
      left: 0.75rem;
      top: 0.875rem;
      font-size: 0.875rem;
      color: #6b7280;
      pointer-events: none;
      transition: all 0.2s ease;
      transform-origin: left top;
    }

    /* Floating Label Logic */
    input:focus ~ label,
    input:not(:placeholder-shown) ~ label {
      transform: translateY(-0.6rem) scale(0.85);
      color: #6b7280;
    }

    .input-wrapper.focused label {
      color: var(--color-accent, #2563eb);
    }
    
    .input-wrapper.error label {
      color: #ef4444;
    }

    .error-message {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.25rem;
      margin-left: 0.25rem;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingInputComponent),
      multi: true
    }
  ]
})
export class FloatingInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() id: string = '';
  @Input() error: string | null = null;

  value: string = '';
  isFocused: boolean = false;
  isDisabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
