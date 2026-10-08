import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= FORM FIELDS =================
  Name = '';
  mobile_number = '';
  address_line = '';
  landmark = '';
  state = '';
  city = '';
  pincode = '';

  // ================= API CONFIG =================
  apiUrl = "https://script.google.com/macros/s/AKfycbyexmKEYRrJ_b2xatS40uwxMqZm5VQjTnk92ALwxZ8tUPFDmonme7YFDi3Wk9kjfNvjtQ/exec";

  // ================= STATES & CITIES =================
 states: string[] = [

  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",

  // Union Territories

  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"

];
  citiesByState: any = {
    "Odisha": ["Bhubaneswar", "Cuttack", "Puri"],
    "Bihar": ["Patna", "Gaya"],
    "Delhi": ["New Delhi"],
    "Maharashtra": ["Mumbai", "Pune"],
    "Karnataka": ["Bengaluru"]
  };
  availableCities: string[] = [];

  onStateChange() {
    this.availableCities = this.citiesByState[this.state] || [];
    this.city = '';
  }

  // ================= UI STATES =================
  showPopup = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success'; 
  isLoading = false; 

  // ================= REGISTRATION LOGIC =================
  registerUser() {
    if (!this.Name || !this.mobile_number || !this.address_line || !this.state || !this.city || !this.pincode) {
      this.showMessage("Please fill all fields", "error");
      return;
    }

    this.isLoading = true;

    const url = `${this.apiUrl}?action=register` +
      `&Name=${encodeURIComponent(this.Name)}` +
      `&mobile_number=${encodeURIComponent(this.mobile_number)}` +
      `&address_line=${encodeURIComponent(this.address_line)}` +
      `&landmark=${encodeURIComponent(this.landmark)}` +
      `&state=${encodeURIComponent(this.state)}` +
      `&city=${encodeURIComponent(this.city)}` +
      `&pincode=${encodeURIComponent(this.pincode)}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.status === "success") {
          this.showMessage("Registered Successfully!", "success");
          this.resetForm();
        } else {
          this.showMessage(res?.message || "Registration Failed", "error");
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessage("Connection Error", "error");
        this.cdr.detectChanges();
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error' = 'success') {
    this.popupMessage = msg;
    this.popupType = type;
    this.showPopup = true;
    this.cdr.detectChanges();
  }

  closePopup() {
    this.showPopup = false;
  }

  resetForm() {
    this.Name = ''; this.mobile_number = ''; this.address_line = '';
    this.landmark = ''; this.state = ''; this.city = ''; this.pincode = '';
  }
}