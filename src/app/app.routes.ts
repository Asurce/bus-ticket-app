import {Routes} from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {RegisterPageComponent} from "./pages/register-page/register-page.component";
import {JourneyPageComponent} from "./pages/journey-page/journey-page.component";
import {TicketsPageComponent} from "./pages/tickets-page/tickets-page.component";
import {authGuard, journeyGuard, loginGuard} from "./shared/services/auth.guard";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {TicketPreviewPageComponent} from "./pages/ticket-preview-page/ticket-preview-page.component";

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent, canActivate: [loginGuard]},
  {path: 'register', component: RegisterPageComponent, canActivate: [loginGuard]},
  {path: 'profile', component: ProfilePageComponent, canActivate: [authGuard]},
  {path: 'tickets', component: TicketsPageComponent, canActivate: [authGuard]},
  {path: 'journey', component: JourneyPageComponent, canActivate: [journeyGuard]},
  {path: 'tickets/:id', component: TicketPreviewPageComponent, canActivate: [authGuard]},
  {path: '**', redirectTo: ''}
];
