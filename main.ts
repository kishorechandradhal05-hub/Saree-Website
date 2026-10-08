import { bootstrapApplication } from '@angular/platform-browser';

import {
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';

import { appConfig } from './app/app.config';

import { App } from './app/app';

import { routes } from './app/app.routes';

// Firebase
import { initializeApp } from 'firebase/app';

import { environment } from './environments/environment';

// =========================
// INITIALIZE FIREBASE
// =========================

initializeApp(environment.firebase);

// =========================
// BOOTSTRAP ANGULAR
// =========================

bootstrapApplication(App, {

  ...appConfig,

  providers: [

    ...(appConfig.providers || []),

    provideRouter(

      routes,

      withInMemoryScrolling({

        scrollPositionRestoration: 'enabled',

        anchorScrolling: 'enabled'

      })

    )

  ]

})

.catch((err) => console.error(err));