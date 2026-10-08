import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { LoaderComponent } from './loading/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, LoaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  loading = false;
  cartItems: any[] = [];

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef   // ✅ ADD THIS
  ) {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.loading = true;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {

        setTimeout(() => {
          this.loading = false;

          this.cd.detectChanges();   // ✅ FIX HERE
        }, 500);

      }

    });

  }

  // ⚠️ Better performance fix (important)
  getCount() {
    return this.cartItems.length;
  }

}