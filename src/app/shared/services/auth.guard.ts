import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {firstValueFrom} from "rxjs";
import {JourneyService} from "./journey.service";

export const loginGuard: CanActivateFn = async (route, state) => {
  const redirect = inject(Router).createUrlTree(['/']);
  return !!await firstValueFrom(inject(AuthService).currentUser()) ? redirect : true;
};

export const authGuard: CanActivateFn = async (route, state) => {
  const redirect = inject(Router).createUrlTree(['/login']);
  return !!await firstValueFrom(inject(AuthService).currentUser()) ? true : redirect;
};

export const journeyGuard: CanActivateFn = (route, state) => {
  const redirect = inject(Router).createUrlTree(['/']);
  return inject(JourneyService).journeyList == null ? redirect : true;
};

