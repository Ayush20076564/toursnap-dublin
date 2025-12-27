import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SafetyService, Buddy } from '../../services/safety.service';

@Component({
  selector: 'app-safety',
  templateUrl: './safety.page.html',
  styleUrls: ['./safety.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class SafetyPage implements OnInit {
  buddy: Buddy | null = null;
  locationText = '';

  constructor(private safety: SafetyService, private toast: ToastController) {}

  ngOnInit() {
    this.buddy = this.safety.getBuddy();
  }

  async pickBuddy() {
    const b = await this.safety.pickBuddy();

    if (!b) {
      (await this.toast.create({
        message: 'Contacts failed / no contact selected / no phone found. (Make sure you run on device)',
        duration: 2500,
      })).present();
      return;
    }

    this.buddy = b;

    (await this.toast.create({
      message: `Buddy saved: ${b.name}`,
      duration: 1500,
    })).present();
  }

  async sos() {
    await this.safety.sosVibrate();
    this.locationText = await this.safety.getLocationText();

    (await this.toast.create({
      message: 'SOS activated (vibration) ✅',
      duration: 1500,
    })).present();
  }

  callBuddy() {
    if (!this.buddy) return;
    // _system works better on many devices; if it fails, switch back to _self
    window.open(`tel:${this.buddy.phone}`, '_system');
  }

  async copyLocation() {
    try {
      await navigator.clipboard.writeText(this.locationText || '');
      (await this.toast.create({ message: 'Location copied ✅', duration: 1200 })).present();
    } catch {
      (await this.toast.create({ message: 'Copy failed (browser restriction).', duration: 1500 })).present();
    }
  }
}
