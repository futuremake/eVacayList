import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environments';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR  } from '@angular/fire/compat/firestore'
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // provideAuth0 ({
    //   domain: environment.auth0.domain,
    //   clientId: environment.auth0.clientId,
    //   authorizationParams: {
    //     redirect_uri: window.location.origin
    //   }
    // }),
    // provideBrowserGlobalErrorListeners()
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['http://localhost:8080'] : ['http://localhost:8080'] },
  ]

};
