import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { firstValueFrom } from 'rxjs';

export type Place = {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  shortDesc: string;
  tips?: string;
  tags?: string[];
};

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private cache: Place[] | null = null;

  constructor(private http: HttpClient) {}

  // keep this for your Places page (Observable)
  loadPlaces() {
    return this.http.get<Place[]>('assets/data/places.json');
  }

  // ✅ ensures data available for getById/getAll (Promise style)
  async ensureLoaded(): Promise<Place[]> {
    if (this.cache) return this.cache;
    this.cache = await firstValueFrom(this.http.get<Place[]>('assets/data/places.json'));
    return this.cache;
  }

  // ✅ used by place-detail / journal-edit
  getAll(): Place[] {
    return this.cache ?? [];
  }

  // ✅ used by place-detail / journal-edit
  getById(id: string): Place | undefined {
    return (this.cache ?? []).find(p => p.id === id);
  }

  async getCurrentCoords(): Promise<{ lat: number; lng: number } | null> {
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch {
      return null;
    }
  }

  distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const sa =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(sa));
  }
}
