import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {AngularFireModule} from "@angular/fire/compat";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(AngularFireModule.initializeApp({
      "projectId": "angularbusticketapp",
      "appId": "1:783742674408:web:118b221a208da7913db05d",
      "storageBucket": "angularbusticketapp.appspot.com",
      "apiKey": "AIzaSyAPC9rIFj6tPskz4gp2D8H8F6pmZZ4rPpk",
      "authDomain": "angularbusticketapp.firebaseapp.com",
      "messagingSenderId": "783742674408"
    })),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage()))]
};
