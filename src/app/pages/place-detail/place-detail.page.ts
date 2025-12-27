import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlacesService, Place } from '../../services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PlaceDetailPage implements OnInit {
  place: Place | null = null;

  constructor(
    private route: ActivatedRoute,
    private places: PlacesService,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    await this.places.ensureLoaded();
    this.place = this.places.getById(id) || null;

    if (!this.place) {
      (await this.toast.create({ message: `Place not found for id: ${id}`, duration: 2000 })).present();
    }
  }

  /**
   * Open native maps with destination coordinates
   * - iOS: Apple Maps via maps://
   * - Android/others: Google Maps via https://
   */
  async openNavigate() {
    if (!this.place) {
      (await this.toast.create({ message: 'Place not loaded yet.', duration: 1500 })).present();
      return;
    }

    const lat = this.place.lat;
    const lng = this.place.lng;
    const label = encodeURIComponent(this.place.name);

    // iOS check (simple)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const url = isIOS
      ? `maps://?q=${label}&ll=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    // open in system browser/app
    window.open(url, '_system');
  }
}
