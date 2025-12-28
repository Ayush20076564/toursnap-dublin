import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SafetyService, Buddy } from '../../services/safety.service';
import { Capacitor } from '@capacitor/core';

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
        message:
          'Contacts failed / no contact selected / no phone found. (Make sure you run on device)',
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
    // Vibrate first (your existing behavior)
    await this.safety.sosVibrate();

    // If buddy not set, still show location but cannot send SMS
    if (!this.buddy?.phone) {
      this.locationText = await this.safety.getLocationText();

      (await this.toast.create({
        message: 'No buddy selected. Please select a buddy first.',
        duration: 1800,
      })).present();
      return;
    }

    // Get location text from your service
    this.locationText = await this.safety.getLocationText();

    if (!this.locationText || this.locationText.trim().length === 0) {
      (await this.toast.create({
        message: 'Could not get location. Please enable GPS and try again.',
        duration: 1800,
      })).present();
      return;
    }

    const time = new Date().toLocaleString();
    const msg =
      `🚨 SOS! I need help.\n` +
      `Time: ${time}\n\n` +
      `My location:\n${this.locationText}`;

    // ✅ Open SMS composer with message
    this.openSmsApp(this.buddy.phone, msg);

    (await this.toast.create({
      message: 'Opening SMS to your buddy… ✅',
      duration: 1500,
    })).present();
  }

  callBuddy() {
    if (!this.buddy) return;
    window.open(`tel:${this.buddy.phone}`, '_system');
  }

  async copyLocation() {
    try {
      await navigator.clipboard.writeText(this.locationText || '');
      (await this.toast.create({ message: 'Location copied ✅', duration: 1200 })).present();
    } catch {
      (await this.toast.create({
        message: 'Copy failed (browser restriction).',
        duration: 1500,
      })).present();
    }
  }

  /** Opens native SMS app with pre-filled message */
  private openSmsApp(phone: string, message: string) {
    const encoded = encodeURIComponent(message);
    const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

    // iOS prefers &body=, Android prefers ?body=
    const smsUrl =
      platform === 'ios'
        ? `sms:${phone}&body=${encoded}`
        : `sms:${phone}?body=${encoded}`;

    // Use window.location for best compatibility on devices
    window.location.href = smsUrl;
  }
}
