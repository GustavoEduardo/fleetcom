import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input() searchQuery: string = '';

  @Output() searchEmit = new EventEmitter<string>();

  emitSearch() {
    this.searchEmit.emit(this.searchQuery);
  }
}
