import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PlacesService, Place } from '../../services/places.service';

type CategoryTab = { key: string; label: string; icon: string };

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class PlacesPage implements OnInit {
  q = '';
  category = 'all';
  loading = true;

  allPlaces: Place[] = [];
  filtered: Place[] = [];

  // distance lookup (id -> km)
  distanceById: Record<string, number> = {};
  lastCoords: { lat: number; lng: number } | null = null;

  tabs: CategoryTab[] = [
    { key: 'all', label: 'All', icon: 'apps-outline' },
    { key: 'Museum', label: 'Museums', icon: 'business-outline' },
    { key: 'Food', label: 'Food', icon: 'restaurant-outline' },
    { key: 'Nature', label: 'Nature', icon: 'leaf-outline' },
    { key: 'Culture', label: 'Culture', icon: 'musical-notes-outline' },
  ];

  constructor(private places: PlacesService, private toast: ToastController) {}

  ngOnInit() {
    this.places.loadPlaces().subscribe({
      next: (data) => {
        this.allPlaces = data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        (await this.toast.create({ message: 'Failed to load places.json', duration: 1800 })).present();
      },
    });
  }

  applyFilters() {
    const q = (this.q || '').trim().toLowerCase();

    let list = [...this.allPlaces];

    if (this.category !== 'all') {
      list = list.filter((p) => p.category === this.category);
    }

    if (q) {
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.shortDesc || '').toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }

    // If we already have distances, keep list sorted by distance
    if (Object.keys(this.distanceById).length) {
      list.sort((a, b) => (this.distanceById[a.id] ?? 999999) - (this.distanceById[b.id] ?? 999999));
    } else {
      // otherwise, simple alphabetical
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filtered = list;
  }

  async sortByNearMe() {
    this.loading = true;

    const coords = await this.places.getCurrentCoords();
    if (!coords) {
      this.loading = false;
      (await this.toast.create({ message: 'Location not available (permission/GPS)', duration: 1800 })).present();
      return;
    }

    this.lastCoords = coords;
    this.distanceById = {};

    for (const p of this.allPlaces) {
      this.distanceById[p.id] = this.places.distanceKm(coords, { lat: p.lat, lng: p.lng });
    }

    this.loading = false;
    this.applyFilters();
    (await this.toast.create({ message: 'Sorted by nearest ✅', duration: 1200 })).present();
  }

  getKm(id: string): string | null {
    const v = this.distanceById[id];
    if (v === undefined || v === null) return null;
    return `${v.toFixed(1)} km`;
  }

  onCategoryChange(v: string) {
    this.category = v;
    this.applyFilters();
  }

  clearSearch() {
    this.q = '';
    this.applyFilters();
  }
}
