import { NgTemplateOutlet } from '@angular/common';
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  standalone: true,
  imports: [MatIconModule, NgTemplateOutlet],
})
export class DrawerComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() titleTemplate: TemplateRef<any> | undefined;

  @Output() closed = new EventEmitter<void>();

  close() {
    this.open = false;
    this.closed.emit();
  }
}
