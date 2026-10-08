import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-profile-information',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './profile-information.html',
  styleUrls: ['./profile-information.css']
})
export class ProfileInformation implements OnInit {

  apiUrl = "https://script.google.com/macros/s/AKfycbyexmKEYRrJ_b2xatS40uwxMqZm5VQjTnk92ALwxZ8tUPFDmonme7YFDi3Wk9kjfNvjtQ/exec";

  userData: any = null;
  isLoading: boolean = false;
  mobile_number: string = '';

  // ✅ popup
  showPopup = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';
  redirectToLogin = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit() {

    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      this.showMessage("❌ Please login first!", 'error', true);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);

      // ✅ USE MOBILE NUMBER (NOT EMAIL)
      this.mobile_number = parsed.mobile_number || '';

    } catch {
      this.mobile_number = '';
    }

    if (!this.mobile_number) {
      this.showMessage("❌ Invalid user data", 'error', true);
      return;
    }

    this.fetchProfile();
  }

  // ================= FETCH PROFILE =================
  fetchProfile() {

    this.isLoading = true;
    this.cdRef.detectChanges();

    const url = `${this.apiUrl}?action=login&mobile_number=${this.mobile_number}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {

        if (res.status === 'success' && res.data) {

          this.userData = res.data;

          // ✅ update local storage (important)
          localStorage.setItem('user', JSON.stringify(res.data));

        } else {
          this.userData = null;
          this.showMessage("⚠️ Profile not found", 'error');
        }

        this.isLoading = false;
        this.cdRef.detectChanges();
      },

      error: () => {
        this.isLoading = false;
        this.showMessage("❌ Failed to fetch profile", 'error');
        this.cdRef.detectChanges();
      }
    });
  }

  // ================= UPDATE =================
  updateProfile() {
    this.showMessage("Update feature coming soon 🚀", 'success');
  }

  // ================= LOGOUT =================
  logout() {
    this.showMessage("Logout Successfully", 'success', true);
  }

  // ================= POPUP =================
  showMessage(message: string, type: 'success' | 'error', redirect = false) {
    this.popupMessage = message;
    this.popupType = type;
    this.redirectToLogin = redirect;
    this.showPopup = true;
    this.cdRef.detectChanges();
  }

  onPopupOk() {
    this.showPopup = false;

    if (this.redirectToLogin) {
      localStorage.removeItem('user');
      this.redirectToLogin = false;
      this.router.navigate(['/login']);
    }
  }
}