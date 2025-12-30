// src/app/shared/components/loading-button/loading-button.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
})
export class LoadingButtonComponent {
  @Input() loading = false;
  @Input() disabled = false;
  @Input() bgType: 'primary' | 'secondary' = 'primary';

  @Output() clickBt = new EventEmitter();

  clickButton() {
    this.clickBt.emit();
  }
}
