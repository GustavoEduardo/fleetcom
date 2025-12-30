import { Component } from '@angular/core';
import { TabsNavigationComponent } from '../tabs-navigation/tabs-navigation.component';
import { User } from '../../../model/user.model';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TabsNavigationComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  user!: User;
  showTabs: boolean | undefined;

  constructor(private router: Router, private auth: AuthService) {
    this.router.events.subscribe(() => {
      this.showTabs =
        this.auth.isLoggedIn$ &&
        !['/login', '/register'].includes(this.router.url);
    });
  }
}
