import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(router: Router) {
    const navAndEvents = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    navAndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-116798031-2', {
        'page_path': event.urlAfterRedirects
      });
    });
  }
}
