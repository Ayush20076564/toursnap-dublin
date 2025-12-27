import { Injectable } from '@angular/core';
import { Haptics } from '@capacitor/haptics';
import { Contacts } from '@capacitor-community/contacts';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export type Buddy = { name: string; phone: string };

@Injectable({ providedIn: 'root' })
export class SafetyService {
  private buddyKey = 'toursnap_buddy';

  getBuddy(): Buddy | null {
    const raw = localStorage.getItem(this.buddyKey);
    return raw ? (JSON.parse(raw) as Buddy) : null;
  }

  setBuddy(b: Buddy) {
    localStorage.setItem(this.buddyKey, JSON.stringify(b));
  }

  private isGranted(p: any): boolean {
    // plugin may return { contacts: 'granted' } OR { granted: true }
    return p?.contacts === 'granted' || p?.granted === true;
  }

  /**
   * Opens native picker if available, otherwise falls back to reading contacts.
   */
  async pickBuddy(): Promise<Buddy | null> {
    try {
      // ✅ Contacts does not work on web (ionic serve)
      if (Capacitor.getPlatform() === 'web') {
        throw new Error('Contacts works only on a real device/emulator, not in browser.');
      }

      // ✅ request permission (handles both response formats)
      const perm = await Contacts.requestPermissions();
      if (!this.isGranted(perm)) return null;

      // ✅ If plugin exposes pickContact, use it (best UX)
      const canPick = typeof (Contacts as any).pickContact === 'function';
      if (canPick) {
        const res: any = await (Contacts as any).pickContact({
          projection: { name: true, phones: true },
        });

        const c = res?.contact ?? res;
        const phone = (c?.phones?.[0]?.number || '').toString().trim();
        const name =
          typeof c?.name === 'string'
            ? c.name
            : (c?.name?.display || c?.name?.given || 'Buddy');

        if (!phone) return null;

        const buddy: Buddy = { name, phone };
        this.setBuddy(buddy);
        return buddy;
      }

      // ✅ fallback: getContacts and pick first with phone
      const result = await Contacts.getContacts({
        projection: { name: true, phones: true },
      });

      const list: any[] = result?.contacts || [];
      const withPhone = list.find((x) => (x?.phones?.[0]?.number || '').toString().trim().length > 0);
      if (!withPhone) return null;

      const phone = (withPhone.phones?.[0]?.number || '').toString().trim();
      const name =
        typeof withPhone.name === 'string'
          ? withPhone.name
          : (withPhone.name?.display || withPhone.name?.given || 'Buddy');

      const buddy: Buddy = { name, phone };
      this.setBuddy(buddy);
      return buddy;
    } catch (e) {
      console.error('[Contacts] pickBuddy failed:', e);
      return null;
    }
  }

  async sosVibrate() {
    await Haptics.vibrate({ duration: 600 });
    await Haptics.vibrate({ duration: 600 });
  }

  async getLocationText(): Promise<string> {
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      return `My location: ${lat}, ${lng}\nhttps://maps.google.com/?q=${lat},${lng}`;
    } catch {
      return 'Location not available (permission denied or GPS off).';
    }
  }
}
