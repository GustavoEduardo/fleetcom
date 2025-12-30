import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tabs-navigation',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIcon],
  templateUrl: './tabs-navigation.component.html',
  styleUrl: './tabs-navigation.component.scss',
})
export class TabsNavigationComponent {
  links = [
    { label: 'Início', route: '/home', icon: 'home' },
    {
      label: 'AGENDAMENTOS',
      route: '/reservations',
      icon: 'article',
    },
    { label: 'CENTRAL', route: '/favorites', icon: 'phone' },
    { label: 'PERFIL', route: '/profile', icon: 'person' },
  ];

  // _outline

  activeLink = '/favorites';

  icons: Record<string, SafeHtml> = {};

  constructor() {}
}
