import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vehicle } from '../../../model/vehicle.model';
import { environment } from '../../../environments/environment';
import { CommonModule, NgClass } from '@angular/common';
import { Reservation } from '../../../model/reservation.model';

@Component({
  selector: 'app-card-car',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './card-car.component.html',
  styleUrl: './card-car.component.scss',
})
export class CardCarComponent {
  @Input() car!: Vehicle;
  @Input() reservation: Reservation | null = null;
  @Input() isButton: boolean = false;

  @Output() selectCard = new EventEmitter();

  api = environment.apiUrl;

  click(car: Vehicle) {
    if (this.isButton) this.selectCard.emit(car);
  }
}
