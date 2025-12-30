import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { LoginRedirectGuard } from './guards/login-redirect.guard';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  // rota pública
  { path: 'login', component: LoginComponent, canActivate: [LoginRedirectGuard] },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'reservations', component: ReservationComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

