import { Routes } from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {RegisterPageComponent} from "./pages/register-page/register-page.component";
import {JourneyPageComponent} from "./pages/journey-page/journey-page.component";
import {TicketsPageComponent} from "./pages/tickets-page/tickets-page.component";

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'journey', component: JourneyPageComponent},
  {path: 'tickets', component: TicketsPageComponent}
];
