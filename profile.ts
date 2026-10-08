import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,                  // ✅ IMPORTANT
  imports: [CommonModule],           // ✅ needed for Angular features
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']       // ✅ FIX (was styleUrl ❌)
})
export class Profile {

  // ✅ SAVE FUNCTION
  save(){
    alert("✅ Profile Saved Successfully!");
  }

  // ✅ EDIT FUNCTION
  edit(){
    alert("✏ You can now edit your profile");
  }

}