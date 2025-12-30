import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.scss',
})
export class ButtonIconComponent {
  @Input() text: string = '';

  @Output() clickEmit = new EventEmitter<string>();

  emitClick() {
    this.clickEmit.emit();
  }
}
